
import { useData } from '../../dataContext';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useEffect, useState, useMemo } from 'react';
import { useConfig } from '../../configContext';
import CustomButton from '../utils/CustomButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EuroIcon from '@mui/icons-material/Euro';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DescriptionIcon from '@mui/icons-material/Description';
import { Alert, Snackbar, Card, CardContent, Typography, Divider, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function HomeForm({
  mode = "create", // "create" o "edit"
  onDelete = null,
  onSubmit = null,
}) {

  // Context
  const { inserisciDati, modificaDati, rimuoviDati, handleRadioChange, select, setDatas, setModal, datasForUpdate } = useData();
  const { valoriOutcome, valoriIncome, setFormData, formData } = useConfig();
  const [valoriDropdown, setValoriDropdown] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);

  const today = useMemo(() => dayjs(), []);
  const theme = useTheme();
  
  useEffect(() => {
    // In modalità edit, determina il tipo basandoti sui dati
    if (mode === "edit" && datasForUpdate) {
      const outcomeFields = ['Benzina', 'Casa', 'Extra', 'Salute', 'Spesa', 'Investimenti', 'tasse', 'cucito_out'];
      const isOutcome = outcomeFields.some(field => datasForUpdate[field]);
      
      console.log('isOutcome:', isOutcome);
      console.log('valoriOutcome:', valoriOutcome);
      console.log('valoriIncome:', valoriIncome);
      
      if (isOutcome) {
        setValoriDropdown(valoriOutcome);
      } else {
        setValoriDropdown(valoriIncome);
      }
    } else {
      // In modalità create, usa il select normale
      if (select === "outcome") {
        setValoriDropdown(valoriOutcome);
      } else if (select === "income") {
        setValoriDropdown(valoriIncome);
      }
    }
  }, [mode, datasForUpdate, select, valoriOutcome, valoriIncome]);

  // Precompila form in edit
  useEffect(() => {
    if (mode === "edit" && datasForUpdate) {
      
      // Determina il tipo basandoti sui campi presenti in datasForUpdate
      const outcomeFields = ['Benzina', 'Casa', 'Extra', 'Salute', 'Spesa', 'Investimenti', 'tasse', 'cucito_out'];
      const incomeFields = ['Income', 'cucito_in'];
      
      let tipoSpesa = "";
      let importoValore = "";
      
      // Cerca quale campo ha un valore
      for (const field of outcomeFields) {
        if (datasForUpdate[field]) {
          tipoSpesa = field; // Non faccio toLowerCase per ora
          importoValore = datasForUpdate[field];
          console.log(`Trovato campo outcome: ${field} = ${importoValore}`);
          break;
        }
      }
      
      if (!tipoSpesa) {
        for (const field of incomeFields) {
          if (datasForUpdate[field]) {
            tipoSpesa = field; // Non faccio toLowerCase per ora
            importoValore = datasForUpdate[field];
            console.log(`Trovato campo income: ${field} = ${importoValore}`);
            break;
          }
        }
      }

      const newFormData = {
        descrizione: datasForUpdate?.descrizione || "",
        importo: importoValore || "",
        tipologia: tipoSpesa || "",
        data: datasForUpdate?.data || today.format("YYYY-MM-DD"),
      };
      
      console.log('newFormData:', newFormData);
      console.log('formData attuale:', formData);
      
      // Solo aggiorna se diverso da quello attuale
      if (JSON.stringify(formData) !== JSON.stringify(newFormData)) {
        console.log('Aggiornando formData');
        setFormData(newFormData);
      }
    } else if (mode === "create") {
      const newFormData = {
        descrizione: "",
        importo: "",
        tipologia: "",
        data: today.format("YYYY-MM-DD"),
      };
      // Sempre resetta in modalità create per pulire i dati precedenti
      setFormData(newFormData);
    }
  }, [mode, datasForUpdate, today]); // Rimosso setFormData e formData dalle dipendenze

  // Gestione submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "create") {
      inserisciDati({
        tipo: select,
        descrizione: formData.descrizione,
        importo: parseFloat(formData.importo),
        tipologia: select ? formData.tipologia || "" : "",
        data: formData.data || today.format("YYYY-MM-DD"),
      }, "expenses");
      setDatas(prevDatas => [...prevDatas, {
        tipo: select,
        descrizione: formData.descrizione,
        importo: parseFloat(formData.importo),
        tipologia: select ? formData.tipologia || "" : "",
        data: formData.data || today.format("YYYY-MM-DD"),
      }]);
      setFormData({
        descrizione: "",
        importo: "",
        tipologia: "",
        data: today.format("YYYY-MM-DD"),
      });
      if (onSubmit) onSubmit();
    } else if (mode === "edit" && datasForUpdate) {
      modificaDati({
        ...formData,
        tipologia: formData.tipologia,
        descrizione: formData.descrizione,
        importo: parseFloat(formData.importo),
        data: formData.data ? dayjs(formData.data).format("YYYY-MM-DD") : today.format("YYYY-MM-DD"),
      }, datasForUpdate.id, "expenses");
      if (onSubmit) onSubmit();
    }
  };

  // Gestione input
  const handleInputChange = (e) => {
    if (!e) return;
    if (e.$d && e.$d instanceof Date) {
      setFormData(prev => ({ ...prev, data: dayjs(e.$d).format("YYYY-MM-DD") }));
    } else if (e.target) {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Gestione delete
  const handleDelete = () => {
    if (datasForUpdate && datasForUpdate.id) {
      rimuoviDati(datasForUpdate.id, "expenses");
      setModal && setModal("normal");
      if (onDelete) onDelete();
    }
    setOpenAlert(false);
  };

  // UI
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "flex-start", minHeight: "100vh" }}>
      <Card sx={{ width: "100%", maxWidth: 420, mt: 4, boxShadow: 6, borderRadius: 3, background: theme.palette.background.paper, p: 2, color: theme.palette.text.primary }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <DescriptionIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {mode === "create" 
                  ? (formData?.descrizione || "Nuova spesa")
                  : (formData?.descrizione || datasForUpdate?.descrizione || "Modifica dato")
                }
              </Typography>
            </Box>
            {mode === "edit" && (
              <Button
                onClick={() => {
                  console.log('Button clicked, setting openAlert to true');
                  setOpenAlert(true);
                }}
                sx={{ width: 40, padding: 1, borderRadius: "50%", fontWeight: 600, height: 40 }}
              >
                <DeleteIcon sx={{
                  color: theme.palette.error.main
                }}/>
              </Button>
            )}
          </Box>
          <Divider sx={{ mb: 2, bgcolor: theme.palette.divider }} />
          <form method="post" onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {mode === "create" && (
                <RadioGroup defaultValue="outcome" name="tipo">
                  <Box sx={{ display: "flex", justifyContent: "space-evenly", marginTop: "15px" }}>
                    <FormControlLabel
                      value="outcome"
                      onChange={handleRadioChange}
                      checked={select === "outcome"}
                      control={<Radio />}
                      label="Uscita"
                      sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.9rem' } }}
                    />
                    <FormControlLabel
                      value="income"
                      onChange={handleRadioChange}
                      checked={select === "income"}
                      control={<Radio />}
                      label="Entrata"
                      sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.9rem' } }}
                    />
                  </Box>
                </RadioGroup>
              )}
              <TextField
                required
                variant={mode === "edit" ? "outlined" : "standard"}
                label="Descrizione"
                name="descrizione"
                value={formData?.descrizione || ""}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <DescriptionIcon sx={{ mr: 1, color: theme.palette.primary.main }} />,
                  sx: { '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' }, '&.Mui-focused': { boxShadow: 'none', outline: 'none' }, '&:focus': { outline: 'none', boxShadow: 'none' } }
                }}
                sx={{ outline: "none", boxShadow: "none", '&:focus': { outline: "none", boxShadow: "none" } }}
              />
              <TextField
                required
                variant={mode === "edit" ? "outlined" : "standard"}
                label="Importo"
                name="importo"
                step="0.01"
                type="number"
                value={formData?.importo || ""}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <EuroIcon sx={{ mr: 1, color: theme.palette.success.main }} />,
                  sx: { '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' }, '&.Mui-focused': { boxShadow: 'none', outline: 'none' }, '&:focus': { outline: 'none', boxShadow: 'none' } }
                }}
                sx={{ outline: "none", boxShadow: "none", '&:focus': { outline: "none", boxShadow: "none" } }}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Data"
                  format="DD/MM/YYYY"
                  value={formData?.data ? dayjs(formData.data) : today}
                  onChange={handleInputChange}
                  slotProps={{
                    textField: {
                      variant: mode === "edit" ? "outlined" : "standard",
                      required: true,
                      name: "data",
                      InputProps: {
                        startAdornment: <CalendarMonthIcon sx={{ mr: 1, color: theme.palette.warning.main }} />,
                        sx: { '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' }, '&.Mui-focused': { boxShadow: 'none', outline: 'none' }, '&:focus': { outline: 'none', boxShadow: 'none' } }
                      },
                      sx: { outline: "none", boxShadow: "none", '&:focus': { outline: "none", boxShadow: "none" } }
                    },
                  }}
                />
              </LocalizationProvider>
              <FormControl variant={mode === "edit" ? "outlined" : "standard"} sx={{ minWidth: 120 }} required>
                <InputLabel id="demo-simple-select-standard-label">
                  {mode === "edit" ? "Tipo di spesa/income" : (select === "outcome" ? "Tipo di spesa" : "Tipo di income")}
                </InputLabel>
                <Select
                  style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  id="demo-simple-select-standard"
                  name="tipologia"
                  value={formData?.tipologia || ""}
                  onChange={handleInputChange}
                  MenuProps={{
                    disablePortal: true,
                    PaperProps: { style: { backgroundColor: '#121212', border: '1px solid rgba(255, 255, 255, 0.7)' } },
                    MenuListProps: { style: { padding: 0, backgroundColor: '#121212', border: 'none' } }
                  }}
                >
                  {valoriDropdown.map((item) => {
                    console.log('Rendering MenuItem:', item, 'formData.tipologia:', formData?.tipologia);
                    return (
                      <MenuItem
                        key={item}
                        value={item}
                        sx={{ backgroundColor: '#121212', color: 'rgba(255, 255, 255, 0.7)', '&:hover': { backgroundColor: 'rgba(233, 232, 232, 0.18)', color: 'white' } }}
                      >
                        {item.charAt(0) + item.slice(1)}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <CustomButton
                title={mode === "edit" ? "Modifica dato" : "Inserisci"}
                type="submit"
                sx={{ background: theme.palette.primary.secondary, color: "white", fontWeight: 600, mt: 2, outline: "none", boxShadow: "none", '&:hover': { background: theme.palette.primary.dark }, '&:focus': { outline: "none", boxShadow: "none" } }}
              />
            </Box>
          </form>
        </CardContent>
      </Card>
      {openAlert && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
          }}
          onClick={() => setOpenAlert(false)}
        >
          <Box
            sx={{
              backgroundColor: theme.palette.background.paper,
              padding: 3,
              borderRadius: 2,
              boxShadow: 24,
              maxWidth: 400,
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Conferma eliminazione
            </Typography>
            <Typography sx={{ mb: 3 }}>
              Vuoi davvero eliminare questo dato?
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button 
                variant="outlined" 
                onClick={() => setOpenAlert(false)}
              >
                Annulla
              </Button>
              <Button 
                variant="contained" 
                color="error" 
                onClick={handleDelete}
              >
                Elimina
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}