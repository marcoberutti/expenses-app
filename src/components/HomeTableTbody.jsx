import { useData } from "../dataContext"
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import DeleteWriteCellComponent from './DeleteWriteCellComponent';

export default function HomeTableTbody ({filteredDatas}){

  const {columnsToHide, rimuoviDati, getDataForUpdateForm, setModal, setSelect} = useData()

  return (
    <TableBody>
    {filteredDatas && filteredDatas.map(data => (
      <TableRow key={data.id}>
          <DeleteWriteCellComponent dato={data}/>
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