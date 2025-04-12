import React from 'react'
import Intestazione from '../components/Intestazione'
import Loader from '../components/Loader';
import { useData } from '../dataContext';
import HomeForm from '../components/HomeForm';
import HomeFormModifica from '../components/HomeFormModifica';
import TableCucito from '../components/TableCucito';
import { Paper, TableContainer } from '@mui/material';

export default function Cucito(){

  const { datas, isLoading, fetchData, modal, rimuoviDati, columnsToHide, setColumnsToHide } = useData();

  function setWhatModalSays(){
    switch (modal) {
      case "modifica":
        return <HomeFormModifica /> 
      case "form":
        return <HomeForm />
      case "normal":
        return (
        <TableContainer component={Paper}>
          <TableCucito />
        </TableContainer>)
      default:
    }
  }
  
  return(
    <div>
      { isLoading ? <Loader/> :
        <div style={{padding:"0 15px"}}>
          <Intestazione
            title = "Pagina del cucito"
          />
          {setWhatModalSays()}
        </div>
      }
    </div>
  )
}