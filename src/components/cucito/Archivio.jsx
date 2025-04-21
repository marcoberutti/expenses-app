import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Box } from '@mui/material';
import Loader from '../utils/Loader';
import { useCucito } from '../../cucitoContext';
import { Menu } from '@base-ui-components/react/menu';
import styles from './index.module.css';

export default function Archivio(){

  const { clienti, getClienti, setToggleShowArchivio, cancellaCliente} = useCucito();
  
  useEffect(() => {
    getClienti();
  }, []);

  const clientiArchiviati = clienti.filter(cliente => cliente.active === "false");

  function ChevronDownIcon(props) {
    return (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" {...props}>
        <path d="M1 3.5L5 7.5L9 3.5" stroke="currentcolor" strokeWidth="1.5" />
      </svg>
    );
  }

  function handleClick(id) {
    cancellaCliente(id)
  }

  return(
    <>
      <Box sx={{
        display:"flex",
        justifyContent: "space-evenly",
        alignItems: "center",
      }}>
        <h3>Archivio</h3>
        <Button
          variant="contained"
          onClick={() => setToggleShowArchivio(false)}
          sx={{
            backgroundColor: "gray ! important",
            fontSize: "1.5rem",
            padding: "2px",
            minWidth: "fit-content",
            lineHeight: "1.1",
            borderRadius: "50%",
            width: "2rem",
            height: "2rem",
          }}
        >
        x
        </Button>
      </Box>
      {clientiArchiviati.length !== 0 ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Lavorazione</TableCell>
              <TableCell>Stato</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientiArchiviati.map(cliente => (
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
                              // handleStatoLavorazione(e.target.outerText, cliente.id);
                            }}
                          >{cliente.stato === "da fare" ? "completato" : "da fare"}</Menu.Item>
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
  )
}