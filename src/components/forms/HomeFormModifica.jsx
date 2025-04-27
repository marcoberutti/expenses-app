import { useData } from "../../dataContext";
import style from "./HomeForm.module.css";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { format } from "date-fns";
import SelectxFormModifica from "./SelectxFormModifica";
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import {IconButton } from "@mui/material";
import { Box, display } from "@mui/system";
import { useConfig } from "../../configContext";

export default function HomeFormModifica() {
  const {rimuoviDati, modificaDati, datasForUpdate, setModal } = useData();
  const { valoriOutcome, setFormData, formData } = useConfig();
  const [selectDefaultVal, setSelectDefVal] = useState("");

  useEffect(() => {
    if (!datasForUpdate) return;

    const excludeKeys = ["id", "descrizione", "data"];
    const filteredEntriesForSelect = Object.entries(datasForUpdate).filter(
      ([key]) => !excludeKeys.includes(key)
    );

    if (filteredEntriesForSelect.length === 1) {
      const singleValue = filteredEntriesForSelect[0][0];
      setSelectDefVal(singleValue.toLowerCase());
    }

    // Determina la tipologia (outcome o income)
    const outcomeKey = valoriOutcome.find(
      (key) => datasForUpdate[key] !== undefined
    );
    const outcomeValue = outcomeKey ? outcomeKey : "income"; // Se uno dei valori è presente, usa quello, altrimenti "income"

    setFormData((prev) => ({
      ...prev,
      data:
        prev.data ||
        (datasForUpdate.data
          ? format(new Date(datasForUpdate.data), "yyyy-MM-dd HH:mm:ss")
          : ""),
      tipologia: outcomeValue,
    }));
  }, [datasForUpdate, setFormData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newFormData = {
      ...formData,
      tipologia: e.target.tipologia.value,
      descrizione: e.target.descrizione.value,
      importo: parseFloat(e.target.importo.value),
    };
    modificaDati(newFormData, datasForUpdate.id, "expenses")
  };

  const handleInputChange = (e) => {
    if (!e) return;
    
    if (e.$d && e.$d instanceof Date) {
      const formattedDate = format(e.$d, "yyyy-MM-dd HH:mm:ss");
      setFormData((prev) => ({ ...prev, data: formattedDate }));
    } else if (e.target) {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  
  return (
    <>
      <Box sx={{display:"flex", justifyContent:"center", gap:"30px", alignItems:"center"}}>
        <h1>{datasForUpdate?.descrizione || "Nessuna descrizione"}</h1>
        <IconButton size="small"
            style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
            onClick={() => {
              if (window.confirm("cancellare davvero?")) {
                rimuoviDati(datasForUpdate.id, "expenses");
                setModal("normal")
              }}
            }
            >
            <i className={`bi-trash`} style={{fontSize:"1.5rem"}}></i>
        </IconButton>
      </Box>
      <div className={style.formContainer}>
        <form method="post" onSubmit={handleSubmit} className={style.form}>
          <div className={style.inputContainer}>
            <TextField
              required
              variant="standard"
              label="Descrizione"
              name="descrizione"
              onChange={handleInputChange}
              defaultValue={datasForUpdate?.descrizione || ""}
            />
            <TextField
              required
              variant="standard"
              label="Importo"
              name="importo"
              step="0.01"
              type="number"
              inputProps={{ 
                step: "0.01",
                lang: "en-US" // or your specific locale to ensure proper decimal handling
              }}
              defaultValue={
                datasForUpdate?.Benzina ||
                datasForUpdate?.Casa ||
                datasForUpdate?.Extra ||
                datasForUpdate?.Income ||
                datasForUpdate?.Salute ||
                datasForUpdate?.Spesa  ||
                datasForUpdate?.Investimenti ||
                datasForUpdate?.tasse ||
                datasForUpdate?.cucito_out ||
                datasForUpdate?.cucito_in
              }
              onChange={handleInputChange}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Data"
                format="DD/MM/YYYY"
                value={
                  formData.data
                    ? dayjs(formData.data)
                    : datasForUpdate?.data
                    ? dayjs(datasForUpdate.data)
                    : null
                }
                onChange={handleInputChange}
                slotProps={{
                  textField: {
                    variant: "standard",
                    required: true,
                    name: "data",
                    InputProps: {
                      sx:{
                          '& .MuiIconButton-root': {
                            backgroundColor: 'gray', // Cambia il colore qui
                            '&:hover': { // Stile per lo stato di hover (opzionale)
                              backgroundColor: "darkgray !important",
                            },
                          },
                        }
                    },
                  },
                }}
              />
            </LocalizationProvider>
            <SelectxFormModifica
              handleInputChange={handleInputChange}
              datasForUpdate={datasForUpdate}
              formData={formData}
              setFormData={setFormData}
            />
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              type="submit"
              sx={{
                width: 'fit-content !important',
                fontSize: ".8rem",
                alignSelf: "center",
                backgroundColor: "gray !important", // Applica direttamente il backgroundColor
                '&:hover': { // Stile per lo stato di hover (opzionale)
                  backgroundColor: "darkgray !important",
                },
              }}
            >
              Modifica dato
            </Button>

          </div>
        </form>
      </div>
    </>
  );
}
