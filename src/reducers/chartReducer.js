import { getYear } from 'date-fns';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

const initialState = {
  riepilogo: [],
  graficoData: { 
    labels: [], 
    datasets: [] 
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { 
        display: true, 
        text: "Riepilogo Spese e Entrate Mensili" 
      },
    },
  },
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_DATI': {
      const newRiepilogo = action.payload.reduce((acc, dato) => {
        const month = format(new Date(dato.data), "MM");
        const existingMonth = acc.find((r) => r.mese === month);

        if (existingMonth) {
          existingMonth.totIncome += parseFloat(dato.Income) || 0;
          existingMonth.totSpesa += parseFloat(dato.Spesa) || 0;
          existingMonth.totBenzina += parseFloat(dato.Benzina) || 0;
          existingMonth.totExtra += parseFloat(dato.Extra) || 0;
          existingMonth.totCasa += parseFloat(dato.Casa) || 0;
          existingMonth.totSalute += parseFloat(dato.Salute) || 0;
        } else {
          acc.push({
            mese: month,
            totIncome: parseFloat(dato.Income) || 0,
            totSpesa: parseFloat(dato.Spesa) || 0,
            totBenzina: parseFloat(dato.Benzina) || 0,
            totExtra: parseFloat(dato.Extra) || 0,
            totCasa: parseFloat(dato.Casa) || 0,
            totSalute: parseFloat(dato.Salute) || 0,
          });
        }
        return acc;
      }, []);

      const mesi = [];
      for (let i = 0; i < 12; i++) {
        mesi.push(format(new Date(getYear(new Date()), i), 'MMMM', { locale: it }));
      }

      const income = newRiepilogo.map(item => item.totIncome);
      const spesa = newRiepilogo.map(item => item.totSpesa);
      const benzina = newRiepilogo.map(item => item.totBenzina);
      const extra = newRiepilogo.map(item => item.totExtra);
      const casa = newRiepilogo.map(item => item.totCasa);
      const salute = newRiepilogo.map(item => item.totSalute);

      const graficoData = {
        labels: mesi,
        datasets: [
          { label: "Income", data: income, backgroundColor: "rgb(4, 255, 0)" },
          { label: "Spesa", data: spesa, backgroundColor: "rgba(255, 99, 132, 0.6)" },
          { label: "Benzina", data: benzina, backgroundColor: "rgba(255, 206, 86, 0.6)" },
          { label: "Extra", data: extra, backgroundColor: "rgba(153, 102, 255, 0.6)" },
          { label: "Casa", data: casa, backgroundColor: "rgba(54, 162, 235, 0.6)" },
          { label: "Salute", data: salute, backgroundColor: "rgba(255, 159, 64, 0.6)" },
        ],
      };

      return {
        ...state,
        riepilogo: newRiepilogo,
        graficoData,
      };
    }
    default:
      return state;
  }
};

export { initialState, dataReducer };