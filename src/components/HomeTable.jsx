import style from './HomeTable.module.css'
import { useData } from '../dataContext'
import HomeTableTbody from './HomeTableTbody'
import { useEffect, useState } from 'react'
import { format, getYear } from 'date-fns'
import { it } from 'date-fns/locale'

export default function HomeTable({generateHeaders}) {

  const { datas } = useData()
  const [filteredDatas, setFilteredDatas] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Mese attuale
  const thisYear = getYear(new Date());
  const [editingRow, setEditingRow] = useState(null)

  useEffect(() => {
    filterDataByMonth(selectedMonth);
  }, [datas, selectedMonth]); 

  function filterDataByMonth(month) {
    const startOfMonth = new Date(thisYear, month, 1).getTime();
    const endOfMonth = new Date(thisYear, month + 1, 1).getTime();

    const newDatas = datas.filter(dato => {
      const dataDate = new Date(dato.data).getTime(); // Converte dato.data in Date
      return dataDate >= startOfMonth && dataDate < endOfMonth;
    });

    setFilteredDatas(newDatas);
  }


  function handleChangeMonth(e) {
    setSelectedMonth(parseInt(e.target.value));
  }

  return (
    <>
    <div className={style.monthSelectContainer}>
      <select onChange={handleChangeMonth} value={selectedMonth}>
        {Array.from({ length: 12 }, (_, i) => (
          <option key={i} value={i}>
            {format(new Date(thisYear,i, 1), "MMMM",{locale: it})}
          </option>
        ))}
      </select>
    </div>

    <table className={`${style.table} ${editingRow ? style.tableWithInput : ''}`}>
    <thead>
          <tr>
            {generateHeaders}
          </tr>
        </thead>
        <HomeTableTbody
          editingRow={editingRow}
          setEditingRow={setEditingRow}
          datas={filteredDatas}
        />
      </table>
    </>
  )
}