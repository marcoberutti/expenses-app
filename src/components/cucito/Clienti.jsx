import React, { useEffect } from 'react';
import Form from './Form';
import { Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Loader from '../utils/Loader';
import { useCucito } from '../../cucitoContext';
import { Menu } from '@base-ui-components/react/menu';
import styles from './index.module.css';
import Archivio from './Archivio';

export default function Clienti() {
  const { clienti, getClienti, inserisciCliente, archiviaCliente, handleStatoLavorazione, toggleShowArchivio } = useCucito();

  useEffect(() => {
    getClienti();
  }, []);

  function handleClick(id) {
    archiviaCliente(id);
  }

  function ChevronDownIcon(props) {
    return (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" {...props}>
        <path d="M1 3.5L5 7.5L9 3.5" stroke="currentcolor" strokeWidth="1.5" />
      </svg>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", px: 2, height:"75vh" }}>
      {toggleShowArchivio === false ? (
        <>
          <Form
            nomeLabel={"Cliente:"}
            nomeLavorazione={"Lavorazione:"}
            onSubmit={inserisciCliente}
            tipo={"clienti"}
          />
          <br />
          {clienti.filter(cliente => cliente.active !== "false").length !== 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Lavorazione</TableCell>
                  <TableCell>Stato</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clienti
                  .filter(cliente => cliente.active !== "false")
                  .map(cliente => (
                    <TableRow
                      key={cliente.id}
                      onClick={() => handleClick(cliente.id)}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(77, 77, 77, 0.22)',
                          cursor: 'pointer',
                        },
                      }}
                    >
                      <TableCell>{cliente.nome}</TableCell>
                      <TableCell>{cliente.lavorazione}</TableCell>
                      <TableCell sx={{ color: cliente.stato === "da fare" ? "error.main" : "success.main" }}>
                        <Menu.Root>
                          <Menu.Trigger className={`${styles.Button} ${cliente.stato === "da fare" ? styles.red : styles.green}`}>
                            {cliente.stato}
                            <ChevronDownIcon className={styles.ButtonIcon} />
                          </Menu.Trigger>
                          <Menu.Portal>
                            <Menu.Positioner className={styles.Positioner} sideOffset={8}>
                              <Menu.Popup className={styles.Popup}>
                                <Menu.Item
                                  className={styles.Item}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatoLavorazione(e.target.outerText, cliente.id);
                                  }}
                                >
                                  {cliente.stato === "da fare" ? "completato" : "da fare"}
                                </Menu.Item>
                              </Menu.Popup>
                            </Menu.Positioner>
                          </Menu.Portal>
                        </Menu.Root>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <Loader />
          )}
        </>
      ) : (
        <Archivio />
      )}
    </Box>
  );
}
