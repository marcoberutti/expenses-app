import style from './HomeTable.module.css'
import { useData } from "../dataContext"
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';

export default function HomeTableTbody ({filteredDatas}){

  const {columnsToHide, rimuoviDati, getDataForUpdateForm, setModal, setSelect} = useData()

  return (
    <TableBody>
    {filteredDatas && filteredDatas.map(data => (
      <TableRow key={data.id}>
        <TableCell  sx={{p:0, width:'25px', border:"1px solid #494949"}} align="center"
          style={{display: columnsToHide[0].visible ? 'table-cell' : 'none'}}>
          <div className={style.deleteAndDateCell}>
            <IconButton size="small"
              style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
              onClick={() => {
                if (window.confirm("cancellare davvero?")) {
                  rimuoviDati(data.id);
                }}
              }
            >
              <i className={`bi-trash ${style.trash}`} style={{fontSize:"1rem"}}></i>
            </IconButton>
            <IconButton size="small"
            style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
            onClick={()=>{
            if(data.Income){
              setSelect(false)
            } else {
              setSelect(true)
            }
            getDataForUpdateForm(data)
            setModal("modifica")}
            }
            >
              <i className={`bi-pen ${style.pen}`} style={{fontSize:"1rem"}}></i>
            </IconButton>
          </div>
        </TableCell>
          <TableCell  sx={{p:0, fontSize:'0.8rem', width:'25px', border:"1px solid #494949"}} align="center">
            {data.descrizione.length > 8 ? data.descrizione.substring(0,8) + "..." : data.descrizione}
            </TableCell>
          <TableCell  sx={{p:0, fontSize:'0.8rem', width:'25px', border:"1px solid #494949"}} align="center">
            {data.Spesa && `${data.Spesa} €`}</TableCell>
          <TableCell  sx={{p:0, fontSize:'0.8rem', width:'25px', border:"1px solid #494949"}} align="center">
            {data.Income && `${data.Income} €`}</TableCell>
          <TableCell  sx={{p:0, fontSize:'0.8rem', width:'25px', border:"1px solid #494949"}} align="center">
            {data.Benzina && `${data.Benzina} €`}</TableCell>
          <TableCell  sx={{p:0, fontSize:'0.8rem', width:'25px', border:"1px solid #494949"}} align="center">
            {data.Extra && `${data.Extra} €`}</TableCell>
          <TableCell  sx={{p:0, fontSize:'0.8rem', width:'25px', border:"1px solid #494949"}} align="center">
            {data.Casa && `${data.Casa} €`}</TableCell>
          <TableCell  sx={{p:0, fontSize:'0.8rem', width:'25px', border:"1px solid #494949"}} align="center">
            {data.Salute && `${data.Salute} €`}</TableCell>
          <TableCell  sx={{p:0, fontSize:'0.8rem', width:'25px', border:"1px solid #494949"}} align="center">
            {data.Investimenti && `${data.Investimenti} €`}</TableCell>
          <TableCell  sx={{p:0, fontSize:'0.8rem', width:'25px', border:"1px solid #494949"}} align="center">
            {data.tasse && `${data.tasse} €`}</TableCell>
      </TableRow>
    ))}
    </TableBody>
  )
}