import React, { createContext, useContext, useState, useCallback } from "react";
import API_URL from "./config";
import { getTime, getYear } from "date-fns";
import { useInsertDataApi } from "./hooks/useInsertDataApi";
import { useMessage } from "./hooks/useMessage";
import { useDeleteDataApi } from "./hooks/useDeleteDataApi";
import { useWriteDataApi } from "./hooks/useWriteDataApi";
import { useLoginApi } from "./hooks/useLoginApi"

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { message, setTemporaryMessage } = useMessage();
  const { insertData } = useInsertDataApi();
  const { deleteData } = useDeleteDataApi();
  const { writeData } = useWriteDataApi();
  const { handleLogin } = useLoginApi()
  const [datas, setDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [now, setNow] = useState(getTime(new Date()));
  const [select, setSelect] = useState(true);
  const [columnsToHide, setColumnsToHide] = useState([
    {nome: "Data", visible: true},
    {nome: "Descr.", visible: true},
    {nome: "Spese", visible: true},
    {nome: "Entrate", visible: true},
    {nome: "Benzina", visible: true},
    {nome: "Extra", visible: true},
    {nome: "Casa", visible: true},
    {nome: "Salute", visible: true},
  ]);
  const [isLogged, setIsLogged] = useState(!!localStorage.getItem("token"));

  const fetchData = useCallback(() => {
    setIsLoading(true);
    fetch(`${API_URL}/dati`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_API_KEY
      }
    })
      .then((res) => res.json())
      .then((data) => {
        let filteredData = data.filter(dato => getYear(dato.data) >= new Date().getFullYear());
        setDatas(filteredData);
      })
      .catch((error) => console.error("Errore nel fetch:", error))
      .finally(() => setIsLoading(false));
  }, []);

  const inserisciDati = (e) => {
    insertData(e)
    .then(data => {
      fetchData();
      setTemporaryMessage(data.message || "Dati inseriti ok!");
    })
    .catch((error) => {
      setTemporaryMessage(error || "Errore nell'inserimento dei dati!");
    });
  };

  const rimuoviDati = (id) => {
    deleteData(id)
    .then(data => {
      console.log(data)
      fetchData();
      setTemporaryMessage(data.message)
    })
  }

  const modificaDati = (data, id) => {
    writeData(data, id)
    .then(data => {
      console.log(data)
      fetchData();
      setTemporaryMessage(data.message)
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
    setSelect(value === "outcome"); // Aggiorna lo stato basandoti sul valore
  };

  const value = {
    columnsToHide,
    setColumnsToHide,
    message,
    datas, 
    isLoading, 
    modal, 
    setModal, 
    fetchData, 
    now, 
    setNow,
    select,
    setSelect,
    inserisciDati, 
    rimuoviDati,
    modificaDati,
    handleRadioChange,
    isLogged,
    setIsLogged,
    loginData
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
