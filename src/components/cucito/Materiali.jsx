import React, { useEffect } from 'react'
import Form from './Form'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Loader from '../utils/Loader';
import { useCucito } from '../../cucitoContext';

export default function Materiali(){

  const { materiali, getMateriali, inserisciMateriale, cancellaMateriale } = useCucito();

  useEffect(() => {
    getMateriali();
  }, []);
  
  function handleClick(id){
    cancellaMateriale(id)
  }
  

  return(
    <>
      <Form 
        nomeLabel={"Materiale:"}
        nomeLavorazione={""}
        nomeButton={"+"}
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