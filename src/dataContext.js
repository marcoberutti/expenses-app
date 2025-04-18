import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import API_URL from "./config";
import { format, getYear } from "date-fns";

import { useLoginApi } from "./hooks/useLoginApi"
import { useMessage } from "./hooks/useMessage";
import { useInsertDataApi } from "./hooks/useInsertDataApi";
import { useDeleteDataApi } from "./hooks/useDeleteDataApi";
import { useWriteDataApi } from "./hooks/useWriteDataApi";

import { useNewProductApi } from "./hooks/useNewProductApi";
import { useDeleteProductApi } from "./hooks/useDeleteProductApi";
import { usePopulateProductApi } from "./hooks/usePopulateListaProdotti";
import { useGetProductsApi } from "./hooks/useGetProductsApi";
import { useFilterRiepilogoApi } from "./hooks/useFilterRiepilogoApi";

import { useCreateEventApi } from "./hooks/useCreateEventApi";
import { useWriteEventApi } from "./hooks/useWriteEventApi";

import { useCreateCustomerApi } from "./hooks/useCreateCustomerApi";
import { useGetCustomersApi } from "./hooks/useGetCustomersApi";

import { useCreateMaterialApi } from "./hooks/useCreateMaterialApi";
import { useGetMaterialsApi } from "./hooks/useGetMaterialsApi";
import { useDeleteCustomerOrMaterialeApi } from "./hooks/useDeleteCustomerOrMaterialeApi";

const DataContext = createContext();

export const DataProvider = ({ children }) => {

  const [valoriOutcome, setValoriOutcome] = useState(["Spesa", "Benzina", "Extra", "Casa", "Salute","Investimenti", "tasse", "cucito_out"])
  const [valoriIncome, setValoriIncome] = useState(["Income", "cucito_in"])
  const colors = ["#FF5733", "#4287f5", "#00cc66", "#FFD700", "#8A2BE2", "#E91E63", "#FF9800", "#4CAF50"];
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 3,
  };
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
  
  const { createCustomer } = useCreateCustomerApi();
  const { getCustomers } = useGetCustomersApi();
  const { createMaterial } = useCreateMaterialApi();
  const { getMaterials } = useGetMaterialsApi();
  const { deleteCustomerOrMateriale } = useDeleteCustomerOrMaterialeApi();

  const { writeData } = useWriteDataApi();
  const { handleLogin } = useLoginApi();

  const { getFilteredRiepilogo } = useFilterRiepilogoApi();
  const [filteredRiepilogoDatas, setFilteredRiepilogoDatas] = useState([])

  const [datas, setDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState("normal");
  const [select, setSelect] = useState("outcome");
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
  const [modalRiepilogo, setModalRiepilogo] = useState(false)
  const [openModal, setOpenModal] = useState(false);
  const [openModalModifica, setOpenModalModifica] = useState(false);
  const [clienti, setClienti] = useState([])
  const [materiali, setMateriali] = useState([])

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
      const message = typeof error === 'string'
        ? error
        : error?.message || "Errore nell'inserimento dei dati!";
      setTemporaryMessage(message);
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
    setSelect(value)
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
    writeEvent(data, id)
    .then(data => {
      fetchEvents();
      setTemporaryMessage(data.message || "Dati modificati correttamente");
    })
    .catch((error) => {
      setTemporaryMessage(error || "Errore nella modifica dei dati!");
    });
  };

  const filterDataRiepilogo = useCallback((inizio, fine, categoria) => {
    if (!inizio || !fine || !categoria) return;
    getFilteredRiepilogo(inizio, fine, categoria)
    .then(res => setFilteredRiepilogoDatas(res))
  }, []);
  
  const inserisciCliente = (data) => {
    const dataWithStato = {
      ...data, 
      stato:"da fare",
      data: format(new Date(), "yyyy-MM-dd hh:mm:ss"),
    }
    createCustomer(dataWithStato)
    .then(res => {
      fetchEvents();
      setTemporaryMessage(res.message || "Dati inseriti ok!");
    })
    .catch((error) => {
      setTemporaryMessage(error || "Errore nell'inserimento dei dati!");
    });
  };

  const getClienti = () => {
    getCustomers()
    .then(data => setClienti(data))
  }
    
  const inserisciMateriale = (data) => {
    createMaterial(data)
    .then(res => {
      fetchEvents();
      setTemporaryMessage(res.message || "Dati inseriti ok!");
    })
    .catch((error) => {
      setTemporaryMessage(error || "Errore nell'inserimento dei dati!");
    });
  };

  const getMateriali = () => {
    getMaterials()
    .then(data => setMateriali(data))
  }
  
  const cancellaMaterialeOCliente = (id, tabella) => {
    deleteCustomerOrMateriale(id, tabella)
    .then((res) => {
      if(tabella === "materiali"){
        getMateriali()
      } else {
        getClienti()
      }
      setTemporaryMessage(res.message || "Dati eliminati con successo!");
    })
    .catch((error) => {
      setTemporaryMessage(error || "Errore nell'eliminazione dei dati!");
    });
  }
  
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
    modificaEvento,
    modalRiepilogo,
    setModalRiepilogo,
    filterDataRiepilogo,
    filteredRiepilogoDatas,
    openModal,
    setOpenModal,
    colors,
    style,
    openModalModifica,
    setOpenModalModifica,
    valoriOutcome,
    valoriIncome,
    inserisciCliente,
    getClienti,
    clienti,
    inserisciMateriale,
    getMateriali,
    materiali,
    cancellaMaterialeOCliente,
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
