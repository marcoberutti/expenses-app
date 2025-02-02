import { useEffect, useState } from "react";
import { format, setDefaultOptions } from "date-fns";
import { it } from 'date-fns/locale';
import style from './riepilogo.module.css';
import API_URL from "../config";

export default function Riepilogo() {
  const [datas, setDatas] = useState([]);
  setDefaultOptions({ locale: it });

  useEffect(() => {
    fetch(`${API_URL}/dati`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_API_KEY
      }
    })
    .then(res => res.json())
    .then(data => {
      setDatas(data)
    })
  }, []);

  return (
    <div>
      <h1>Riepilogo</h1>
      <table className={style.table}>
        <thead>
          <tr>
            <th>Mese</th>
            <th>Tot Income</th>
            <th>Tot Spesa</th>
            <th>Tot Benzina</th>
            <th>Tot Extra</th>
            <th>Tot Casa</th>
            <th>Tot Salute</th>
          </tr>
        </thead>
        <tbody>
          {datas && Array.from({ length: 12 }, (_, i) => {
            const filteredData = datas.filter(dato => format(dato.data, 'MM') === (i + 1).toString().padStart(2, '0'));
            const totalIncome = filteredData
              .filter(item => item.Income !== null && item.Income !== undefined)
              .reduce((acc, curr) => parseFloat(acc) + parseFloat(curr.Income), 0);
            const totalSpesa = filteredData
              .filter(item => item.Spesa !== null && item.Spesa !== undefined)
              .reduce((acc, curr) => parseFloat(acc) + parseFloat(curr.Spesa), 0);
            const totalBenzina = filteredData
              .filter(item => item.Benzina !== null && item.Benzina !== undefined)
              .reduce((acc, curr) => parseFloat(acc) + parseFloat(curr.Benzina), 0);
            const totalExtra = filteredData
              .filter(item => item.Extra !== null && item.Extra !== undefined)
              .reduce((acc, curr) => parseFloat(acc) + parseFloat(curr.Extra), 0);
            const totalCasa = filteredData
              .filter(item => item.Casa !== null && item.Casa !== undefined)
              .reduce((acc, curr) => parseFloat(acc) + parseFloat(curr.Casa), 0);
            const totalSalute = filteredData
              .filter(item => item.Salute !== null && item.Salute !== undefined)
              .reduce((acc, curr) => parseFloat(acc) + parseFloat(curr.Salute), 0);
            return (
              <tr key={i}>
                <td>{format(new Date(2024, i, 1), 'MMMM')}</td>
                <td>{totalIncome || 0}</td>
                <td>{totalSpesa || 0}</td>
                <td>{totalBenzina || 0}</td>
                <td>{totalExtra || 0}</td>
                <td>{totalCasa || 0}</td>
                <td>{totalSalute || 0}</td>
              </tr>
            );
          })}
          <tr>
            <td>Gran total:</td>
            <td>
            {datas && datas
              .filter(dato => dato.Income !== null)
              .reduce((acc, curr) => parseFloat(acc) + parseFloat(curr.Income), 0)
            }
            </td>
            <td>
            {datas && datas
              .filter(dato => dato.Spesa !== null)
              .reduce((acc, curr) => parseFloat(acc) + parseFloat(curr.Spesa), 0)
            }
            </td>
            <td>
            {datas && datas
              .filter(dato => dato.Benzina !== null)
              .reduce((acc, curr) => parseFloat(acc) + parseFloat(curr.Benzina), 0)
            }
            </td>
            <td>
            {datas && datas
              .filter(dato => dato.Extra !== null)
              .reduce((acc, curr) => parseFloat(acc) + parseFloat(curr.Extra), 0)
            }
            </td>
            <td>
            {datas && datas
              .filter(dato => dato.Casa !== null)
              .reduce((acc, curr) => parseFloat(acc) + parseFloat(curr.Casa), 0)
            }
            </td>
            <td>
            {datas && datas
              .filter(dato => dato.Salute !== null)
              .reduce((acc, curr) => parseFloat(acc) + parseFloat(curr.Salute), 0)
            }
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}