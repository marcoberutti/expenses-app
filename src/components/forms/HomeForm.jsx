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
import { useEffect, useState } from 'react';
import { useConfig } from '../../configContext';
import CustomButton from '../utils/CustomButton';

export default function HomeForm(){
  const { inserisciDati, handleRadioChange, select, setDatas } = useData();
  const { valoriOutcome, valoriIncome, setFormData, formData } = useConfig()
  const today = dayjs();

  const [valoriDropdown, setValoriDropdown] = useState([])

  useEffect(() => {
    if (select === "outcome") {
      setValoriDropdown(valoriOutcome);
    } else if (select === "income") {
      setValoriDropdown(valoriIncome);
    }
  }, [select]); 

  const handleSubmit = (e) => {
    e.preventDefault();

    inserisciDati({
      tipo: e.target.tipo.value,
      descrizione: e.target.descrizione.value,
      importo: parseFloat(e.target.importo.value),
      tipologia: select ? e.target.tipologia?.value || "" : "",
      data: formData.data || today.format("YYYY-MM-DD")
    }, "expenses");
    setDatas(prevDatas => [...prevDatas, {
      tipo: e.target.tipo.value,
      descrizione: e.target.descrizione.value,
      importo: parseFloat(e.target.importo.value),
      tipologia: select ? e.target.tipologia?.value || "" : "",
      data: formData.data || today.format("YYYY-MM-DD")
    }]);
    setFormData({
      descrizione: "",
      importo: "",
      tipologia: "",
      data: today.format("YYYY-MM-DD")
    });
  };

  return (
    <>
      <h2 style={{textAlign:"center", margin:"5px 0"}}>Nuova spesa</h2>
      <form method="post" onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, margin: "0 20% 0 20%" }}>
          <RadioGroup
              defaultValue="outcome"
              name="tipo">
            <Box sx={{ display: "flex", justifyContent: "space-evenly", marginTop:"15px"}}>
              <FormControlLabel 
                value="outcome" 
                onChange={handleRadioChange}
                checked={select === "outcome"}
                control={<Radio />} 
                label="Uscita" 
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontSize: '0.9rem', // Imposta la dimensione del font desiderata
                  },
                }}/>
              <FormControlLabel 
                value="income" 
                onChange={handleRadioChange}
                checked={select === "income"}
                control={<Radio />} 
                label="Entrata" 
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontSize: '0.9rem', // Imposta la dimensione del font desiderata
                  },
                }}/>
            </Box>
          </RadioGroup>
          <TextField 
            required
            variant="standard"
            label="Descrizione" 
            name="descrizione" 
            value={formData?.descrizione || ""}
            onChange={(e) => setFormData(prev => ({ ...prev, descrizione: e.target.value }))}
          />
          <TextField 
            required
            variant="standard"
            label="Importo" 
            name="importo"
            step="0.01"
            type="number"
            value={formData?.importo || ""}
            onChange={(e) => setFormData(prev => ({ ...prev, importo: e.target.value }))}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker 
              label="Data"
              format='DD/MM/YYYY'
              value={formData?.data ? dayjs(formData.data) : today}
              onChange={(newValue) => {
                setFormData(prev => ({ 
                  ...prev, 
                  data: newValue ? dayjs(newValue).format("YYYY-MM-DD") : today.format("YYYY-MM-DD")
                }));
              }}              
              slotProps={{
                textField: { 
                  variant: "standard", 
                  required: true,
                  name: "data" // Add name attribute here for consistency
                }
              }}
            />
          </LocalizationProvider>
            <FormControl variant="standard" sx={{ minWidth: 120 }} required>
              <InputLabel id="demo-simple-select-standard-label">{
                select === "outcome" ? "Tipo di spesa" : "Tipo di income"
              }</InputLabel>
              <Select
                style={{color: 'rgba(255, 255, 255, 0.7)' }}
                id="demo-simple-select-standard"
                name="tipologia"
                value={formData?.tipologia || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, tipologia: e.target.value }))}
                MenuProps={{
                  disablePortal: true,
                  PaperProps: {
                    style: {
                      backgroundColor: '#121212',
                      border: '1px solid rgba(255, 255, 255, 0.7)'
                    },
                  },
                  MenuListProps: {
                    style: {
                      padding: 0,
                      backgroundColor: '#121212',
                      border: 'none',
                    }
                  }
                }}
              >
                {valoriDropdown.map((item) => (
                  <MenuItem
                    key={item}
                    value={item}
                    sx={{
                      backgroundColor: '#121212',
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&:hover': {
                        backgroundColor: 'rgba(233, 232, 232, 0.18)',
                        color: 'white'
                      },
                    }}
                  >
                    {item.charAt(0) + item.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          <CustomButton title="Inserisci" type="submit"/>
        </Box>
      </form>
    </>
  )
}