import React, { createContext, useContext, useState } from "react";

import { useSharedState } from './sharedStateContext';

import { useGetDatasApi } from "./hooks/useGetDatasApi";

import { useCreateCustomerApi } from "./hooks/useCreateCustomerApi";
import { useArchiveCustomerApi } from "./hooks/useArchiveCustomerApi";
import { useDeleteCustomerApi } from "./hooks/useDeleteCustomerApi";

import { useCreateMaterialApi } from "./hooks/useCreateMaterialApi";
import { useDeleteMaterialeApi } from "./hooks/useDeleteMaterialeApi";

import { useGirofondoApi } from "./hooks/useGirofondoApi";

import { useWriteStatoLavorazioneApi } from "./hooks/useWriteStatoLavorazioneApi";
import { format } from "date-fns";
import { useData } from "./dataContext";

const CucitoContext = createContext();

export const CucitoProvider = ({ children }) => {

  const { getDatas } = useGetDatasApi();
  const { ottieniDati } = useData();
  const { setTemporaryMessage } = useSharedState();
  const [toggleShowArchivio, setToggleShowArchivio] = useState(false)

  const [clienti, setClienti] = useState([]);
  const [materiali, setMateriali] = useState([]);
  const [archiviato, setArchiviato] = useState(false);

  const { createCustomer } = useCreateCustomerApi();
  const { archiveCustomer } = useArchiveCustomerApi();
  const { deleteCustomer } = useDeleteCustomerApi();
  const { createMaterial } = useCreateMaterialApi();
  const { deleteMateriale } = useDeleteMaterialeApi();
  const { girofondo } = useGirofondoApi();
  const { writeStatoLavorazione } = useWriteStatoLavorazioneApi();

  const getClienti = () => {
    getDatas("clienti")
    .then(data => setClienti(data))
  }

  const getMateriali = () => {
    getDatas("materiali")
    .then(data => setMateriali(data))
  }

  const inserisciCliente = async (data) => {
    const dataWithStato = {
      ...data, 
      stato:"da fare",
      data: format(new Date(), "yyyy-MM-dd hh:mm:ss"),
      active: true
    }
    await createCustomer(dataWithStato)
    .then(res => {
      setTemporaryMessage(res.message || "Dati inseriti ok!");
      getClienti();
    })
    .catch((error) => {
      setTemporaryMessage(error || "Errore nell'inserimento dei dati!");
    });
  };

  const archiviaCliente = (id) => {
    archiveCustomer(id)
    .then(res => {
      getClienti();
      setArchiviato(true)
      setTimeout(() => {
        setArchiviato(false)
      }, 2000);
      setTemporaryMessage(res.message || "Cliente archiviato!");
    })
    .catch((error) => {
      setTemporaryMessage(error || "Errore nell'inserimento dei dati!");
    });
  }

  const cancellaCliente = async (id) => {
    await deleteCustomer(id)
    .then(res => {
      getClienti();
      setTemporaryMessage(res.message || "Cliente cancellato");
    })
    .catch((error) => {
      setTemporaryMessage(error || "Errore nell'inserimento dei dati!");
    });
  }
    
  const inserisciMateriale = (data) => {
    createMaterial(data)
    .then(res => {
      getMateriali();
      setTemporaryMessage(res.message || "Dati inseriti ok!");
    })
    .catch((error) => {
      setTemporaryMessage(error || "Errore nell'inserimento dei dati!");
    });
  };
  
  const cancellaMateriale = (id) => {
    deleteMateriale(id)
    .then((res) => {
      getMateriali()
      setTemporaryMessage(res.message || "Dati eliminati con successo!");
    })
    .catch((error) => {
      setTemporaryMessage(error || "Errore nell'eliminazione dei dati!");
    });
  }

  const handleStatoLavorazione = (nuovoStato, id) => {
    const data = {"stato": nuovoStato}
    writeStatoLavorazione(data, id)
    .then(res => {
      getClienti();
      setTemporaryMessage(res.message || "Dati inseriti ok!");
    })
    .catch((error) => {
      setTemporaryMessage(error || "Errore nell'inserimento dei dati!");
    });
  }

  const trasferimento = async (data) => {
    await girofondo(data)
    .then(res => {
      ottieniDati("expenses");
      setTemporaryMessage(res.message || "Dati inseriti ok!");
    })
    .catch((error) => {
      setTemporaryMessage(error || "Errore nell'inserimento dei dati!");
    });
  }


  const value = {
    clienti,
    getClienti,
    materiali,
    getMateriali,
    inserisciCliente,
    archiviaCliente,
    cancellaCliente,
    inserisciMateriale,
    cancellaMateriale,
    handleStatoLavorazione,
    toggleShowArchivio,
    setToggleShowArchivio,
    trasferimento,
    archiviato,
    setArchiviato,
  }
  
  return (
    <CucitoContext.Provider value={value}>
      {children}
    </CucitoContext.Provider>
  );
};

export const useCucito = () => {
  const context = useContext(CucitoContext);
  if (!context) {
    throw new Error("useCucito deve essere usato dentro un DataProvider");
  }
  return context;
};