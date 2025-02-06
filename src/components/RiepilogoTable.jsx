import { useEffect, useState } from 'react';
import { useData } from '../dataContext';
import style from './RiepilogoTable.module.css';
import { format } from 'date-fns';

export default function RiepilogoTable() {

  const { datas } = useData();
  const [incomeMese, setIncomePerMese] = useState({});

  useEffect(() => {
    const incomeMese = {}; 

    for (let i = 1; i <= 12; i++) {
      const mese = i.toString().padStart(2, "0");
      incomeMese[mese] = 0;
    }

    for (const item of datas) {
      if (item.Income) {
        const mese = format(new Date(item.data), "MM");
        const valore = parseFloat(item.Income) || 0;
        incomeMese[mese] += valore;
      }
    }

    setIncomePerMese(incomeMese);
  }, [datas]);

  return (
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
          <th>Budget Rimasto</th>
        </tr>
      </thead>
      <tbody>
        {datas && Array.from({ length: 12 }, (_, i) => {
          const mese = (i + 1).toString().padStart(2, '0');
          const filteredData = datas.filter(dato => format(dato.data, 'MM') === mese);

          let categories = ["Income", "Spesa", "Benzina", "Extra", "Casa", "Salute"];

          const totals = categories.reduce((acc, category) => {
            acc[category] = filteredData.reduce((sum, item) =>
              sum + (parseFloat(item[category]) || 0), 0);
            return acc;
          }, {});

          // Calcolare la somma delle spese
          const totalExpenses = ["Spesa", "Benzina", "Extra", "Casa", "Salute"].reduce((sum, category) => {
            return sum + (totals[category] || 0);
          }, 0);

          // Sottrarre le spese dall'Income per ottenere il Budget Mese
          const budgetMese = (incomeMese?.[mese] || 0) - totalExpenses;

          return (
            <tr key={i}>
              <td>{format(new Date(2024, i, 1), 'MMMM')}</td>
              {categories.map(cat => <td key={`${i}-${cat}`}>{totals[cat]}</td>)}
              <td key={`${i}-totaleIncome`} className={budgetMese < 200 && budgetMese > 0 ? style.lowBudget : ""}>
                {incomeMese?.[mese] !== 0 && (budgetMese || 0)}
              </td>
            </tr>
          );
        })}
        <tr>
          <td>Gran total:</td>
          {["Income", "Spesa", "Benzina", "Extra", "Casa", "Salute"].map((category, index) => (
            <td key={`total-${index}`}>
              {datas && datas
                .filter(dato => dato[category] !== null)
                .reduce((acc, curr) => acc + (parseFloat(curr[category]) || 0), 0)}
            </td>
          ))}
          <td>
            {Object.keys(incomeMese).reduce((total, mese) => {
              const totalExpenses = ["Spesa", "Benzina", "Extra", "Casa", "Salute"].reduce((sum, category) => {
                return sum + (datas
                  .filter(dato => format(new Date(dato.data), "MM") === mese)
                  .reduce((acc, curr) => acc + (parseFloat(curr[category]) || 0), 0));
              }, 0);
              return total + ((incomeMese[mese] || 0) - totalExpenses);
            }, 0)}
          </td>
        </tr>
      </tbody>

    </table>
  );
}
