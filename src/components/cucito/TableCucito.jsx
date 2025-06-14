import React, { useEffect, useState } from 'react';
import { useData } from '../../dataContext';
import { useCucito } from '../../cucitoContext';
import { Table, TableBody, TableHead, TableRow, TableCell, Box, Button, Input } from '@mui/material';
import { format } from 'date-fns';
import { it } from "date-fns/locale";
import { formatCurrency } from '../../utils';
import { parseEuroString } from '../../utils';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import MonthSelect from '../utils/MonthSelect'; // Assicurati che il percorso sia corretto

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function TableCucito() {
  const { datas, setSelect, ottieniDati, getDataForUpdateForm, setModal } = useData();
  const { trasferimento } = useCucito();

  const [allCucitoDatas, setAllCucitoDatas] = useState([]);
  const [monthlyFilteredDatas, setMonthlyFilteredDatas] = useState([]);

  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [erroreTrasferimento, setErroreTrasferimento] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (datas.length === 0) {
      ottieniDati("expenses");
    }
  }, [ottieniDati, datas.length]);

  useEffect(() => {
    const newDatas = datas.filter(dato => dato.cucito_in !== null || dato.cucito_out !== null);
    setAllCucitoDatas(newDatas);
  }, [datas]);

  const handleSetFilteredDatas = (filteredDataFromMonthSelect) => {
    setMonthlyFilteredDatas(filteredDataFromMonthSelect);
  };

  useEffect(() => {
console.log(monthlyFilteredDatas)
  }, [monthlyFilteredDatas]);

  const safeSum = (arr, key) => {
    if (!arr || arr.length === 0) return 0; // Gestisce caso array vuoto o null
    return arr.reduce((acc, curr) => {
      return acc + parseEuroString(curr[key]);
    }, 0);
  };

  function handleSubmit() {
    const totalCucitoIn = safeSum(allCucitoDatas, 'cucito_in');
    const totalCucitoOut = safeSum(allCucitoDatas, 'cucito_out');

    if (inputValue <= (totalCucitoIn - totalCucitoOut)) {
      const data = {
        data: format(new Date(), "yyyy-MM-dd HH:mm:ss"), // Formato corretto per data e ora
        descrizione: "girofondo",
        importo: inputValue,
      };
      trasferimento(data);
      handleClose(); // Chiudi il modal dopo il trasferimento
    } else {
      setErroreTrasferimento(true);
      setTimeout(() => {
        setErroreTrasferimento(false);
      }, 2000);
    }
  }

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2 }}>
        <p>Income netto: {formatCurrency((safeSum(allCucitoDatas, 'cucito_in') - safeSum(allCucitoDatas, 'cucito_out')))}</p>
        <Button
          onClick={handleOpen}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "5px" }}
        >
          <AutorenewIcon />
          Prelievo
        </Button>
      </Box>
      <MonthSelect setFilteredDatas={handleSetFilteredDatas} cucito={true} />
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style} style={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
          <Box style={{ display: "flex", justifyContent: "center", gap: "10px", alignItems: "center" }}> {/* Aggiunto gap e allineamento */}
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Importo da prelevare
            </Typography>
            <Input
              type="number" // Imposta il tipo a number per una migliore UX
              onChange={(e) => setInputValue(e.target.value)}
              value={inputValue} // Assicurati che l'input sia controllato
            />
            <Button
              onClick={() => handleSubmit()}
            >
              <ArrowForwardIcon />
            </Button>
          </Box>
          {erroreTrasferimento &&
            <Box style={{ display: "flex", justifyContent: "center", mt: 2 }}> {/* Aggiunto mt per spazio */}
              <p style={{ backgroundColor: "red", width: "fit-content", borderRadius: "6px", padding: "8px", color: "white" }}>
                Importo superiore al guadagnato!
              </p>
            </Box>
          }
        </Box>
      </Modal>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Data</TableCell>
            <TableCell>Descrizione</TableCell>
            <TableCell sx={{ color: "green", fontWeight: "bold", fontSize: "1.2rem" }}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <span>In</span>
                <span style={{ color: "white", fontWeight: "normal", fontSize: ".8rem" }}>
                  Tot: {formatCurrency(safeSum(allCucitoDatas, 'cucito_in'))}
                </span>
              </Box>
            </TableCell>

            <TableCell sx={{ color: "red", fontWeight: "bold", fontSize: "1.2rem" }}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <span>Out</span>
                <span style={{ color: "white", fontWeight: "normal", fontSize: ".8rem" }}>
                  Tot: {formatCurrency(safeSum(allCucitoDatas, 'cucito_out'))}
                </span>
              </Box>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {monthlyFilteredDatas.length > 0 ? (
            monthlyFilteredDatas.map((data) => (
              <TableRow
                key={data.id}
                onClick={() => {
                  if (data.Income || data.cucito_in) {
                    setSelect("income");
                  } else {
                    setSelect("outcome");
                  }
                  getDataForUpdateForm(data);
                  setModal("modifica");
                }}
              >
                <TableCell>{format(data.data, "dd-MMM", { locale: it })}</TableCell>
                <TableCell>{data && data.descrizione}</TableCell>
                <TableCell>{data.cucito_in && formatCurrency(data.cucito_in)}</TableCell>
                <TableCell>{data.cucito_out && formatCurrency(data.cucito_out)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center">Nessun dato per il mese selezionato.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}