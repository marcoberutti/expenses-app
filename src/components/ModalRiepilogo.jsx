import React, { useEffect } from 'react';
import { useData } from '../dataContext';
import Loader from './Loader';
import style from './modalRiepilogo.module.css';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import {format} from 'date-fns'
import { it } from "date-fns/locale";

export default function ModalRiepilogo() {
  const { setModalRiepilogo, filteredRiepilogoDatas, isLoading } = useData();

  return (
    <div className={style.modalContainer}>
      <div className={style.closeContainer}>
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
              {filteredRiepilogoDatas.length > 0 ? (
                filteredRiepilogoDatas.map((dato, index) => (
                  <TableRow key={index}>
                    <TableCell className={style.tableCellRiepilogo}>{format(dato.data, "d-MMM", { locale: it } )}</TableCell>
                    <TableCell className={style.tableCellRiepilogo}>{dato.descrizione}</TableCell>
                    <TableCell className={style.tableCellRiepilogo}>{dato.valore}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">Nessun dato disponibile</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
