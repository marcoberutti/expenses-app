import React from 'react'
import { useData } from '../../dataContext';
import style from './deleteWriteCell.module.css'
import { TableCell, IconButton } from '@mui/material';

export default function DeleteWriteCellComponent({dato}){
  const {rimuoviDati, setSelect, getDataForUpdateForm, setModal} = useData();
  
  return(
    <TableCell  sx={{p:0, width:'25px', border:"1px solid #494949"}} align="center">
      <div className={style.deleteAndDateCell}>
        <IconButton size="small"
          style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
          onClick={() => {
            if (window.confirm("cancellare davvero?")) {
              rimuoviDati(dato.id);
            }}
          }
        >
          <i className={`bi-trash ${style.trash}`} style={{fontSize:"1rem"}}></i>
        </IconButton>
        <IconButton size="small"
        style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
        onClick={()=>{
        if(dato.Income || dato.cucito_in){
          setSelect("income")
        } else {
          setSelect("outcome")
        }
        getDataForUpdateForm(dato)
        setModal("modifica")}
        }
        >
          <i className={`bi-pen ${style.pen}`} style={{fontSize:"1rem"}}></i>
        </IconButton>
      </div>
    </TableCell>
  )
}