import React, { createContext, useState, useContext } from 'react';

const SharedStateContext = createContext();

export const SharedStateProvider = ({ children }) => {

  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState("normal");
  const [message, setMessage] = useState('');

  const setTemporaryMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage('');
    }, 4000);
  };

  const value = { 
    isLoading, 
    setIsLoading,
    modal,
    setModal,
    setTemporaryMessage,
    message
  };

  return (
    <SharedStateContext.Provider value={value}>
      {children}
    </SharedStateContext.Provider>
  );
};

export const useSharedState = () => useContext(SharedStateContext);