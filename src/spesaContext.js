import React, { createContext, useContext, useState} from 'react'
import { useSharedState } from './sharedStateContext';
import { useGetDatasApi } from "./hooks/useGetDatasApi";

import { useNewProductApi } from "./hooks/useNewProductApi";
import { useDeleteProductApi } from "./hooks/useDeleteProductApi";
import { useWriteProductPrezzoApi } from "./hooks/useWriteProductPrezzoApi";

const SpesaContext = createContext();

export const SpesaProvider = ({children}) => {

  const { setIsLoading, setModal, setTemporaryMessage } = useSharedState();
  const { getDatas } = useGetDatasApi();

  const [listaSpesa, setListaSpesa] = useState([]);
  const [products, setProducts] = useState([]);
  const { newProduct } = useNewProductApi();
  const { deleteProduct } = useDeleteProductApi();
  const { writeProductPrezzo } = useWriteProductPrezzoApi();
    
  const fetchListSpesa = async () => {
    setIsLoading(true);
    await getDatas("lista_prodotti")
    .then((data) => {
      setProducts(data)
    })
    await getDatas("lista_spesa")
      .then((data) => {
        setListaSpesa(data);
      })
      .catch((error) => console.error("Errore nel fetch:", error))
      .finally(() => setIsLoading(false));
  };

  const deleteProductList = (id) => {
    deleteProduct(id)
    .then(data => {
      fetchListSpesa();
      setTemporaryMessage(data.message)
      setModal("normal")
    })
  }

  const addProductList = (prodotto) => {
    newProduct(prodotto)
    .then(data => {
      fetchListSpesa();
      setTemporaryMessage(data.message)
      setModal("normal")
    })
  }
    
  const modificaProdotto = (data, id) => {
    writeProductPrezzo(data, id)
    .then(data => {
      fetchListSpesa();
      setTemporaryMessage(data.message || "Dati modificati correttamente");
    })
    .catch((error) => {
      setTemporaryMessage(error || "Errore nella modifica dei dati!");
    });
  };

  const value = {
    listaSpesa,
    products,
    fetchListSpesa,
    deleteProductList,
    addProductList,
    modificaProdotto,
  }
  
  return (
    <SpesaContext.Provider value={value}>
      {children}
    </SpesaContext.Provider>
  );
}

export const useSpesa = () => {
  const context = useContext(SpesaContext);
  if (!context) {
    throw new Error("useSpesa deve essere usato dentro un DataProvider");
  }
  return context;
};