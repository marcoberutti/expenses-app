import { Button, TextField } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import { useCucito } from '../../cucitoContext';
import IconButton from '@mui/material/IconButton';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

export default function Form({nomeLabel, nomeLavorazione, onSubmit, tipo}){

  const [formData, setFormData] = useState(() => ({
    nome: "",
    ...(nomeLavorazione ? { lavorazione: "" } : {})
  }));
  
  const { getClienti, getMateriali, setToggleShowArchivio} = useCucito();

  function handleChange(e){
    const {name, value} = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function handleSubmit(){
    if(formData.nome){
      onSubmit(formData)
      setFormData({
        nome: "",
        ...(nomeLavorazione ? { lavorazione: "" } : {})
      });
    }
  }

  return(
    <form>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems:"baseline",
          gap: 0.5,
          width:"100%",
          paddingTop: "15px"
        }}
      >
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
        }}>
          <TextField 
            required
            variant="standard"
            label={nomeLabel}
            name="nome"
            onChange={(e) => handleChange(e)}
            sx={{width:"150px"}}
          />
          { nomeLavorazione &&    
          <TextField 
            required
            variant="standard"
            label={nomeLavorazione}
            name="lavorazione"
            onChange={(e) => handleChange(e)}
            sx={{width:"150px"}}
          />}
        </Box>
        <Box sx={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: "gray ! important",
              fontSize: "1.5rem",
              padding: "2px",
              minWidth: "fit-content",
              lineHeight: "1.1",
              borderRadius: "50%",
              width: "2rem",
              height: "2rem",
            }}
          >
          +
          </Button>
          {nomeLavorazione &&
          <IconButton
            variant="contained"
            onClick={() => setToggleShowArchivio(true)} // Correzione: esegui la funzione al click
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px', // Spazio tra icona e testo
            }}
          >
            <LibraryBooksIcon />
          </IconButton>
          }
        </Box>
      </Box>
    </form>
  )
}