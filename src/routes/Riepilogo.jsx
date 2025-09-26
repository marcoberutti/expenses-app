import { useEffect, useState } from "react";
import { setDefaultOptions } from "date-fns";
import { it } from 'date-fns/locale';
import { useData } from "../dataContext";
import Loader from "../components/utils/Loader";
import Intestazione from '../components/utils/Intestazione'
import HomeForm from "../components/forms/HomeForm";
import RiepilogoTable from "../components/riepilogo/RiepilogoTable";
import style from './table.module.css'
import ModalRiepilogo from "../components/riepilogo/ModalRiepilogo";
import API_URL from "../config"
import { Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from "@mui/material"; 

export default function Riepilogo() {

  const { datas, isLoading, ottieniDati, modal, message, inserisciDati, handleRadioChange, select, now, handleToggleModals, modalRiepilogo } = useData();

  const [formData, setFormData] = useState({
    meseCorrente: new Date().toLocaleString('default', { month: 'long' }),
    marco: 0,
    sara: 0,
    cucito: 0,
    totale: 0
  });
  const [modalMonthlyBalance, setModalMonthlyBalance] = useState(false);
  const [monthlyDatas, setMonthlyDatas] = useState([]); 
  
  useEffect(() => {
    if (datas.length === 0) {
      ottieniDati("expenses");
    }
  }, [datas, ottieniDati]);

  setDefaultOptions({ locale: it });

  function handleSubmit(e) {
    e.preventDefault();

    fetch(`${API_URL}/newMonthBalance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_API_KEY
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Dati inseriti:', data);
      })
      .catch((error) => {
        console.error('Errore durante l\'inserimento dei dati:', error);
      });
  }

  const fetchMonthlyBalance = async () => {
    try {
      const response = await fetch(`${API_URL}/getMonthBalance`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_API_KEY
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMonthlyDatas(data); 
      setModalMonthlyBalance(true);
    } catch (error) {
      console.error('Errore durante il recupero dei dati mensili:', error);
    }
  };


  return (
    <div>
      { isLoading ? <Loader/> :
        <>
          <Intestazione
            title = "Riepilogo annuo"
            message = {message}
            modal = {modal}
            handleToggleModals={handleToggleModals}
          />
          {modal === "normal" ? 
            <div className={style.tableRiepilogoContainer}>
              {modalRiepilogo === true ? <ModalRiepilogo/> : <RiepilogoTable/>}
            </div>
          :
            <HomeForm inserisciDati={inserisciDati} handleRadioChange={handleRadioChange} select={select} now={now}/>
          }
        </>
      }
    </div>
  );
}
