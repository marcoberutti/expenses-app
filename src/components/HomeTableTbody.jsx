import { useState } from "react";
import { useData } from "../dataContext"
import style from './HomeTable.module.css'
import { format } from "date-fns";
import { it } from "date-fns/locale";

export default function HomeTableTbody ({datas, editingRow, setEditingRow}){

  const {columnsToHide, rimuoviDati, modificaDati} = useData()

  const [formData, setFormData] = useState({
    descrizione: '',
    spesa: '',
    income: '',
    benzina: '',
    extra: '',
    casa: '',
    salute: ''
  });

  function handleToggleEdit(rowId) {
    if (editingRow === rowId) {
      setEditingRow(null)
    } else {
      const data = datas.find(item => item.id === rowId); // Trova i dati della riga selezionata
      setFormData({
        descrizione: data.descrizione || '',
        spesa: data.Spesa || '',
        income: data.Income || '',
        benzina: data.Benzina || '',
        extra: data.Extra || '',
        casa: data.Casa || '',
        salute: data.Salute || ''
      });
      setEditingRow(rowId);
    }
  }

  function handleChange(e){
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSave(rowId) {
    let newFormData
    for (let dato in formData) {
      if (formData[dato] !== "") {
        switch(dato) {
          case "benzina":
            newFormData={
              "tipo": "outcome",
              "tipologia": "benzina",
              "descrizione": formData.descrizione,
              "importo": formData[dato]
            };
            break;
          case "casa":
            newFormData={
              "tipo": "outcome",
              "tipologia": "casa",
              "descrizione": formData.descrizione,
              "importo": formData[dato]
            };
            break;
          case "extra":
            newFormData={
              "tipo": "outcome",
              "tipologia": "extra",
              "descrizione": formData.descrizione,
              "importo": formData[dato]
            };
            break;
          case "salute":
            newFormData={
              "tipo": "outcome",
              "tipologia": "salute",
              "descrizione": formData.descrizione,
              "importo": formData[dato]
            };
            break;
            case "spesa":
              newFormData={
                "tipo": "outcome",
                "tipologia": "spesa",
                "descrizione": formData.descrizione,
                "importo": formData[dato]
              };
            break;
            case "income":
              newFormData={
                "tipo": "income",
                "descrizione": formData.descrizione,
                "importo": parseFloat(formData[dato])
              }
            break;
          default:
            break;
        }
      }
    }
    modificaDati(newFormData, rowId)
    setEditingRow(null);
  }

  return (
    <tbody>
    {datas && datas.map(data => (
      <tr key={data.id}>
        <td
          style={{display: columnsToHide[0].visible ? 'table-cell' : 'none'}}>
          <div className={style.deleteAndDateCell}>
            <button
            style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
            onClick={() => rimuoviDati(data.id)}
            >
              <i className="bi-trash"></i>
            </button>
            <button
            style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
            onClick={() => handleToggleEdit(data.id)}
            >
            {editingRow === data.id ? <i className="bi-x-circle"></i> : <i className="bi-pen"></i>}
            </button>
            { editingRow === data.id &&
            <button
            style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
            onClick={(e) => handleSave(data.id)}
            >
              <i className="bi-floppy"></i>
            </button>            
            }
            <span>
              {format(data.data, 'MMM', {locale: it})}
            </span>
          </div>
        </td>
        {editingRow === data.id ?
          <>
                <td style={{ display: columnsToHide[1].visible ? 'table-cell' : 'none' }}>
                  <input
                    type="text"
                    name="descrizione"
                    value={formData.descrizione}
                    onChange={handleChange}
                  />
                </td>
                <td style={{ display: columnsToHide[2].visible ? 'table-cell' : 'none' }}>
                {data.Spesa &&
                  <input
                    type="number"
                    name="spesa"
                    value={formData.spesa}
                    onChange={handleChange}
                  />
                }
                </td>
                <td style={{ display: columnsToHide[3].visible ? 'table-cell' : 'none' }}>
                {data.Income &&
                  <input
                    type="number"
                    name="income"
                    value={formData.income}
                    onChange={handleChange}
                  />
                }
                </td>
                <td style={{ display: columnsToHide[4].visible ? 'table-cell' : 'none' }}>
                {data.Benzina &&
                  <input
                    type="number"
                    name="benzina"
                    value={formData.benzina}
                    onChange={handleChange}
                  />
                }
                </td>
                <td style={{ display: columnsToHide[5].visible ? 'table-cell' : 'none' }}>
                {data.Extra &&
                  <input
                    type="number"
                    name="extra"
                    value={formData.extra}
                    onChange={handleChange}
                  />
                }
                </td>
                <td style={{ display: columnsToHide[6].visible ? 'table-cell' : 'none' }}>
                {data.Casa &&
                  <input
                    type="number"
                    name="casa"
                    value={formData.casa}
                    onChange={handleChange}
                  />
                }
                </td>
                <td style={{ display: columnsToHide[7].visible ? 'table-cell' : 'none' }}>
                {data.Salute &&
                  <input
                    type="number"
                    name="salute"
                    value={formData.salute}
                    onChange={handleChange}
                  />
                }
                </td>
          </>
          :
          <>
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
          </>
        }
      </tr>
    ))}
    </tbody>
  )
}