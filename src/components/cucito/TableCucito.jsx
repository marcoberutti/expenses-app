import React, { useEffect, useState } from 'react'
import { useData } from '../../dataContext';
import { Table, TableBody, TableHead, TableRow, TableCell, Box } from '@mui/material';
import { format } from 'date-fns';
import { it } from "date-fns/locale";
import DeleteWriteCellComponent from '../utils/DeleteWriteCellComponent';
import {formatCurrency} from '../../utils'
import {parseEuroString} from '../../utils'

export default function TableCucito(){

  const { datas, handleToggleModals, fetchData,  } = useData();

  const [datiFiltrati, setDatiFiltrati] = useState([])

  useEffect(() => {
    // Chiama fetchData SOLO se datas è inizialmente vuoto
    // e solo al montaggio del componente.
    if (datas.length === 0) {
      fetchData();
    }
  }, [fetchData, datas.length]); // fetchData come dipendenza perché è una callback

  useEffect(() => {
    const newDatas = datas.filter(dato => dato.cucito_in !== null || dato.cucito_out !== null);
    setDatiFiltrati(newDatas);
  }, [datas]);

  const safeSum = (arr, key) => {
    return arr.reduce((acc, curr) => {
      return acc + parseEuroString(curr[key]);
    }, 0);
  };
  
  return(
    <Table>
      <TableHead>
        <TableRow>
          <TableCell></TableCell>
          <TableCell>Data</TableCell>
          <TableCell>Descrizione</TableCell>
          <TableCell sx={{ color: "green", fontWeight: "bold", fontSize: "1.2rem" }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <span>In</span>
              <span style={{ color: "white", fontWeight: "normal", fontSize: ".8rem" }}>
                Tot: {formatCurrency(safeSum(datiFiltrati, 'cucito_in'))}
              </span>
            </Box>
          </TableCell>

          <TableCell sx={{ color: "red", fontWeight: "bold", fontSize: "1.2rem" }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <span>Out</span>
              <span style={{ color: "white", fontWeight: "normal", fontSize: ".8rem" }}>
                Tot: {formatCurrency(safeSum(datiFiltrati, 'cucito_out'))}
              </span>
            </Box>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
      {datiFiltrati.map((data) => (
        <TableRow key={data.id}>
          <DeleteWriteCellComponent dato={data}/>
          <TableCell>{format(data.data, "dd-MMM", { locale: it })}</TableCell>
          <TableCell>{data && data.descrizione}</TableCell>
          <TableCell>{data.cucito_in && formatCurrency(data.cucito_in)}</TableCell>
          <TableCell>{data.cucito_out && formatCurrency(data.cucito_out)}</TableCell>
        </TableRow>
      ))}
      </TableBody>
    </Table>
  )
}