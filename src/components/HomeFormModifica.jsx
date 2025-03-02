import { useData } from "../dataContext";
import style from "./HomeForm.module.css";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { format } from "date-fns";
import SelectxFormModifica from "./SelectxFormModifica";

export default function HomeFormModifica() {
  const { modificaDati, datasForUpdate, setFormData, formData } = useData();
  const [selectDefaultVal, setSelectDefVal] = useState("");

  useEffect(() => {
    if (!datasForUpdate) return; // Se datasForUpdate è nullo, esci

    const excludeKeys = ["id", "descrizione", "data"];
    const filteredEntriesForSelect = Object.entries(datasForUpdate).filter(
      ([key]) => !excludeKeys.includes(key)
    );

    if (filteredEntriesForSelect.length === 1) {
      const singleValue = filteredEntriesForSelect[0][0];
      setSelectDefVal(singleValue.toLowerCase());
    }

    // Determina la tipologia (outcome o income)
    const outcomeKey = ["Benzina", "Spesa", "Extra", "Casa", "Salute"].find(
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
      tipo: datasForUpdate.Income ? "income" : "outcome",
      descrizione: e.target.descrizione.value,
      importo: parseFloat(e.target.importo.value),
    };
    console.log(newFormData);
    modificaDati(newFormData, datasForUpdate.id)
  };

  const handleInputChange = (e) => {
    if (!e) return;
    
    if (e.$d instanceof Date) {
      const formattedDate = format(e.$d, "yyyy-MM-dd HH:mm:ss");
      setFormData((prev) => ({ ...prev, data: formattedDate }));
    } else if (e.target) {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  
  return (
    <>
      <h1>Modifica spesa</h1>
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
              defaultValue={
                datasForUpdate?.Benzina ||
                datasForUpdate?.Casa ||
                datasForUpdate?.Extra ||
                datasForUpdate?.Income ||
                datasForUpdate?.Salute ||
                datasForUpdate?.Spesa
              }
              onChange={handleInputChange}
            />
          </div>
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
                },
              }}
            />
          </LocalizationProvider>
          <div className={style.inputContainerSelect}>
            {!datasForUpdate?.Income && (
              <SelectxFormModifica
                handleInputChange={handleInputChange}
                datasForUpdate={datasForUpdate}
                formData={formData}
                setFormData={setFormData}
              />
            )}
          </div>
          <div>
            <button type="submit">Inserisci</button>
          </div>
        </form>
      </div>
    </>
  );
}
