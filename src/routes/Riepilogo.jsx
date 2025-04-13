import { useEffect } from "react";
import { setDefaultOptions } from "date-fns";
import { it } from 'date-fns/locale';
import { useData } from "../dataContext";
import Loader from "../components/utils/Loader";
import Intestazione from '../components/utils/Intestazione'
import HomeForm from "../components/forms/HomeForm";
import RiepilogoTable from "../components/riepilogo/RiepilogoTable";
import style from './table.module.css'
import ModalRiepilogo from "../components/riepilogo/ModalRiepilogo";

export default function Riepilogo() {

    const { datas, isLoading, fetchData, modal, message, inserisciDati, handleRadioChange, select, now, handleToggleModals, modalRiepilogo } = useData();
  
    useEffect(() => {
      if (datas.length === 0) {
        fetchData();
      }
    }, []);

  setDefaultOptions({ locale: it });

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