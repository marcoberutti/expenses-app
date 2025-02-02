import { useEffect, useState } from "react";
import style from './home.module.css';
import { getTime, setDefaultOptions } from "date-fns";
import { it } from 'date-fns/locale';
import "bootstrap-icons/font/bootstrap-icons.css";
import API_URL from "../config";
import HomeTable from "../components/HomeTable";
import HomeForm from "../components/HomeForm";

export default function Home() {
  const [datas, setDatas] = useState();
  const [modal, setModal] = useState(false);
  const [select, setSelect] = useState(true);
  const [dataSent, setDataSent] = useState('');
  const [columnsToHide, setColumnsToHide] = useState([
    {nome: "Data", visible: true},
    {nome: "Descrizione", visible: true},
    {nome: "Spese", visible: true},
    {nome: "Entrate", visible: true},
    {nome: "Benzina", visible: true},
    {nome: "Extra", visible: true},
    {nome: "Casa", visible: true},
    {nome: "Salute", visible: true},
  ]);
  setDefaultOptions({ locale: it });

  let now = getTime(new Date());

  useEffect(() => {

    fetch(`${API_URL}/dati`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_API_KEY
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => 
        setDatas(data)
      )
      .catch(error => console.error('Errore nella fetch:', error));
  }, [dataSent]);

  function inserisciDati(e){
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());    
    fetch(`${API_URL}/newExpense`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_API_KEY
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
      setDataSent(data.message)
      setTimeout(() => {
        setDataSent('')  
      }, 2000);
    }
    )
    ;
  }

  function handleDeleteData(id){
    fetch(`${API_URL}/deleteExpense/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_API_KEY
      }
    })
    .then(res => res.json())
    .then(data => {
      setDataSent(data.message)
      setTimeout(() => {
        setDataSent('')  
      }, 2000);
    })
  }

  const handleRadioChange = (event) => {
    const { value } = event.target;
    setSelect(value === "outcome"); // Aggiorna lo stato basandoti sul valore
  };

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
    {/* TODO METTERE FILTRO MESE PER MESE PER NON VEDERE TROPPI DATI */}
      <div className={style.intestazione}>
        <h3>Spese del mese</h3>
        {dataSent !== '' &&
          <h4 className={style.successAlert}>{ dataSent}</h4>
        }
        {columnsToHide.map(column =>
          column.visible === false ? 
            <div>
              <span key={column.nome}>
                <input 
                type="checkbox"
                checked={column.visible}
                onChange={(e)=> handleToggleColumns(e)}
                />
                <span>{column.nome}</span>
              </span>
            </div> 
          : null
        )}
        <div><button className={modal === true ? style.exit : style.enter} onClick={()=>setModal(!modal)}>{modal === true ? "x" : "+"}</button></div>
      </div>
      {modal ? 
        <HomeForm inserisciDati={inserisciDati} handleRadioChange={handleRadioChange} select={select} now={now}/>
      :
      <div className={style.tableContainer}>
      <HomeTable 
        generateHeaders={generateHeaders()} 
        datas={datas || []} 
        columnsToHide={columnsToHide} 
        handleDeleteData={handleDeleteData} 
      />
      </div>
      }
    </div>
  );
}