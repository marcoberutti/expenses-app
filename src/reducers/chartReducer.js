import { getYear } from 'date-fns';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

// Funzione helper per parseare i valori float in modo sicuro
// Potrebbe essere utile avere questa funzione in un file di utilità condiviso
const safeParseFloat = (value) => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};

const initialState = {
  riepilogo: [],
  graficoData: {
    labels: [],
    datasets: [],
  },
  // Aggiungi un'opzione per il grafico Doughnut, se necessario, anche se molte opzioni Bar funzionano.
  // Le opzioni Doughnut sono più specifiche per il centro e l'allineamento della leggenda.
  doughnutOptions: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right", // O 'top', 'bottom', 'left'
      },
      title: {
        display: true,
        text: "Riepilogo Percentuale Spese Mensili",
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            if (context.parsed !== null) {
              const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
              const value = context.parsed;
              const percentage = ((value / total) * 100).toFixed(2) + '%';
              return `${label}: ${value}€ (${percentage})`;
            }
            return label;
          }
        }
      }
    },
  },
  barOptions: { // Rinominato per chiarezza
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Riepilogo Spese e Entrate Mensili",
      },
    },
    scales: { // Aggiungi le scale per il grafico a barre, non erano presenti nell'initialState
        x: {
            stacked: false, // Per barre non impilate, se vuoi impilate metti true
            title: {
                display: true,
                text: 'Mese',
            },
        },
        y: {
            stacked: false, // Per barre non impilate, se vuoi impilate metti true
            beginAtZero: true,
            title: {
                display: true,
                text: 'Valore (€)',
            },
        },
    },
  },
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_DATI': {
      const newRiepilogo = action.payload.reduce((acc, dato) => {
        // Usa parseISO per gestire correttamente le date ISO 8601
        const month = format(new Date(dato.data), "MM"); // Mese come stringa "01", "02", ecc.
        const existingMonth = acc.find((r) => r.mese === month);

        if (existingMonth) {
          existingMonth.totIncome += safeParseFloat(dato.Income);
          existingMonth.totSpesa += safeParseFloat(dato.Spesa);
          existingMonth.totBenzina += safeParseFloat(dato.Benzina);
          existingMonth.totExtra += safeParseFloat(dato.Extra);
          existingMonth.totCasa += safeParseFloat(dato.Casa);
          existingMonth.totSalute += safeParseFloat(dato.Salute);
          existingMonth.totInvest += safeParseFloat(dato.Investimenti);
          existingMonth.totTasse += safeParseFloat(dato.tasse);
        } else {
          acc.push({
            mese: month,
            totIncome: safeParseFloat(dato.Income),
            totSpesa: safeParseFloat(dato.Spesa),
            totBenzina: safeParseFloat(dato.Benzina),
            totExtra: safeParseFloat(dato.Extra),
            totCasa: safeParseFloat(dato.Casa),
            totSalute: safeParseFloat(dato.Salute),
            totInvest: safeParseFloat(dato.Investimenti),
            totTasse: safeParseFloat(dato.tasse),
          });
        }
        return acc;
      }, []);

      // Ordina il riepilogo per mese (numerico)
      newRiepilogo.sort((a, b) => parseInt(a.mese) - parseInt(b.mese));


      const mesiNomi = newRiepilogo.map(item => format(new Date(getYear(new Date()), parseInt(item.mese) - 1), 'MMMM', { locale: it }));
      const incomeValues = newRiepilogo.map(item => item.totIncome);
      const spesaValues = newRiepilogo.map(item => item.totSpesa);
      const benzinaValues = newRiepilogo.map(item => item.totBenzina);
      const extraValues = newRiepilogo.map(item => item.totExtra);
      const casaValues = newRiepilogo.map(item => item.totCasa);
      const saluteValues = newRiepilogo.map(item => item.totSalute);
      const investimentiValues = newRiepilogo.map(item => item.totInvest);
      const tasseValues = newRiepilogo.map(item => item.totTasse);

      // --- Dati per il grafico a barre ---
      const barChartData = {
        labels: mesiNomi,
        datasets: [
          { label: "Income", data: incomeValues, backgroundColor: "rgb(4, 255, 0)" },
          { label: "Spesa", data: spesaValues, backgroundColor: "rgba(255, 99, 132, 0.6)" },
          { label: "Benzina", data: benzinaValues, backgroundColor: "rgba(255, 206, 86, 0.6)" },
          { label: "Extra", data: extraValues, backgroundColor: "rgba(153, 102, 255, 0.6)" },
          { label: "Casa", data: casaValues, backgroundColor: "rgba(54, 162, 235, 0.6)" },
          { label: "Salute", data: saluteValues, backgroundColor: "rgba(255, 159, 64, 0.6)" },
          { label: "Investimenti", data: investimentiValues, backgroundColor: "rgba(7, 232, 86, 0.88)" },
          { label: "Tasse", data: tasseValues, backgroundColor: "rgba(236, 10, 10, 0.9)" },
        ],
      };

      // --- Dati per il grafico a ciambella (Doughnut) ---
      // Per il Doughnut, di solito si mostra la ripartizione di un totale (es. spese totali)
      // Per semplicità, calcoliamo i totali aggregati per TUTTI i mesi
      const totalSpeseCategories = newRiepilogo.reduce((totals, item) => {
        totals.Spesa += item.totSpesa;
        totals.Benzina += item.totBenzina;
        totals.Extra += item.totExtra;
        totals.Casa += item.totCasa;
        totals.Salute += item.totSalute;
        totals.Tasse += item.totTasse;
        // Se vuoi includere anche Income e Investimenti nel Doughnut, aggiungili qui
        return totals;
      }, { Spesa: 0, Benzina: 0, Extra: 0, Casa: 0, Salute: 0, Tasse: 0 });

      const doughnutChartData = {
        labels: Object.keys(totalSpeseCategories),
        datasets: [
          {
            label: "Spese per Categoria",
            data: Object.values(totalSpeseCategories),
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)", // Spesa
              "rgba(255, 206, 86, 0.6)", // Benzina
              "rgba(153, 102, 255, 0.6)", // Extra
              "rgba(54, 162, 235, 0.6)", // Casa
              "rgba(255, 159, 64, 0.6)", // Salute
              "rgba(236, 10, 10, 0.9)", // Tasse
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 159, 64, 1)",
              "rgba(236, 10, 10, 1)",
            ],
            borderWidth: 1,
          },
        ],
      };

      return {
        ...state,
        riepilogo: newRiepilogo,
        graficoData: barChartData, // Per default, il grafico a barre
        doughnutChartData: doughnutChartData, // Salva anche i dati per il Doughnut
      };
    }
    default:
      return state;
  }
};

export { initialState, dataReducer };