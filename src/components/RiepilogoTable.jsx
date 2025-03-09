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
        const valore = parseInt(item.Income) || 0;
        incomeMese[mese] += valore;
      }
    }
    setIncomePerMese(incomeMese);
  }, [datas]);

  const totalYearBudgetBalance = Object.keys(incomeMese).reduce((total, mese) => {
    const totalExpenses = ["Spesa", "Benzina", "Extra", "Casa", "Salute", "Investimenti", "tasse"].reduce((sum, category) => {
      return sum + (datas
        .filter(dato => format(new Date(dato.data), "MM") === mese)
        .reduce((acc, curr) => acc + (parseInt(curr[category]) || 0), 0));
    }, 0);
    return total + ((incomeMese[mese] || 0) - totalExpenses);
    }, 0)

  return (
    <TableContainer component={Paper} sx={{ paddingBottom: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{p:1}}>Mese</TableCell>
            <TableCell align="center" sx={{p:1}}>Tot Income</TableCell>
            <TableCell align="center" sx={{p:1}}>Tot Spesa</TableCell>
            <TableCell align="center" sx={{p:1}}>Tot Benzina</TableCell>
            <TableCell align="center" sx={{p:1}}>Tot Extra</TableCell>
            <TableCell align="center" sx={{p:1}}>Tot Casa</TableCell>
            <TableCell align="center" sx={{p:1}}>Tot Salute</TableCell>
            <TableCell align="center" sx={{p:1}}>Tot Invest</TableCell>
            <TableCell align="center" sx={{p:1}}>Tot Tasse</TableCell>
            <TableCell align="center" sx={{p:1}}>Budget Rimasto</TableCell>
          </TableRow>
        </TableHead>
        <TableBody
        >
          {datas && Array.from({ length: 12 }, (_, i) => {
            const mese = (i + 1).toString().padStart(2, '0');
            const filteredData = datas.filter(dato => format(dato.data, 'MM') === mese);

            let categories = ["Income", "Spesa", "Benzina", "Extra", "Casa", "Salute", "Investimenti", "tasse"];

            const totals = categories.reduce((acc, category) => {
              acc[category] = filteredData.reduce((sum, item) =>
                sum + (parseInt(item[category]) || 0), 0);
              return acc;
            }, {});

            const totalExpenses = ["Spesa", "Benzina", "Extra", "Casa", "Salute", "Investimenti", "tasse"].reduce((sum, category) => {
              return sum + (totals[category] || 0);
            }, 0);

            const budgetMese = (incomeMese?.[mese] || 0) - totalExpenses;

            return (
              <TableRow key={i}>
                <TableCell align="center" sx={{p:0}}>{format(new Date(2024, i, 1), "MMM")}</TableCell>
                {categories.map(cat => <TableCell align="center" sx={{p:1}} key={`${i}-${cat}`}>{totals[cat] && parseInt(totals[cat])}</TableCell>)}
                <TableCell align="center" sx={{p:0}} key={`${i}-totaleIncome`} className={
                  budgetMese > 200 ? 
                    style.highBudget : 
                    budgetMese < 200 && budgetMese > 0 ? 
                      style.lowBudget : 
                      budgetMese === 0 ? 
                        style.zeroBudget : 
                        budgetMese < 0 && style.underZeroBudget}>
                  {incomeMese?.[mese] !== 0 && (parseInt(budgetMese) || 0)}
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell align="center" sx={{p:0}}>Gran tot:</TableCell>
            {["Income", "Spesa", "Benzina", "Extra", "Casa", "Salute", "Investimenti", "tasse"].map((category, index) => (
              <TableCell align="center" key={`total-${index}`} sx={{p:0}}>
                {datas && datas
                  .filter(dato => dato[category] !== null)
                  .reduce((acc, curr) => acc + (parseInt(curr[category]) || 0), 0)}
              </TableCell>
            ))}
            <TableCell align="center" sx={{p:0}} className={                
              totalYearBudgetBalance > 1800 ? 
                style.highBudget : 
                totalYearBudgetBalance < 1800 && totalYearBudgetBalance > 0 ? 
                  style.lowBudget : 
                  totalYearBudgetBalance === 0 ? 
                    style.zeroBudget : 
                    totalYearBudgetBalance < 0 && style.underZeroBudget}>
            {parseInt(totalYearBudgetBalance)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
