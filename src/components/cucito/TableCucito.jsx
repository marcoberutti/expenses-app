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
import MonthSelect from '../utils/MonthSelect';

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

  // safeSum for general use (e.g., individual row display, or where girofondo is a true out)
  const safeSum = (arr, key) => {
    if (!arr || arr.length === 0) return 0;
    return arr.reduce((acc, curr) => {
      return acc + parseEuroString(curr[key]);
    }, 0);
  };

  // Helper to calculate sums EXCLUDING girofondo for 'out'
  const sumExcludingGirofondo = (arr, key) => {
    if (!arr || arr.length === 0) return 0;
    return arr.reduce((acc, curr) => {
      if (key === 'cucito_out' && curr.descrizione === 'girofondo') {
        return acc; // Exclude girofondo from 'out' sum
      }
      return acc + parseEuroString(curr[key]);
    }, 0);
  };

  function handleSubmit() {
    // For the withdrawal check, we need the *true* current balance
    // This balance should NOT exclude girofondo, as girofondo is an actual 'out' from the cucito account for withdrawal purposes
    const totalCucitoInForCheck = allCucitoDatas.reduce((acc, curr) => acc + parseEuroString(curr.cucito_in), 0);
    const totalCucitoOutForCheck = allCucitoDatas.reduce((acc, curr) => acc + parseEuroString(curr.cucito_out), 0);

    if (inputValue <= (totalCucitoInForCheck - totalCucitoOutForCheck)) {
      const data = {
        data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        descrizione: "girofondo",
        importo: inputValue,
      };
      trasferimento(data);
      handleClose();
    } else {
      setErroreTrasferimento(true);
      setTimeout(() => {
        setErroreTrasferimento(false);
      }, 2000);
    }
  }

  // Calculate Income totale (total net balance, excluding girofondo from "out")
  const totalIncomeCucito = safeSum(allCucitoDatas, 'cucito_in');
  const totalOutcomeCucito = sumExcludingGirofondo(allCucitoDatas, 'cucito_out'); // Use the new helper here
  const netTotalCucitoIncome = totalIncomeCucito - totalOutcomeCucito;

  // Calculate Monthly Income (net balance for filtered month, excluding girofondo from "out")
  const monthlyIncomeCucito = safeSum(monthlyFilteredDatas, 'cucito_in');
  const monthlyOutcomeCucito = sumExcludingGirofondo(monthlyFilteredDatas, 'cucito_out'); // Use the new helper here
  const netMonthlyCucitoIncome = monthlyIncomeCucito - monthlyOutcomeCucito;

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", p: 1 }}>
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {/* Display Income totale (which now correctly excludes girofondo from "out") */}
          <p style={{ margin: "2px" }}>Income totale: {formatCurrency(netTotalCucitoIncome)}</p>
          {/* Display Income mensile (also correctly excludes girofondo from "out") */}
          <p style={{ margin: "2px" }}>Income mensile: {formatCurrency(netMonthlyCucitoIncome)}</p>
        </Box>
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
          <Box style={{ display: "flex", justifyContent: "center", gap: "10px", alignItems: "center" }}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Importo da prelevare
            </Typography>
            <Input
              type="number"
              onChange={(e) => setInputValue(e.target.value)}
              value={inputValue}
            />
            <Button
              onClick={() => handleSubmit()}
            >
              <ArrowForwardIcon />
            </Button>
          </Box>
          {erroreTrasferimento &&
            <Box style={{ display: "flex", justifyContent: "center", mt: 2 }}>
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
                  Tot: {formatCurrency(safeSum(monthlyFilteredDatas, 'cucito_in'))}
                </span>
              </Box>
            </TableCell>

            <TableCell sx={{ color: "red", fontWeight: "bold", fontSize: "1.2rem" }}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <span>Out</span>
                <span style={{ color: "white", fontWeight: "normal", fontSize: ".8rem" }}>
                  {/* For the 'Out' column in the table, girofondo should NOT be counted as a regular 'out' */}
                  Tot: {formatCurrency(sumExcludingGirofondo(monthlyFilteredDatas, 'cucito_out'))}
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
                {/* Display cucito_out normally, even if it's a girofondo, as it's the actual value from DB */}
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