// TODO sistemare message che sia globale
// TODO questo posso anche metterlo direttamente in hometable come ho fatto con modifica dati????: 
import {  useEffect, useState } from "react";
import style from './home.module.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import HomeTable from "../components/HomeTable";
import HomeForm from "../components/HomeForm";
import { useData } from "../dataContext";
import Loader from "../components/Loader";
import Intestazione from "../components/Intestazione";
import HomeFormModifica from "../components/HomeFormModifica";

export default function Home() {

  const { datas, isLoading, fetchData, modal, rimuoviDati, columnsToHide, setColumnsToHide } = useData();
  const [formData, setFormData] = useState({
    descrizione: '',
    spesa: '',
    income: '',
    benzina: '',
    extra: '',
    casa: '',
    salute: ''
  });

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
      <th key={index} style={{display: column.visible ? 'table-cell' : 'none'}}>
        <input 
        type="checkbox"
        checked={column.visible}
        onChange={(e)=> handleToggleColumns(e)
        }
        />
        <span>{column.nome}</span>
      </th>
    ))
  }
  function setWhatModalSays(){
    switch (modal) {
      case "modifica":
        return <HomeFormModifica 
          setFormData={setFormData}
          formData={formData}
        /> 
      case "form":
        return <HomeForm 
          setFormData={setFormData}
        />
      case "normal":
        return (<div className={style.tableContainer}>
        <HomeTable 
          generateHeaders={generateHeaders()}
          columnsToHide={columnsToHide} 
          handleDeleteData={handleDeleteData}
          setFormData={setFormData}
          formData={formData}
        />
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