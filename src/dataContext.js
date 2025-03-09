import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import API_URL from "./config";
import { getYear } from "date-fns";

import { useLoginApi } from "./hooks/useLoginApi"
import { useMessage } from "./hooks/useMessage";
import { useInsertDataApi } from "./hooks/useInsertDataApi";
import { useDeleteDataApi } from "./hooks/useDeleteDataApi";
import { useWriteDataApi } from "./hooks/useWriteDataApi";

import { useNewProductApi } from "./hooks/useNewProductApi";
import { useDeleteProductApi } from "./hooks/useDeleteProductApi";
import { usePopulateProductApi } from "./hooks/usePopulateListaProdotti";
import { useGetProductsApi } from "./hooks/useGetProductsApi";

import { useCreateEventApi } from "./hooks/useCreateEventApi";
import { useWriteEventApi } from "./hooks/useWriteEventApi";

const DataContext = createContext();

export const DataProvider = ({ children }) => {

  const [listaSpesa, setListaSpesa] = useState([]);
  const [eventi, setEventi] = useState([])
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "dark";
  });
  const { message, setTemporaryMessage } = useMessage();
  const { insertData } = useInsertDataApi();
  const { deleteData } = useDeleteDataApi();

  const { newProduct } = useNewProductApi();
  const { deleteProduct } = useDeleteProductApi();
  const { populateProduct } = usePopulateProductApi();
  const { getProducts } = useGetProductsApi();
  const [products, setProducts] = useState([]);

  const { createEvent } = useCreateEventApi();
  const { writeEvent } = useWriteEventApi();

  const { writeData } = useWriteDataApi();
  const { handleLogin } = useLoginApi()
  const [datas, setDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState("normal");
  const [select, setSelect] = useState(true);
  const [columnsToHide, setColumnsToHide] = useState([
    {nome: "Data", visible: true},
    {nome: "Descr.", visible: true},
    {nome: "Spesa", visible: true},
    {nome: "Entrate", visible: true},
    {nome: "Benzina", visible: true},
    {nome: "Extra", visible: true},
    {nome: "Casa", visible: true},
    {nome: "Salute", visible: true},
    {nome: "Investimenti", visible: true},
    {nome: "Tasse", visible: true},
  ]);
  const [isLogged, setIsLogged] = useState(!!localStorage.getItem("token"));
  const [datasForUpdate, setDatasForUpdate] = useState({})
  const [formData, setFormData] = useState({
    descrizione: '',
    spesa: '',
    income: '',
    benzina: '',
    extra: '',
    casa: '',
    salute: '',
    data: '',
    investimenti: '',
    tasse:'',
  });

  const handleSetTheme = (e) => {
    setTheme(e.target.checked ? "dark" : "light")
  }

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]); 
  
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
      fetchData();
      setTemporaryMessage(data.message)
    })
  }
  const modificaDati = (data, id) => {
    writeData(data, id)
    .then(data => {
      fetchData();
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
    setSelect(value === "outcome");
  };
  const handleToggleModals = () => {
    switch (modal) {
      case "modifica":
      setModal("normal")
      break
      case "form":
      setModal("normal")
      break
      case "normal":
      setModal("form")
      break
      default:
    }
  };
  const getDataForUpdateForm = (data) => {
    const filteredObj = Object.fromEntries(
      Object.entries(data).filter(([key, val]) => val !== null)
    )
    setDatasForUpdate(filteredObj)
  };

  const fetchListSpesa = useCallback(async () => {
    setIsLoading(true);
    await getProducts()
    .then((data) => {
      setProducts(data)
    })

    fetch(`${API_URL}/getListSpesa`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_API_KEY
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setListaSpesa(data);

      })
      .catch((error) => console.error("Errore nel fetch:", error))
      .finally(() => setIsLoading(false));
  }, []);

  const deleteProductList = (id) => {
    deleteProduct(id)
    .then(data => {
      fetchListSpesa();
      setTemporaryMessage(data.message)
      setModal("normal")
    })
  }

  const addProductList = (prodotto, prezzo) => {
    populateProduct(prodotto,prezzo)
    newProduct(prodotto, prezzo)
    .then(data => {
      fetchListSpesa();
      setTemporaryMessage(data.message)
      setModal("normal")
    })
  }

  const fetchEvents = useCallback(() => {
    setIsLoading(true);
    fetch(`${API_URL}/getEvents`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_API_KEY
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setEventi(data)
      })
      .catch((error) => console.error("Errore nel fetch:", error))
      .finally(() => setIsLoading(false));
  }, []);
  
  const inserisciEvento = (titolo, data, colore) => {
    createEvent(titolo, data, colore)
    .then(data => {
      fetchEvents();
      setTemporaryMessage(data.message || "Dati inseriti ok!");
    })
    .catch((error) => {
      setTemporaryMessage(error || "Errore nell'inserimento dei dati!");
    });
  };

  const modificaEvento = (data, id) => {
    console.log(data, id)
    writeEvent(data, id)
    .then(data => {
      fetchEvents();
      setTemporaryMessage(data.message || "Dati modificati correttamente");
    })
    .catch((error) => {
      setTemporaryMessage(error || "Errore nella modifica dei dati!");
    });
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
    select,
    setSelect,
    inserisciDati, 
    rimuoviDati,
    modificaDati,
    handleRadioChange,
    isLogged,
    setIsLogged,
    loginData,
    handleToggleModals,
    getDataForUpdateForm,
    datasForUpdate,
    formData,
    setFormData,
    handleSetTheme,
    theme,
    fetchListSpesa,
    listaSpesa,
    deleteProductList,
    addProductList,
    products,
    inserisciEvento,
    eventi,
    fetchEvents,
    modificaEvento
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
