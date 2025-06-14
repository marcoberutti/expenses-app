import { useData } from "../../dataContext"
import TableBody from '@mui/material/TableBody';
import p from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { format } from "date-fns";
import { it } from 'date-fns/locale';
import { formatCurrency } from "../../utils";

export default function HomeTableTbody ({filteredDatas}){

  const {setSelect, getDataForUpdateForm, setModal} = useData();

  return (
    <>
      {filteredDatas && filteredDatas.map(data => (
        <div 
          key={data.id}         
          onClick={()=>{
            if(data.Income || data.cucito_in){
              setSelect("income")
            } else {
              setSelect("outcome")
            }
            getDataForUpdateForm(data)
            setModal("modifica")}
          }
          style={{display:"flex", flexDirection: "row", justifyContent: "space-around", width: "100%"}}
        >
            <p  sx={{p:1, fontSize:'0.8rem', width:'25px'}} align="center">
              {data.data && format(data.data, "d-MMM", { locale: it })}</p>
            {data.descrizione && <p sx={{p:1, fontSize:'0.8rem', width:'25px'}} align="center">
              {data.descrizione}</p>}
            {data.Income && <p sx={{p:1, fontSize:'0.8rem', width:'25px'}} align="center">
              {data.Income && `${formatCurrency(data.Income)}`}</p>}
            {data.Spesa && <p sx={{p:1, fontSize:'0.8rem', width:'25px'}} align="center">
              {data.Spesa && `${formatCurrency(data.Spesa)}`}</p>}
            {data.Benzina && <p sx={{p:1, fontSize:'0.8rem', width:'25px'}} align="center">
              {data.Benzina && `${formatCurrency(data.Benzina)}`}</p>}
            {data.Extra && <p sx={{p:1, fontSize:'0.8rem', width:'25px'}} align="center">
              {data.Extra && `${formatCurrency(data.Extra)}`}</p>}
            {data.Casa && <p sx={{p:1, fontSize:'0.8rem', width:'25px'}} align="center">
              {data.Casa && `${formatCurrency(data.Casa)}`}</p>}
            {data.Salute && <p sx={{p:1, fontSize:'0.8rem', width:'25px'}} align="center">
              {data.Salute && `${formatCurrency(data.Salute)}`}</p>}
            {data.Investimenti && <p sx={{p:1, fontSize:'0.8rem', width:'25px'}} align="center">
              {data.Investimenti && `${formatCurrency(data.Investimenti)}`}</p>}
            {data.tasse && <p sx={{p:1, fontSize:'0.8rem', width:'25px'}} align="center">
              {data.tasse && `${formatCurrency(data.tasse)}`}</p>}
        </div>
      ))}
    </>
  )
}