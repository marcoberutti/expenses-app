import {  useEffect } from "react";
import style from './home.module.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import HomeTable from "../components/HomeTable";
import HomeForm from "../components/HomeForm";
import { useData } from "../dataContext";
import Loader from "../components/Loader";
import Intestazione from "../components/Intestazione";

export default function Home() {

  const { datas, isLoading, fetchData, modal, rimuoviDati, columnsToHide, setColumnsToHide } = useData();

  useEffect(() => {
    if (datas.length === 0) {
      fetchData();
    }
  }, []);

  // TODO questo posso anche metterlo direttamente in hometable come ho fatto con modifica dati????: 
  // TODO sistemare message che sia globale

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

  return (
    <div>
    { isLoading ? <Loader/> :
      <div>
        <Intestazione
          title = "Spese del mese"
          columnsToHide = {columnsToHide}
          handleToggleColumns = {handleToggleColumns}
        />
        {modal ? 
          <HomeForm/>
        :
          <div className={style.tableContainer}>
            <HomeTable 
              generateHeaders={generateHeaders()}
              columnsToHide={columnsToHide} 
              handleDeleteData={handleDeleteData} 
            />
          </div>
        }
      </div>
    }
    </div>
  );
}