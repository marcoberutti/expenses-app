import React, { createContext, useContext, useState, useCallback } from "react";
import { getYear } from "date-fns";
import { useSharedState } from './sharedStateContext';

import { useLoginApi } from "./hooks/useLoginApi"

import { useGetDatasApi } from "./hooks/useGetDatasApi";
import { useInsertDataApi } from "./hooks/useInsertDataApi";
import { useDeleteDataApi } from "./hooks/useDeleteDataApi";
import { useWriteDataApi } from "./hooks/useWriteDataApi";

import { useFilterRiepilogoApi } from "./hooks/useFilterRiepilogoApi";

const DataContext = createContext();

export const DataProvider = ({ children }) => {

  const { isLoading, setIsLoading, modal, setModal, message, setTemporaryMessage } = useSharedState();

  const [datas, setDatas] = useState([]);
  const { getDatas } = useGetDatasApi();
  const { insertData } = useInsertDataApi();
  const { deleteData } = useDeleteDataApi();
  const { writeData } = useWriteDataApi();

  const { handleLogin } = useLoginApi();

  const { getFilteredRiepilogo } = useFilterRiepilogoApi();
  const [filteredRiepilogoDatas, setFilteredRiepilogoDatas] = useState([])

  const [select, setSelect] = useState("outcome");
  const [isLogged, setIsLogged] = useState(!!localStorage.getItem("token"));
  const [datasForUpdate, setDatasForUpdate] = useState({})
  const [modalRiepilogo, setModalRiepilogo] = useState(false)
  const [ titoloModaleRiepilogo, setTitoloModaleRiepilogo ]  = useState("");
  
  const ottieniDati = (table) => {
    setIsLoading(true);
    getDatas(table)
      .then((data) => {
        let filteredData = data.filter(dato => getYear(dato.data) >= new Date().getFullYear());
        setDatas(filteredData);
      })
      .catch((error) => console.error("Errore nel fetch:", error))
      .finally(() => setIsLoading(false));
  };

  const inserisciDati = (e, table) => {
    console.log(e)
    insertData(e)
    .then(data => {
      ottieniDati(table);
      setTemporaryMessage(data.message || "Dati inseriti ok!");
    })
    .catch((error) => {
      const message = typeof error === 'string'
        ? error
        : error?.message || "Errore nell'inserimento dei dati!";
      setTemporaryMessage(message);
    });

  };

  const rimuoviDati = async (id, table) => {
    await deleteData(id)
    .then(data => {
      ottieniDati(table);
      setTemporaryMessage(data.message)
    })
  }

  const modificaDati = async (data, id, table) => {
    console.log(data, id, table)
    await writeData(data, id)
    .then(data => {
      ottieniDati(table);
      setTemporaryMessage(data.message)
      setModal("normal")
    })
  }

  const loginData = (data) => {
    handleLogin(data)
    .then(data => {
      if(data.success === true){
        localStorage.setItem("Token", "asl2os4n12g94f65ns0t467rhb2")
        setIsLogged(true)
        setTemporaryMessage(data.message || "Loggato");
      }
    })
  }

  const handleRadioChange = (event) => {
    const { value } = event.target;
    setSelect(value)
  };

  const getDataForUpdateForm = (data) => {
    const filteredObj = Object.fromEntries(
      Object.entries(data).filter(([key, val]) => val !== null)
    )
    setDatasForUpdate(filteredObj)
  };

  const filterDataRiepilogo = useCallback((inizio, fine, categoria) => {
    if (!inizio || !fine || !categoria) return;
    getFilteredRiepilogo(inizio, fine, categoria)
    .then(res => setFilteredRiepilogoDatas(res))
    setTitoloModaleRiepilogo(categoria)
  }, []);
  
  const value = {
    datas,
    setDatas,
    isLoading, 
    modal, 
    setModal, 
    ottieniDati,
    select,
    setSelect,
    inserisciDati, 
    rimuoviDati,
    modificaDati,
    handleRadioChange,
    isLogged,
    setIsLogged,
    loginData,
    getDataForUpdateForm,
    datasForUpdate,
    modalRiepilogo,
    setModalRiepilogo,
    filterDataRiepilogo,
    filteredRiepilogoDatas,
    titoloModaleRiepilogo,
    setFilteredRiepilogoDatas,
  }


  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData deve essere usato dentro un DataProvider");
  }
  return context;
};
