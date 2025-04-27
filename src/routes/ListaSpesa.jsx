import { useEffect, useState } from "react";
import { useData } from "../dataContext"
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { IconButton, Input } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Loader from "../components/utils/Loader"
import { useSpesa } from "../spesaContext";

export default function ListaSpesa(){

  const {listaSpesa, fetchListSpesa, deleteProductList, addProductList, products, modificaProdotto} = useSpesa();
  const [newProduct, setNewProduct] = useState("");
  const [prezzi, setPrezzi] = useState({});
  
  useEffect(() => {
    if (listaSpesa.length === 0) {
      fetchListSpesa();
    }
    const initPrezzi = {};
    listaSpesa.forEach(item => {
      initPrezzi[item.id] = item.prezzo || "";
    });
    setPrezzi(initPrezzi)
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    addProductList(newProduct);
    setNewProduct("");
  }

  const handlePrezzoChange = (id, e) => {
    setPrezzi(prevPrezzi => ({
      ...prevPrezzi,
      [id]: e.target.value,
      }));
  };

  const handlePrezzoBlur = (id) => {
    const prezzoDaAggiornare = prezzi[id];
    if (prezzoDaAggiornare !== undefined && prezzoDaAggiornare !== "") {
      modificaProdotto(prezzoDaAggiornare, id)
    }
  };


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
        <List sx={{ width: "80%", bgcolor: "background.paper", margin: "0 auto"}} aria-label="lista-spesa">
          {listaSpesa.map((item) => (
            <ListItem 
            key={item.data} 
            disablePadding 
            divider={true}
            onClick={(e) => {
              if (e.target.tagName !== 'INPUT') { // Verifica se l'elemento cliccato NON è un input
                e.stopPropagation();
                deleteProductList(item.id);
              }
            }}
            >
              <ListItemText primary={item.prodotto} />
              <Input
                type="number"
                value={prezzi[item.id] === undefined ? '' : prezzi[item.id]}
                onChange={(e) => handlePrezzoChange(item.id, e)}
                onBlur={(e) => handlePrezzoBlur(item.id)}
                onClick={(e) => e.stopPropagation()}
                sx={{
                  width:"80px"
                }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </>
  )
}