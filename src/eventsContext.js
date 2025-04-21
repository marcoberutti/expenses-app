import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useSharedState } from './sharedStateContext';
import { useGetDatasApi } from "./hooks/useGetDatasApi";

import { useCreateEventApi } from "./hooks/useCreateEventApi";
import { useWriteEventApi } from "./hooks/useWriteEventApi";

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  
  const { isLoading, setIsLoading, message, setTemporaryMessage } = useSharedState();

  const { getDatas } = useGetDatasApi();

  const [openModal, setOpenModal] = useState(false);
  const [openModalModifica, setOpenModalModifica] = useState(false);
  
  const [eventi, setEventi] = useState([]);
  const { createEvent } = useCreateEventApi();
  const { writeEvent } = useWriteEventApi();


  const fetchEvents = useCallback(() => {
    setIsLoading(true);
    getDatas("events")
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
  
  const value = {
    eventi,
    inserisciEvento,
    fetchEvents,
    modificaEvento,
    openModalModifica,
    setOpenModalModifica,
    openModal,
    setOpenModal,
  }


  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvent deve essere usato dentro un DataProvider");
  }
  return context;
};
