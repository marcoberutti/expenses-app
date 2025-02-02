import style from './HomeTable.module.css'
import format from 'date-fns/format'

export default function HomeTable({generateHeaders, datas, columnsToHide, handleDeleteData}) {
  return (
    <table className={style.table}>
    <thead>
      <tr>
        {generateHeaders}
      </tr>
    </thead>
    <tbody>
    {datas && datas.map(data => (
      <tr key={data.id}>
        <td
          style={{display: columnsToHide[0].visible ? 'table-cell' : 'none'}}>
          <div className={style.deleteAndDateCell}>
            <button
            style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
            onClick={() => handleDeleteData(data.id)}
            >
              <i className="bi-trash"></i>
            </button>
            <span>
              {format(data.data, 'MMM')}
            </span>
          </div>
        </td>
        <td
          style={{display: columnsToHide[1].visible ? 'table-cell' : 'none'}}>
          {data.descrizione}</td>
        <td
          style={{display: columnsToHide[2].visible ? 'table-cell' : 'none'}}>
          {data.Spesa} {data.Spesa !== null && '€'}</td>
        <td
          style={{display: columnsToHide[3].visible ? 'table-cell' : 'none'}}>
          {data.Income} {data.Income !== null && '€'}</td>
        <td
          style={{display: columnsToHide[4].visible ? 'table-cell' : 'none'}}>
          {data.Benzina} {data.Benzina !== null && '€'}</td>
        <td
          style={{display: columnsToHide[5].visible ? 'table-cell' : 'none'}}>
          {data.Extra} {data.Extra !== null && '€'}</td>
        <td
          style={{display: columnsToHide[6].visible ? 'table-cell' : 'none'}}>
          {data.Casa} {data.Casa !== null && '€'}</td>
        <td
          style={{display: columnsToHide[7].visible ? 'table-cell' : 'none'}}>
          {data.Salute} {data.Salute !== null && '€'}</td>
      </tr>
    ))}
    </tbody>
  </table>
  )
}