import { useData } from "../../dataContext";
import style from "./HomeForm.module.css";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { format } from "date-fns";
import { Box, Card, CardContent, Typography, Divider } from "@mui/material";
import { useConfig } from "../../configContext";
import CustomButton from "../utils/CustomButton";
import CustomSelect from "./CustomSelect";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EuroIcon from '@mui/icons-material/Euro';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DescriptionIcon from '@mui/icons-material/Description';
import { useTheme } from "@mui/material/styles";

export default function HomeFormModifica() {
  const { rimuoviDati, modificaDati, datasForUpdate, setModal } = useData();
  const { valoriOutcome, setFormData, formData } = useConfig();
  const [selectDefaultVal, setSelectDefVal] = useState("");
  const theme = useTheme();

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
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        background: theme.palette.mode === "dark" ? "#181a1b" : "#f7f7fa",
        outline: "none", // rimuove ring esterno
        boxShadow: "none",
        '&:focus': {
          outline: "none",
          boxShadow: "none"
        }
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 420,
          mt: 4,
          boxShadow: 6,
          borderRadius: 3,
          background: theme.palette.background.paper,
          p: 2,
          color: theme.palette.text.primary,
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <DescriptionIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {datasForUpdate?.descrizione || "Nessuna descrizione"}
              </Typography>
            </Box>
            <CustomButton
              icon={<i className="fa fa-trash"></i>}
              onClick={() => {
                if (window.confirm("cancellare davvero?")) {
                  rimuoviDati(datasForUpdate.id, "expenses");
                  setModal("normal");
                }
              }}
              sx={{
                width: 40,
                padding: 1,
                borderRadius: "50%",
                fontWeight: 600,
              }}
            />
          </Box>
          <Divider sx={{ mb: 2, bgcolor: theme.palette.divider }} />
          <form method="post" onSubmit={handleSubmit} className={style.form}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                required
                variant="outlined"
                label="Descrizione"
                name="descrizione"
                onChange={handleInputChange}
                defaultValue={datasForUpdate?.descrizione || ""}
                InputProps={{
                  startAdornment: <DescriptionIcon sx={{ mr: 1, color: theme.palette.primary.main }} />,
                  sx: {
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                    },
                    '&.Mui-focused': {
                      boxShadow: 'none',
                      outline: 'none',
                    },
                    '&:focus': {
                      outline: 'none',
                      boxShadow: 'none'
                    }
                  }
                }}
                sx={{
                  outline: "none",
                  boxShadow: "none",
                  '&:focus': {
                    outline: "none",
                    boxShadow: "none"
                  }
                }}
              />
              <TextField
                required
                variant="outlined"
                label="Importo"
                name="importo"
                step="0.01"
                type="number"
                inputProps={{
                  step: "0.01",
                  lang: "en-US"
                }}
                defaultValue={
                  datasForUpdate?.Benzina ||
                  datasForUpdate?.Casa ||
                  datasForUpdate?.Extra ||
                  datasForUpdate?.Income ||
                  datasForUpdate?.Salute ||
                  datasForUpdate?.Spesa ||
                  datasForUpdate?.Investimenti ||
                  datasForUpdate?.tasse ||
                  datasForUpdate?.cucito_out ||
                  datasForUpdate?.cucito_in
                }
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <EuroIcon sx={{ mr: 1, color: theme.palette.success.main }} />,
                  sx: {
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                    },
                    '&.Mui-focused': {
                      boxShadow: 'none',
                      outline: 'none',
                    },
                    '&:focus': {
                      outline: 'none',
                      boxShadow: 'none'
                    }
                  }
                }}
                sx={{
                  outline: "none",
                  boxShadow: "none",
                  '&:focus': {
                    outline: "none",
                    boxShadow: "none"
                  }
                }}
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
                      variant: "outlined",
                      required: true,
                      name: "data",
                      InputProps: {
                        startAdornment: <CalendarMonthIcon sx={{ mr: 1, color: theme.palette.warning.main }} />,
                        sx: {
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'transparent',
                          },
                          '&.Mui-focused': {
                            boxShadow: 'none',
                            outline: 'none',
                          },
                          '&:focus': {
                            outline: 'none',
                            boxShadow: 'none'
                          },
                          '& .MuiIconButton-root': {
                            backgroundColor: theme.palette.action.hover,
                            '&:hover': {
                              backgroundColor: theme.palette.action.selected + " !important",
                            },
                          },
                        }
                      },
                      sx: {
                        outline: "none",
                        boxShadow: "none",
                        '&:focus': {
                          outline: "none",
                          boxShadow: "none"
                        }
                      }
                    },
                  }}
                />
              </LocalizationProvider>
              <CustomSelect
                handleInputChange={handleInputChange}
                datasForUpdate={datasForUpdate}
                formData={formData}
                setFormData={setFormData}
              />
              <CustomButton
                title="Modifica dato"
                type="submit"
                icon={<EditIcon />}
                sx={{
                  background: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  fontWeight: 600,
                  mt: 2,
                  outline: "none",
                  boxShadow: "none",
                  '&:hover': { background: theme.palette.primary.dark },
                  '&:focus': {
                    outline: "none",
                    boxShadow: "none"
                  }
                }}
              />
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
