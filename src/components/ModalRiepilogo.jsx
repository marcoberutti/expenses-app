import React, { useEffect, useState } from 'react';
import { useData } from '../dataContext';
import Loader from './Loader';
import style from './modalRiepilogo.module.css';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import {format, parseISO} from 'date-fns'
import { it } from "date-fns/locale";

export default function ModalRiepilogo() {
  const { setModalRiepilogo, filteredRiepilogoDatas, isLoading } = useData();
  const [titolo, setTitolo] = useState("");

  useEffect(() => {
    if (filteredRiepilogoDatas.length > 0) {
      let valoriTitolo = Object.values(filteredRiepilogoDatas[0]);
      let nomeMese = format(parseISO(valoriTitolo[0]), "MMMM", { locale: it });
      let categoria = valoriTitolo[1];
      let titoloTable = `Riepilogo ${categoria} mese di ${nomeMese}`;
      setTitolo(titoloTable);
    } else {
      setTitolo("");
    }
  }, [filteredRiepilogoDatas]);

  return (
    <div className={style.modalContainer}>
      <div className={style.closeContainer}>
        <h3>{titolo}</h3>
        <span className={style.closeButton} onClick={() => setModalRiepilogo(false)}>
          <i className="bi bi-x"></i>
        </span>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={style.tableCellRiepilogo}>Data</TableCell>
                <TableCell className={style.tableCellRiepilogo}>Descrizione</TableCell>
                <TableCell className={style.tableCellRiepilogo}>Importo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRiepilogoDatas.length > 0 && (
                filteredRiepilogoDatas.map((dato, index) => (
                  <TableRow key={index}>
                    <TableCell className={style.tableCellRiepilogo}>{format(dato.data, "d-MMM", { locale: it } )}</TableCell>
                    <TableCell className={style.tableCellRiepilogo}>{dato.descrizione}</TableCell>
                    <TableCell className={style.tableCellRiepilogo}>{dato.valore}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
