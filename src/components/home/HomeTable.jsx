import { useState, useEffect } from "react";
import { 
  Paper, TableContainer, Table, TableHead, TableBody, TableCell, TableRow,
  Card, CardContent, Typography, Grid, Box, Chip, 
  Accordion, AccordionSummary, AccordionDetails
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SummarizeIcon from '@mui/icons-material/Summarize';
import "bootstrap-icons/font/bootstrap-icons.css";
import MonthSelect from "../utils/MonthSelect";
import { format } from "date-fns";
import { it } from 'date-fns/locale';
import { formatCurrency } from "../../utils";
import { useData } from "../../dataContext";
// Icone per categorie
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import HomeIcon from '@mui/icons-material/Home';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ReceiptIcon from '@mui/icons-material/Receipt';
import styles from "./HomeTable.module.css";

export default function HomeTable() {
  const { setSelect, getDataForUpdateForm, setModal } = useData();
  const [filteredDatas, setFilteredDatas] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    topCategory: '',
  });
  const [expanded, setExpanded] = useState(false);

  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };

  // Calcola il riepilogo mensile quando i dati filtrati cambiano
  useEffect(() => {
    if (filteredDatas.length > 0) {
      const totalIncome = filteredDatas.reduce((sum, data) => sum + (parseFloat(data.Income || 0)), 0);
      
      const expenses = filteredDatas.reduce((sum, data) => {
        return sum + 
          parseFloat(data.Spesa || 0) + 
          parseFloat(data.Benzina || 0) + 
          parseFloat(data.Extra || 0) + 
          parseFloat(data.Casa || 0) + 
          parseFloat(data.Salute || 0) + 
          parseFloat(data.tasse || 0);
      }, 0);
      
      // Trova la categoria con la spesa maggiore
      const categories = {
        Spesa: filteredDatas.reduce((sum, d) => sum + parseFloat(d.Spesa || 0), 0),
        Benzina: filteredDatas.reduce((sum, d) => sum + parseFloat(d.Benzina || 0), 0),
        Extra: filteredDatas.reduce((sum, d) => sum + parseFloat(d.Extra || 0), 0),
        Casa: filteredDatas.reduce((sum, d) => sum + parseFloat(d.Casa || 0), 0),
        Salute: filteredDatas.reduce((sum, d) => sum + parseFloat(d.Salute || 0), 0),
        Investimenti: filteredDatas.reduce((sum, d) => sum + parseFloat(d.Investimenti || 0), 0),
      };
      
      const topCategory = Object.entries(categories)
        .filter(([_, value]) => value > 0)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || '';
      
      setMonthlySummary({
        totalIncome,
        totalExpenses: expenses,
        balance: totalIncome - expenses,
        topCategory
      });
    }
  }, [filteredDatas]);

  // Helper function per ottenere l'icona corretta per ogni categoria
  const getCategoryIcon = (data) => {
    if (data.Income) return <AttachMoneyIcon className={styles.incomeIcon} />;
    if (data.Spesa) return <ShoppingCartIcon className={styles.expenseIcon} />;
    if (data.Benzina) return <DirectionsCarIcon className={styles.expenseIcon} />;
    if (data.Extra) return <CardGiftcardIcon className={styles.expenseIcon} />;
    if (data.Casa) return <HomeIcon className={styles.expenseIcon} />;
    if (data.Salute) return <LocalHospitalIcon className={styles.expenseIcon} />;
    if (data.Investimenti) return <TrendingUpIcon className={styles.investmentIcon} />;
    if (data.tasse) return <ReceiptIcon className={styles.expenseIcon} />;
    return null;
  };

  // Helper function per ottenere l'importo
  const getAmount = (data) => {
    if (data.Income) return data.Income;
    if (data.Spesa) return data.Spesa;
    if (data.Benzina) return data.Benzina;
    if (data.Extra) return data.Extra;
    if (data.Casa) return data.Casa;
    if (data.Salute) return data.Salute;
    if (data.Investimenti) return data.Investimenti;
    if (data.tasse) return data.tasse;
    return null;
  };

  // Helper function per determinare il colore del testo
  const getAmountColor = (data) => {
    if (data.Income || data.Investimenti) {
      return styles.incomeAmount;
    }
    if (data.Spesa || data.Benzina || data.Extra || data.Casa || data.Salute || data.tasse) {
      return styles.expenseAmount;
    }
    return '';
  };

  return (
    <div className={styles.homeContainer}>
      <MonthSelect setFilteredDatas={setFilteredDatas} cucito={false} />
      
      {filteredDatas.length > 0 && (
        <Accordion 
          expanded={expanded} 
          onChange={handleAccordionChange}
          className={styles.summaryAccordion}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="summary-content"
            id="summary-header"
            className={styles.accordionSummary}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SummarizeIcon sx={{ mr: 1 }} />
              <Typography className={styles.accordionTitle}>
                Riepilogo del mese - Bilancio: {formatCurrency(monthlySummary.balance)}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails className={styles.accordionDetails}>
            <Grid container spacing={2} className={styles.cardGrid}>
              <Grid item xs={12} md={4}>
                <Card className={styles.summaryCard}>
                  <CardContent>
                    <Typography variant="h6" component="div" className={styles.cardTitle}>
                      Entrate
                    </Typography>
                    <Typography variant="h5" className={styles.incomeText}>
                      {formatCurrency(monthlySummary.totalIncome)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card className={styles.summaryCard}>
                  <CardContent>
                    <Typography variant="h6" component="div" className={styles.cardTitle}>
                      Uscite
                    </Typography>
                    <Typography variant="h5" className={styles.expenseText}>
                      {formatCurrency(monthlySummary.totalExpenses)}
                    </Typography>
                    {monthlySummary.topCategory && (
                      <Chip 
                        label={`Top: ${monthlySummary.topCategory}`}
                        size="small"
                        className={styles.topCategoryChip}
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card className={`${styles.summaryCard} ${monthlySummary.balance >= 0 ? styles.positiveBalance : styles.negativeBalance}`}>
                  <CardContent>
                    <Typography variant="h6" component="div" className={styles.cardTitle}>
                      Bilancio
                    </Typography>
                    <Typography variant="h5" className={monthlySummary.balance >= 0 ? styles.positiveText : styles.negativeText}>
                      {formatCurrency(monthlySummary.balance)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}
      
      <Paper elevation={3} className={styles.tableContainer}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow className={styles.tableHeader}>
                <TableCell align="center">Data</TableCell>
                <TableCell align="left">Descrizione</TableCell>
                <TableCell align="right">Importo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDatas.length > 0 ? (
                filteredDatas.map((data) => (
                  <TableRow
                    key={data.id}
                    className={styles.tableRow}
                    onClick={() => {
                      if (data.Income || data.cucito_in) {
                        setSelect("income");
                      } else {
                        setSelect("outcome");
                      }
                      getDataForUpdateForm(data);
                      setModal("modifica");
                    }}
                  >
                    <TableCell align="center" className={`${styles.dateCell}`}>
                      {data.data && (
                        <Box className={styles.dateBox}>
                          <Typography variant="caption" component="div" className={`${styles.dateDay}`}>
                            {format(data.data, "d", { locale: it })}
                          </Typography>
                          <Typography variant="caption" component="div" className={`${styles.dateMonth}`}>
                            {format(data.data, "MMM", { locale: it })}
                          </Typography>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell align="left" className={`${styles.descriptionCell} ${getAmountColor(data)}`}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box className={styles.iconContainer}>
                          {getCategoryIcon(data)}
                        </Box>
                        <Typography className={getAmountColor(data)}>{data.descrizione}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell
                      align="right"
                      className={`${styles.amountCell} ${getAmountColor(data)}`}
                    >
                      {formatCurrency(getAmount(data))}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center" className={styles.emptyMessage}>
                    <Typography variant="body1">Nessun dato per il mese selezionato</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}