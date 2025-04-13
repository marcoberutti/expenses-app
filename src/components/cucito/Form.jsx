import { Button, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { format } from 'date-fns';
import React, { useState } from 'react'
import { useData } from '../../dataContext';

export default function Form({nomeLabel, nomeLavorazione, nomeButton, onSubmit, tipo}){

  const [formData, setFormData] = useState(() => ({
    nome: "",
    ...(nomeLavorazione ? { lavorazione: "" } : {})
  }));
  
  const { getClienti, getMateriali} = useData();

  function handleChange(e){
    const {name, value} = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function handleSubmit(){
    onSubmit(formData)
    tipo === "clienti" ? getClienti() : getMateriali()
  }

  return(
    <form>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems:"center",
          gap: 0.5,
          width:"100%"
        }}
      >
        <TextField 
          required
          variant="standard"
          label={nomeLabel}
          name="nome"
          onChange={(e) => handleChange(e)}
        />
        { nomeLavorazione &&    
        <TextField 
          required
          variant="standard"
          label={nomeLavorazione}
          name="lavorazione"
          onChange={(e) => handleChange(e)}
        />}
        <Button
          variant="contained"
          onClick={handleSubmit}
        >
        {nomeButton}
        </Button>
      </Box>
    </form>
  )
}