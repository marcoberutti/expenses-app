import { useData } from "../dataContext"
import style from './HomeTable.module.css'
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';

import { format } from "date-fns";
import { it } from "date-fns/locale";

export default function HomeTableTbody ({filteredDatas}){

  const {columnsToHide, rimuoviDati, getDataForUpdateForm, setModal, setSelect} = useData()

  return (
    <TableBody>
    {filteredDatas && filteredDatas.map(data => (
      <TableRow key={data.id}>
        <TableCell  sx={{p:0}} align="center"
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
              <i className="bi-trash"></i>
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
            <i className="bi-pen"></i>
            </IconButton>
            <span>
              <strong>
                {format(data.data, 'MMM', {locale: it})}
              </strong>
            </span>
          </div>
        </TableCell>
          <TableCell  sx={{p:0, fontSize:'0.8rem'}} align="center"
            style={{display: columnsToHide[1].visible ? 'table-cell' : 'none'}}>
            {data.descrizione}
            </TableCell>
          <TableCell  sx={{p:0, fontSize:'0.8rem'}} align="center"
            style={{display: columnsToHide[2].visible ? 'table-cell' : 'none'}}>
            {data.Spesa && `${data.Spesa} €`}</TableCell>
          <TableCell  sx={{p:0, fontSize:'0.8rem'}} align="center"
            style={{display: columnsToHide[3].visible ? 'table-cell' : 'none'}}>
            {data.Income && `${data.Income} €`}</TableCell>
          <TableCell  sx={{p:0, fontSize:'0.8rem'}} align="center"
            style={{display: columnsToHide[4].visible ? 'table-cell' : 'none'}}>
            {data.Benzina && `${data.Benzina} €`}</TableCell>
          <TableCell  sx={{p:0, fontSize:'0.8rem'}} align="center"
            style={{display: columnsToHide[5].visible ? 'table-cell' : 'none'}}>
            {data.Extra && `${data.Extra} €`}</TableCell>
          <TableCell  sx={{p:0, fontSize:'0.8rem'}} align="center"
            style={{display: columnsToHide[6].visible ? 'table-cell' : 'none'}}>
            {data.Casa && `${data.Casa} €`}</TableCell>
          <TableCell  sx={{p:0, fontSize:'0.8rem'}} align="center"
            style={{display: columnsToHide[7].visible ? 'table-cell' : 'none'}}>
            {data.Salute && `${data.Salute} €`}</TableCell>
      </TableRow>
    ))}
    </TableBody>
  )
}