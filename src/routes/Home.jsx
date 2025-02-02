import { useEffect, useState } from "react";
import style from './home.module.css';
import { getTime, format, setDefaultOptions } from "date-fns";
import { it } from 'date-fns/locale';
import "bootstrap-icons/font/bootstrap-icons.css";
import { API_URL } from "../config";

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
        "x-api-key": process.env.API_KEY
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
        "x-api-key": process.env.API_KEY
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
        "x-api-key": process.env.API_KEY
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
        <div>{columnsToHide.map(column =>
          column.visible === false ? 
          <span key={column.nome}>
            <input 
            type="checkbox"
            checked={column.visible}
            onChange={(e)=> handleToggleColumns(e)}
            />
            <span>{column.nome}</span>
          </span> : null
        )}</div>
        <div ><button className={modal === true ? style.exit : style.enter} onClick={()=>setModal(!modal)}>{modal === true ? "x" : "+"}</button></div>
      </div>
      {modal ? 
      <div>
        <form method="post" onSubmit={(e) => inserisciDati(e)}>
          <label htmlFor="spesa">uscita</label>
          <input type="radio" name="tipo" id="spesa" value="outcome"
            onChange={handleRadioChange}
            checked={select === true}
          />
          <label htmlFor="income">entrata</label>
          <input type="radio" name="tipo" id="income" value="entrata"
            onChange={handleRadioChange}
            checked={select === false}
          />
          <br/>
          <label htmlFor="descrizione">Descrizione</label>
          <input type="text" name="descrizione" id="descrizione"/>
          <br/>
          <label htmlFor="importo">Importo {select ? 'speso' : 'entrata'}</label>
          <input type="number" name="importo" id="importo"/>
          {select &&
          <select name="tipologia" id="">
            <option value="spesa">Spesa</option>
            <option value="benzina">Benzina</option>
            <option value="extra">Extra</option>
            <option value="casa">Casa</option>
            <option value="salute">Salute</option>
          </select>
          }
          <input type="text" name="data" hidden value={now} readOnly/>
          <br/>
          <button type="submit">Inserisci</button>
        </form>
      </div> :
      <div className={style.tableContainer}>
        <table className={style.table}>
          <thead>
            <tr>
              {generateHeaders()}
            </tr>
          </thead>
          <tbody>
          {datas && datas.map(data => (
            <tr key={data.id}>
              <td
                style={{display: columnsToHide[0].visible ? 'table-cell' : 'none'}}>
                <button
                onClick={() => handleDeleteData(data.id)}
                >
                  <i className="bi-trash"></i>
                </button>
                {format(data.data, 'MMM')}</td>
              <td
                style={{display: columnsToHide[1].visible ? 'table-cell' : 'none'}}>
                {data.descrizione}</td>
              <td
                style={{display: columnsToHide[2].visible ? 'table-cell' : 'none'}}>
                {data.Spesa} {data.Spesa !== null && '€'}</td>
              <td
                style={{display: columnsToHide[3].visible ? 'table-cell' : 'none'}}>
                {data.Income} {data.Income !== null && '€'}</td>
              <td
                style={{display: columnsToHide[4].visible ? 'table-cell' : 'none'}}>
                {data.Benzina} {data.Benzina !== null && '€'}</td>
              <td
                style={{display: columnsToHide[5].visible ? 'table-cell' : 'none'}}>
                {data.Extra} {data.Extra !== null && '€'}</td>
              <td
                style={{display: columnsToHide[6].visible ? 'table-cell' : 'none'}}>
                {data.Casa} {data.Casa !== null && '€'}</td>
              <td
                style={{display: columnsToHide[7].visible ? 'table-cell' : 'none'}}>
                {data.Salute} {data.Salute !== null && '€'}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
      }
    </div>
  );
}