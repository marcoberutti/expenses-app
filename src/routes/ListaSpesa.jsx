import { useEffect, useState } from "react";
import style from './listaSpesa.module.css'
import { useData } from "../dataContext"
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { IconButton } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Loader from "../components/utils/Loader"
import API_URL from '../config'

export default function ListaSpesa(){

  const {listaSpesa, fetchListSpesa, deleteProductList, addProductList, products} = useData();
  const [newProduct, setNewProduct] = useState("");

  
  useEffect(() => {
    if (listaSpesa.length === 0) {
      fetchListSpesa();
    }
  }, []);

  async function getPrice(newProduct){
    if (!newProduct.trim()) return;
    
    try {
      const response = await fetch(`${API_URL}/supermercato/${newProduct}`, {
        method:"POST"
      });
      if (!response.ok) {
        throw new Error(`Errore nel recupero dei dati: ${response.status}`);
      }
      
      const data = await response.json();

      let prodotti = data.displayables.entities
      let mappedPrices = prodotti.map(prodotto => parseFloat(prodotto.label.match(/[\d,]+/g).join("").replace(",",".")))
      const prezzoMedio = mappedPrices.reduce((somma, prezzo) => somma+prezzo,0) / mappedPrices.length
      return prezzoMedio

    } catch (error) {
      console.error("Errore nella richiesta:", error);
    }

  }

  async function handleSubmit(e) {
    e.preventDefault();
    let prezzoMedio = await getPrice(newProduct)

    addProductList(newProduct, parseFloat(prezzoMedio).toFixed(2));
    setNewProduct("");

  }


  return (
    <>
      <div style={{display:"flex", justifyContent:"space-evenly", alignItems:"center", flexDirection:"column"}}>
        <div style={{display:"flex", justifyContent:"space-evenly", alignItems:"center", width:"100%"}}>
          <h3>Lista della spesa</h3>
          <p>
            Tot indicativo: {" "}
            {Array.isArray(listaSpesa) && listaSpesa.length > 0 
              ? listaSpesa.reduce((tot, prod) => tot + (parseFloat(prod.prezzo) || 0), 0).toFixed(2) 
              : "0.00"} €
          </p>
        </div>
        <form method="post" onSubmit={handleSubmit}>
          <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
            <Autocomplete
              disablePortal
              id="standard-basic"
              freeSolo // Permette di digitare un valore non presente nella lista
              options={products.map(product => product.prodotto)}
              sx={{ mb: 1, width: 300 }}
              value={newProduct}
              onChange={(event, newValue) => {
                if (typeof newValue === "string") {
                  setNewProduct(newValue); // Se è una stringa, la impostiamo
                }
                console.log("Nuovo valore selezionato o digitato:", newValue);
              }}
              onInputChange={(event, newInputValue) => {
                setNewProduct(newInputValue); // Permette di scrivere nel campo senza problemi
                console.log("Nuovo valore digitato:", newInputValue);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Nuovo prodotto" variant="standard" />
              )}
              slotProps={{
                listbox: {
                  sx: {
                    bgcolor: '#201f1f',
                    color: 'text.primary'
                  }
                }
              }}
            />
            <IconButton type="submit" style={{width:"40px", height:"40px"}}>
              <i className="bi bi-send"></i>
            </IconButton>
          </div>
        </form>
      </div>
      <br/>
      {!listaSpesa ? (
        <Loader />
      ) : (
        <List sx={{ width: "65%", bgcolor: "background.paper", margin: "0 auto"}} aria-label="lista-spesa">
          {listaSpesa.map((item) => (
            <ListItem key={item.data} disablePadding onClick={() => deleteProductList(item.id)} divider={true}>
              <ListItemButton>
                <ListItemText inset primary={item.prodotto} />
                { item.prezzo &&
                <ListItemText inset primary={`${item.prezzo} € / Kg, Lt`} />
                }
                {item.trend === "buono" ? (
                  <i className={`bi bi-arrow-down ${style.down}`}></i> // 🔽 Prezzo basso
                ) : item.trend === "alto" ? (
                  <i className={`bi bi-arrow-up ${style.up}`}></i> // 🔼 Prezzo alto
                ) : (
                  <i className={`bi bi-arrow-right ${style.neutral}`}></i> // ➡️ Prezzo nella media
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </>
  )
}