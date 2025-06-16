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

  // Modified safeSum to handle "girofondo" as income for total calculation
  const safeSum = (arr, key) => {
    if (!arr || arr.length === 0) return 0; // Handles empty or null array case
    return arr.reduce((acc, curr) => {
      let value = parseEuroString(curr[key]);

      // If it's a 'cucito_out' and the description is 'girofondo', treat it as a positive income.
      // This applies specifically to the total income/outcome calculation where 'girofondo' is a "withdrawal" from cucito.
      if (key === 'cucito_out' && curr.descrizione === 'girofondo') {
        value = -value; // Negate the value so it acts as an "in" when calculating net.
      }
      return acc + value;
    }, 0);
  };

  function handleSubmit() {
    // When checking against the balance for withdrawal, girofondo should still be considered an actual "out"
    // So, we use a separate sum for this check or be careful with the safeSum logic.
    // For this specific check, we need the *true* total of cucito_in and cucito_out without girofondo negation.
    const trueTotalCucitoIn = allCucitoDatas.reduce((acc, curr) => acc + parseEuroString(curr.cucito_in), 0);
    const trueTotalCucitoOut = allCucitoDatas.reduce((acc, curr) => acc + parseEuroString(curr.cucito_out), 0);

    if (inputValue <= (trueTotalCucitoIn - trueTotalCucitoOut)) {
      const data = {
        data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        descrizione: "girofondo",
        importo: inputValue, // inputValue is already positive, it will be saved as cucito_out
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

  // Calculate the adjusted total income for display
  const adjustedTotalCucitoIn = allCucitoDatas.reduce((acc, curr) => acc + parseEuroString(curr.cucito_in), 0);
  const adjustedTotalCucitoOutExcludingGirofondo = allCucitoDatas.reduce((acc, curr) => {
    if (curr.descrizione === 'girofondo') {
      return acc; // Don't include girofondo in the 'out' sum for this specific total calculation
    }
    return acc + parseEuroString(curr.cucito_out);
  }, 0);
  // Sum of girofondo (treated as positive for total income)
  const totalGirofondoAsIncome = allCucitoDatas.reduce((acc, curr) => {
    if (curr.descrizione === 'girofondo') {
      return acc + parseEuroString(curr.cucito_out); // Girofondo amount itself (positive)
    }
    return acc;
  }, 0);

  const totalNetCucitoIncome = (adjustedTotalCucitoIn - adjustedTotalCucitoOutExcludingGirofondo) + totalGirofondoAsIncome;

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", p: 1 }}>
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {/* Display Income totale with girofondo treated as positive */}
          <p style={{ margin: "2px" }}>Income totale: {formatCurrency(totalNetCucitoIncome)}</p>
          <p style={{ margin: "2px" }}>Income mensile: {formatCurrency((safeSum(monthlyFilteredDatas, 'cucito_in') - safeSum(monthlyFilteredDatas, 'cucito_out')))}</p>
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
                  {/* For the 'Out' column in the table, 'girofondo' is still an actual 'out' visually,
                      so we don't apply the negation here. */}
                  Tot: {formatCurrency(
                    monthlyFilteredDatas.reduce((acc, curr) => acc + parseEuroString(curr.cucito_out), 0)
                  )}
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