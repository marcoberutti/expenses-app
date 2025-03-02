import {  useEffect } from "react";
import TableCell from '@mui/material/TableCell';
import "bootstrap-icons/font/bootstrap-icons.css";
import HomeTable from "../components/HomeTable";
import HomeForm from "../components/HomeForm";
import { useData } from "../dataContext";
import Loader from "../components/Loader";
import Intestazione from "../components/Intestazione";
import HomeFormModifica from "../components/HomeFormModifica";

export default function Home() {

  const { datas, isLoading, fetchData, modal, rimuoviDati, columnsToHide, setColumnsToHide } = useData();

  useEffect(() => {
    if (datas.length === 0) {
      fetchData();
    }
  }, []);
  function handleDeleteData(id){
    rimuoviDati(id)
  }
  function handleToggleColumns(e){
    let columnName = e.target.nextSibling.textContent;
    setColumnsToHide(prevItems => 
      prevItems.map(item =>
        item.nome === columnName ? {...item, visible: !item.visible} : item
      )
    )
  };
  function generateHeaders(){
    return columnsToHide.map((column, index) =>(
      <TableCell align="center" key={index} style={{display: column.visible ? 'table-cell' : 'none'}} sx={{p:0}}>
        <span><strong>{column.nome}</strong></span>
        <br/>
        <input 
        type="checkbox"
        checked={column.visible}
        onChange={(e)=> handleToggleColumns(e)
        }
        />
      </TableCell>
    ))
  }
  function setWhatModalSays(){
    switch (modal) {
      case "modifica":
        return <HomeFormModifica /> 
      case "form":
        return <HomeForm />
      case "normal":
        return (<div>
        <HomeTable 
          generateHeaders={generateHeaders()}
          columnsToHide={columnsToHide} 
          handleDeleteData={handleDeleteData} />
      </div>)
      default:
    }
  }

  return (
    <div>
    { isLoading ? <Loader/> :
      <div>
        <Intestazione
          title = "Spese del mese"
          columnsToHide = {columnsToHide}
          handleToggleColumns = {handleToggleColumns}
        />
        {setWhatModalSays()}
      </div>
    }
    </div>
  );
}