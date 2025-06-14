import {  useEffect } from "react";
import HomeTable from "../components/home/HomeTable";
import HomeForm from "../components/forms/HomeForm";
import { useData } from "../dataContext";
import Loader from "../components/utils/Loader";
import Intestazione from '../components/utils/Intestazione.tsx'
import HomeFormModifica from "../components/forms/HomeFormModifica";

export default function Home() {

  const { datas, isLoading, ottieniDati, modal} = useData();

  useEffect(() => {
    if (datas.length === 0) {
      ottieniDati("expenses");
    }
  }, []);

  function setWhatModalSays(){
    switch (modal) {
      case "modifica":
        return <HomeFormModifica /> 
      case "form":
        return <HomeForm />
      case "normal":
        return <HomeTable /> 
      default:
    }
  }

  return (
    <>
    { isLoading ? <Loader/> :
      <div>
        <Intestazione
          title = "Spese del mese"
        />
        {setWhatModalSays()}
      </div>
    }
    </>
  );
}