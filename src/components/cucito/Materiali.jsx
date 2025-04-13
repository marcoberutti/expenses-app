import React, { useEffect } from 'react'
import Form from './Form'
import { useData } from '../../dataContext';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Loader from '../utils/Loader';

export default function Materiali(){

  const { materiali, getMateriali, inserisciMateriale, cancellaMaterialeOCliente } = useData();

  useEffect(() => {
    getMateriali();
  }, []); // Esegui una sola volta il fetch all'avvio
  
  function handleClick(id){
    cancellaMaterialeOCliente(id, "materiali")
  }
  

  return(
    <>
      <Form 
        nomeLabel={"Materiale:"}
        nomeLavorazione={""}
        nomeButton={"Inserisci materiale"}
        onSubmit={inserisciMateriale}
        tipo={"materiali"}
      />
      <br/>
      {materiali.length !== 0 ? 
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome materiale</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {materiali.map(materiale => (
              <TableRow key={materiale.id} onClick={() => handleClick(materiale.id)} 
              sx={{   
                '&:hover': {
                backgroundColor: 'rgba(77, 77, 77, 0.22)',
                cursor: 'pointer',
              },}}>
                <TableCell>{materiale.nome_materiale}</TableCell>
          
              </TableRow>
          ))}
        </TableBody>
      </Table> 
      : 
      <Loader/>}
    </>
  )
}