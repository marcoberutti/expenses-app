import { useEffect, useState } from 'react';
import { useData } from '../../dataContext';
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from '@mui/material/TableBody';
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { format, parse, getMonth, getYear, endOfMonth } from 'date-fns';
import style from './RiepilogoTable.module.css'

export default function RiepilogoTable() {

  const { datas, setModalRiepilogo, filterDataRiepilogo } = useData();
  const [incomeMese, setIncomePerMese] = useState({});
  const categories = ["Income", "Spesa", "Benzina", "Extra", "Casa", "Salute", "Investimenti", "tasse"];

  const averagePerCategory = {};

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

  function convertMonthNameToDate(monthName) {
    const year = getYear(new Date()); // Ottieni l'anno corrente
    const parsedDate = parse(monthName, 'MMM', new Date(year, 0)); // 'MMM' è il formato per i nomi dei mesi abbreviati
    const month = getMonth(parsedDate); // Ottieni il mese (0-11)
    const endMonth = endOfMonth(new Date(year, month))
    const beginMonth = new Date(year, month, 1, 0,0,0)
    return [endMonth, beginMonth]
  }

  
  categories.forEach(category => {
    let somma = 0;
    let mesiConValore = 0;

    for (let i = 0; i < 12; i++) {
      const mese = (i + 1).toString().padStart(2, '0');
      const filteredData = datas.filter(dato => format(new Date(dato.data), "MM") === mese);
      const valoreMese = filteredData.reduce((acc, curr) => acc + (parseInt(curr[category]) || 0), 0);

      if (valoreMese > 0) {
        somma += valoreMese;
        mesiConValore++;
      }
    }

    averagePerCategory[category] = mesiConValore > 0 ? Math.round(somma / mesiConValore) : 0;
  });

  const monthsWithData = Object.keys(incomeMese).filter(mese => incomeMese[mese] > 0).length;
  const averageYearBudgetBalance = monthsWithData > 0 ? parseInt(totalYearBudgetBalance / monthsWithData) : 0;

  function handleClick(e, cat){
    setModalRiepilogo(true)
    let mese = e.target.parentNode.firstChild.textContent
    let [fine, inizio] = convertMonthNameToDate(mese)
    filterDataRiepilogo(inizio, fine, cat)
  }

  return (
    <TableContainer component={Paper} sx={{ paddingBottom: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{px:1, py:0}}>Mese</TableCell>
            <TableCell align="center" sx={{px:1, py:0}}>Income</TableCell>
            <TableCell align="center" sx={{px:1, py:0}}>Spesa</TableCell>
            <TableCell align="center" sx={{px:1, py:0}}>Benzina</TableCell>
            <TableCell align="center" sx={{px:1, py:0}}>Extra</TableCell>
            <TableCell align="center" sx={{px:1, py:0}}>Casa</TableCell>
            <TableCell align="center" sx={{px:1, py:0}}>Salute</TableCell>
            <TableCell align="center" sx={{px:1, py:0}}>Invest</TableCell>
            <TableCell align="center" sx={{px:1, py:0}}>Tasse</TableCell>
            <TableCell align="center" sx={{px:1, py:0}}>Budget Rimasto</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
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
                <TableCell align="center" sx={{p:0, border:"1px solid #494949"}}>{format(new Date(2024, i, 1), "MMM")}</TableCell>
                {categories.map(cat => {
                  const value = parseInt(totals[cat]) || 0;
                  const isClickable = value > 0;

                  const getClassName = (category, val) => {
                    switch(category) {
                      case "Income":
                        return val < 1600 ? style.colorRed : style.colorGreen;
                      case "Spesa":
                        return val > 350 ? style.colorRed : style.colorGreen;
                      case "Benzina":
                        return val > 250 ? style.colorRed : style.colorGreen;
                      case "Extra":
                        return val > 400 ? style.colorRed : style.colorGreen;
                      case "Casa":
                        return val > 800 ? style.colorRed : style.colorGreen;
                      case "Salute":
                        return val > 200 ? style.colorRed : style.colorGreen;
                      case "Investimenti":
                        return style.colorBlue
                      case "tasse":
                        return val > 100 ? style.colorRed : style.colorGreen;
                      default:
                        return "";
                    }
                  }
                  
                  return (
                    <TableCell
                      align="center"
                      sx={{ p: 1, border:"1px solid #494949" }}
                      key={`${i}-${cat}`}
                      className={`${getClassName(cat, value)} ${isClickable ? style.cellaConValore : style.cellaSenzaValore}`}
                      onClick={isClickable ? (e) => handleClick(e, cat) : undefined}
                    >
                      {isClickable ? value : 0}
                    </TableCell>
                  );
                })}
                <TableCell align="center" sx={{p:0, border:"1px solid #494949"}} key={`${i}-totaleIncome`} className={
                  budgetMese > 200 ? 
                    style.highBudget : 
                    budgetMese < 200 && budgetMese > 0 ? 
                      style.lowBudget : 
                      budgetMese === 0 ? 
                        style.zeroBudget : 
                        budgetMese < 0 && style.underZeroBudget}>
                  {incomeMese?.[mese] !== 0 && (parseInt(budgetMese) || "")}
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell align="center" sx={{p:1, border:"1px solid #494949"}}>Gran tot:</TableCell>
            {["Income", "Spesa", "Benzina", "Extra", "Casa", "Salute", "Investimenti", "tasse"].map((category, index) => (
              <TableCell align="center" key={`total-${index}`} sx={{p:1, border:"1px solid #494949"}}>
                {datas && datas
                  .filter(dato => dato[category] !== null)
                  .reduce((acc, curr) => acc + (parseInt(curr[category]) || 0), 0)}
              </TableCell>
            ))}
            <TableCell align="center" sx={{p:1, border:"1px solid #494949"}} className={          
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
          <TableRow>
            <TableCell align="center" sx={{ p:1, border:"1px solid #494949" }}>Media:</TableCell>
            {categories.map((category, index) => (
              <TableCell align="center" key={`average-${index}`} sx={{ p:1, border:"1px solid #494949" }}>
                {averagePerCategory[category]}
              </TableCell>
            ))}
            <TableCell align="center" sx={{ p:1, border:"1px solid #494949" }}
              className={
                averageYearBudgetBalance > 1500 ? 
                  style.highBudget : 
                  averageYearBudgetBalance > 0 ? 
                    style.lowBudget : 
                    averageYearBudgetBalance === 0 ? 
                      style.zeroBudget : 
                      style.underZeroBudget
              }
            >
              {averageYearBudgetBalance}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}