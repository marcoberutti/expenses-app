import { useData } from "../dataContext"
import style from './HomeTable.module.css'
import { format } from "date-fns";
import { it } from "date-fns/locale";

export default function HomeTableTbody ({filteredDatas}){

  const {columnsToHide, rimuoviDati, getDataForUpdateForm, setModal, setSelect} = useData()

  return (
    <tbody>
    {filteredDatas && filteredDatas.map(data => (
      <tr key={data.id}>
        <td
          style={{display: columnsToHide[0].visible ? 'table-cell' : 'none'}}>
          <div className={style.deleteAndDateCell}>
            <button
              style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
              onClick={() => {
                if (window.confirm("cancellare davvero?")) {
                  rimuoviDati(data.id);
                }}
              }
            >
              <i className="bi-trash"></i>
            </button>
            <button
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
            </button>
            <span>
              {format(data.data, 'MMM', {locale: it})}
            </span>
          </div>
        </td>
          <td
            style={{display: columnsToHide[1].visible ? 'table-cell' : 'none'}}>
            {data.descrizione}
            </td>
          <td
            style={{display: columnsToHide[2].visible ? 'table-cell' : 'none'}}>
            {data.Spesa && `${data.Spesa} €`}</td>
          <td
            style={{display: columnsToHide[3].visible ? 'table-cell' : 'none'}}>
            {data.Income && `${data.Income} €`}</td>
          <td
            style={{display: columnsToHide[4].visible ? 'table-cell' : 'none'}}>
            {data.Benzina && `${data.Benzina} €`}</td>
          <td
            style={{display: columnsToHide[5].visible ? 'table-cell' : 'none'}}>
            {data.Extra && `${data.Extra} €`}</td>
          <td
            style={{display: columnsToHide[6].visible ? 'table-cell' : 'none'}}>
            {data.Casa && `${data.Casa} €`}</td>
          <td
            style={{display: columnsToHide[7].visible ? 'table-cell' : 'none'}}>
            {data.Salute && `${data.Salute} €`}</td>
      </tr>
    ))}
    </tbody>
  )
}