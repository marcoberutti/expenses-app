import React, { useEffect } from 'react'
import Form from './Form'
import { useData } from '../../dataContext'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Loader from '../utils/Loader';

export default function Clienti(){

  const { clienti, getClienti, inserisciCliente, cancellaMaterialeOCliente } = useData();

  useEffect(() => {
    getClienti();
  }, []); // Esegui una sola volta il fetch all'avvio
  
  function handleClick(id){
    cancellaMaterialeOCliente(id, "clienti")
  }
  

  return(
    <>
      <Form 
        nomeLabel={"Cliente:"}
        nomeLavorazione={"Lavorazione:"}
        nomeButton={"Nuovo cliente"}
        onSubmit={inserisciCliente}
        tipo={"clienti"}
      />
      <br/>
      {clienti.length !== 0 ? 
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Lavorazione</TableCell>
            <TableCell>Stato</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clienti.map(cliente => (
              <TableRow key={cliente.id} onClick={() => handleClick(cliente.id)} 
              sx={{   
                '&:hover': {
                backgroundColor: 'rgba(77, 77, 77, 0.22)',
                cursor: 'pointer',
              },}}>
                <TableCell>{cliente.nome}</TableCell>
                <TableCell>{cliente.lavorazione}</TableCell>
                <TableCell sx={{ color: cliente.stato === "da fare" ? "error.main" : "success.main" }}>
                  {cliente.stato}
                </TableCell>            
              </TableRow>
          ))}
        </TableBody>
      </Table> 
      : 
      <Loader/>}
    </>
  )
}