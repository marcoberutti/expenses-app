import { useEffect, useState } from 'react';
import { useData } from '../dataContext';
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from '@mui/material/TableBody';
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { format } from 'date-fns';
import style from './RiepilogoTable.module.css'

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

  const totalYearBudgetBalance = Object.keys(incomeMese).reduce((total, mese) => {
    const totalExpenses = ["Spesa", "Benzina", "Extra", "Casa", "Salute"].reduce((sum, category) => {
      return sum + (datas
        .filter(dato => format(new Date(dato.data), "MM") === mese)
        .reduce((acc, curr) => acc + (parseFloat(curr[category]) || 0), 0));
    }, 0);
    return total + ((incomeMese[mese] || 0) - totalExpenses);
    }, 0)

  return (
    <TableContainer component={Paper} sx={{ paddingBottom: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Mese</TableCell>
            <TableCell>Tot Income</TableCell>
            <TableCell>Tot Spesa</TableCell>
            <TableCell>Tot Benzina</TableCell>
            <TableCell>Tot Extra</TableCell>
            <TableCell>Tot Casa</TableCell>
            <TableCell>Tot Salute</TableCell>
            <TableCell>Budget Rimasto</TableCell>
          </TableRow>
        </TableHead>
        <TableBody
          sx={{p:10}}
        >
          {datas && Array.from({ length: 12 }, (_, i) => {
            const mese = (i + 1).toString().padStart(2, '0');
            const filteredData = datas.filter(dato => format(dato.data, 'MM') === mese);

            let categories = ["Income", "Spesa", "Benzina", "Extra", "Casa", "Salute"];

            const totals = categories.reduce((acc, category) => {
              acc[category] = filteredData.reduce((sum, item) =>
                sum + (parseFloat(item[category]) || 0), 0);
              return acc;
            }, {});

            const totalExpenses = ["Spesa", "Benzina", "Extra", "Casa", "Salute"].reduce((sum, category) => {
              return sum + (totals[category] || 0);
            }, 0);

            const budgetMese = (incomeMese?.[mese] || 0) - totalExpenses;

            return (
              <TableRow key={i}>
                <TableCell>{format(new Date(2024, i, 1), "MMM")}</TableCell>
                {categories.map(cat => <TableCell key={`${i}-${cat}`}>{totals[cat]}</TableCell>)}
                <TableCell key={`${i}-totaleIncome`} className={
                  budgetMese > 200 ? 
                    style.highBudget : 
                    budgetMese < 200 && budgetMese > 0 ? 
                      style.lowBudget : 
                      budgetMese === 0 ? 
                        style.zeroBudget : 
                        budgetMese < 0 && style.underZeroBudget}>
                  {incomeMese?.[mese] !== 0 && (budgetMese || 0)}
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell>Gran tot:</TableCell>
            {["Income", "Spesa", "Benzina", "Extra", "Casa", "Salute"].map((category, index) => (
              <TableCell key={`total-${index}`}>
                {datas && datas
                  .filter(dato => dato[category] !== null)
                  .reduce((acc, curr) => acc + (parseFloat(curr[category]) || 0), 0)}
              </TableCell>
            ))}
            <TableCell className={                
              totalYearBudgetBalance > 1800 ? 
                style.highBudget : 
                totalYearBudgetBalance < 1800 && totalYearBudgetBalance > 0 ? 
                  style.lowBudget : 
                  totalYearBudgetBalance === 0 ? 
                    style.zeroBudget : 
                    totalYearBudgetBalance < 0 && style.underZeroBudget}>
            {totalYearBudgetBalance}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
