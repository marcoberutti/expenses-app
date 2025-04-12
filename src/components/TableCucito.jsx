import React, { useEffect, useState } from 'react'
import style from './HomeTable.module.css'
import { useData } from '../dataContext';
import { Table, TableBody, TableHead, TableRow, TableCell, IconButton } from '@mui/material';
import { format } from 'date-fns';
import { it } from "date-fns/locale";
import DeleteWriteCellComponent from './DeleteWriteCellComponent';

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
  
  return(
    <Table>
      <TableHead>
        <TableRow>
          <TableCell></TableCell>
          <TableCell>Data</TableCell>
          <TableCell>Descrizione</TableCell>
          <TableCell sx={{color:"green", fontWeight:"bold"}}>In</TableCell>
          <TableCell sx={{color:"red", fontWeight:"bold"}}>Out</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {datiFiltrati.map((data) => (
          <TableRow key={data.id}>
            <DeleteWriteCellComponent dato={data}/>
            <TableCell>{format(data.data, "dd-MMM", { locale: it })}</TableCell>
            <TableCell>{data && data.descrizione}</TableCell>
            <TableCell>{data.cucito_in && data.cucito_in}</TableCell>
            <TableCell>{data.cucito_out && data.cucito_out}</TableCell>
            </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}