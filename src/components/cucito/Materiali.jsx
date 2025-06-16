import React, { useEffect } from 'react'
import Form from './Form'
import { Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
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
    <Box 
      sx={{
        display:"flex",
        flexDirection:"column",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        px:1
      }}>
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
    </Box>
  )
}