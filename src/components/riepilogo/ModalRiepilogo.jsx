import React, { useEffect, useState } from 'react';
import { useData } from '../../dataContext';
import Loader from '../utils/Loader';
import style from './modalRiepilogo.module.css';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useTheme } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { it } from "date-fns/locale";
import { FaSortUp, FaSortDown } from "react-icons/fa";

export default function ModalRiepilogo() {
  const { setModalRiepilogo, filteredRiepilogoDatas, isLoading, titoloModaleRiepilogo, setFilteredRiepilogoDatas } = useData();
  const [titolo, setTitolo] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [sortField, setSortField] = useState("valore");
  const theme = useTheme();

  useEffect(() => {
    if (filteredRiepilogoDatas.length > 0) {
      let valoriTitolo = Object.values(filteredRiepilogoDatas[0]);
      let nomeMese = format(parseISO(valoriTitolo[0]), "MMMM", { locale: it });
      let titoloTable = `${titoloModaleRiepilogo} ${nomeMese}`;
      setTitolo(titoloTable);
    } else {
      setTitolo("");
    }
  }, [filteredRiepilogoDatas, titoloModaleRiepilogo]);

  // Calcola totale importo
  const totale = filteredRiepilogoDatas.reduce((acc, curr) => acc + (parseFloat(curr.valore) || 0), 0);

  // Colori dinamici per dark/light mode
  const bgColor = theme.palette.background.paper;
  const textColor = theme.palette.text.primary;
  const headBg = theme.palette.mode === 'dark' ? "#222" : "#f5f6fa";
  const rowHover = theme.palette.mode === 'dark' ? "#333" : "#f9fafc";
  const totaleColor = theme.palette.mode === 'dark' ? "#ffb347" : "#e67e22";

  // Ordina i dati in base a sortField e sortAsc
  const datiOrdinati = [...filteredRiepilogoDatas].sort((a, b) => {
    if (sortField === "valore") {
      const va = parseFloat(a.valore) || 0;
      const vb = parseFloat(b.valore) || 0;
      return sortAsc ? va - vb : vb - va;
    } else if (sortField === "data") {
      const da = new Date(a.data);
      const db = new Date(b.data);
      return sortAsc ? da - db : db - da;
    }
    return 0;
  });

  return (
    <div className={style.modalOverlay}>
      <div className={style.modalContainer} style={{ background: bgColor, color: textColor }}>
        <div className={style.closeContainer}>
          <h3 className={style.titoloModale}>{titolo}</h3>
          <span
            className={style.closeButton}
            onClick={() => {
              setModalRiepilogo(false);
              setFilteredRiepilogoDatas([]);
              setTitolo("");
            }}
            title="Chiudi"
          >
            <i className="bi bi-x-lg" style={{ fontSize: "2rem", color: "#e74c3c", cursor: "pointer" }}></i>
          </span>
        </div>

        {/* Totale sotto al titolo */}
        <div className={style.totaleRiepilogo}>
          <span style={{ color: totaleColor, fontWeight: "bold", fontSize: "1.2rem" }}>
            Totale: {totale.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
          </span>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <TableContainer
            component={Paper}
            className={style.tableContainerRiepilogo}
            style={{
              background: bgColor,
              maxHeight: '60vh',
              overflowY: 'auto',
              boxShadow: theme.shadows[3],
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow style={{ background: headBg }}>
                  <TableCell
                    className={style.tableCellRiepilogo}
                    style={{ cursor: "pointer", userSelect: "none" }}
                    onClick={() => {
                      setSortField("data");
                      setSortAsc(sortField === "data" ? !sortAsc : true);
                    }}
                  >
                    Data
                    <span style={{ marginLeft: 6, fontSize: "1.1em", verticalAlign: "middle", color: totaleColor }}>
                      {sortField === "data"
                        ? sortAsc ? <FaSortUp /> : <FaSortDown />
                        : <FaSortUp style={{ opacity: 0.3 }} />}
                    </span>
                  </TableCell>
                  <TableCell className={style.tableCellRiepilogo}>Descrizione</TableCell>
                  <TableCell
                    className={style.tableCellRiepilogo}
                    style={{ cursor: "pointer", userSelect: "none" }}
                    onClick={() => {
                      setSortField("valore");
                      setSortAsc(sortField === "valore" ? !sortAsc : true);
                    }}
                  >
                    Importo
                    <span style={{ marginLeft: 6, fontSize: "1.1em", verticalAlign: "middle", color: totaleColor }}>
                      {sortField === "valore"
                        ? sortAsc ? <FaSortUp /> : <FaSortDown />
                        : <FaSortUp style={{ opacity: 0.3 }} />}
                    </span>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {datiOrdinati.length > 0 && (
                  datiOrdinati.map((dato, index) => (
                    <TableRow
                      key={index}
                      className={style.tableRowRiepilogo}
                      style={{
                        transition: "background 0.2s",
                        '&:hover': { background: rowHover }
                      }}
                    >
                      <TableCell className={style.tableCellRiepilogo}>
                        {format(parseISO(dato.data), "d MMM", { locale: it })}
                      </TableCell>
                      <TableCell className={style.tableCellRiepilogo}>{dato.descrizione}</TableCell>
                      <TableCell className={style.tableCellRiepilogo}>
                        <span style={{ color: "#2ecc71", fontWeight: "bold" }}>
                          {Number(dato.valore).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
}

