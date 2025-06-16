import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import { useState } from "react";
import { TableBody, TableCell, TableRow } from "@mui/material";
import "bootstrap-icons/font/bootstrap-icons.css";
import MonthSelect from "../utils/MonthSelect";
import { format } from "date-fns";
import { it } from 'date-fns/locale';
import { formatCurrency } from "../../utils";
import { useData } from "../../dataContext";

export default function HomeTable() {
  const { setSelect, getDataForUpdateForm, setModal } = useData();

  const [filteredDatas, setFilteredDatas] = useState([]);

  // Helper function to get the correct amount from a data object
  const getAmount = (data) => {
    if (data.Income) return data.Income;
    if (data.Spesa) return data.Spesa;
    if (data.Benzina) return data.Benzina;
    if (data.Extra) return data.Extra;
    if (data.Casa) return data.Casa;
    if (data.Salute) return data.Salute;
    if (data.Investimenti) return data.Investimenti;
    if (data.tasse) return data.tasse;
    return null;
  };

  // Helper function to determine the text color based on the data type
  const getAmountColor = (data) => {
    if (data.Income || data.Investimenti) {
      return 'green'; // Green for Income and Investimenti
    }
    // All other categories are considered expenses (Spesa, Benzina, Extra, Casa, Salute, Tasse)
    if (data.Spesa || data.Benzina || data.Extra || data.Casa || data.Salute || data.tasse) {
      return 'red'; // Red for expenses
    }
    return 'inherit'; // Default color if no specific category matches
  };

  return (
    <div>
      <MonthSelect setFilteredDatas={setFilteredDatas} cucito={false} />
      <br />
      <br />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ p: 1, fontSize: '0.8rem', width: '25px' }} align="center">Data</TableCell>
              <TableCell sx={{ p: 1, fontSize: '0.8rem', width: '25px' }} align="center">Descrizione</TableCell>
              <TableCell sx={{ p: 1, fontSize: '0.8rem', width: '25px' }} align="center">Importo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDatas.length > 0 ? (
              filteredDatas.map((data) => (
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
                  <TableCell sx={{ p: 1, fontSize: '0.8rem', width: '25px' }} align="center">
                    {data.data && format(data.data, "d-MMM", { locale: it })}
                  </TableCell>
                  <TableCell sx={{ p: 1, fontSize: '0.8rem', width: '25px' }} align="center">
                    {data.descrizione}
                  </TableCell>
                  <TableCell
                    sx={{ p: 1, fontSize: '0.8rem', width: '25px', color: getAmountColor(data) }}
                    align="center"
                  >
                    {formatCurrency(getAmount(data))}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">Nessun dato per il mese selezionato.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}