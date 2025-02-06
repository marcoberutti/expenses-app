import { useEffect } from "react";
import { setDefaultOptions } from "date-fns";
import { it } from 'date-fns/locale';
import { useData } from "../dataContext";
import Loader from "../components/Loader";
import Intestazione from "../components/Intestazione";
import HomeForm from "../components/HomeForm";
import RiepilogoTable from "../components/RiepilogoTable";

export default function Riepilogo() {

    const { datas, isLoading, fetchData, modal, message, setModal, inserisciDati, handleRadioChange, select, now } = useData();
  
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
          setModal = {setModal}
          modal = {modal}
      />
      {modal ? 
        <HomeForm inserisciDati={inserisciDati} handleRadioChange={handleRadioChange} select={select} now={now}/>
      :
        <RiepilogoTable/>
      }
      </>
    }
    </div>
  );
}