import { useEffect, useState, useMemo } from 'react';
import { useData } from '../../dataContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { format, getMonth, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function GraficoCucito() {
  const { datas } = useData();
  const [datiFiltrati, setDatiFiltrati] = useState([]);

  useEffect(() => {
    const newDatas = datas.filter(
      (dato) => dato.cucito_in !== null || dato.cucito_out !== null
    );
    setDatiFiltrati(newDatas);
  }, [datas]);

  const chartData = useMemo(() => {
    const monthlyData = {};

    datiFiltrati.forEach((dato) => {
      const date = parseISO(dato.data);
      const month = getMonth(date);
      const monthName = format(date, 'MMMM', { locale: it });

      if (!monthlyData[month]) {
        monthlyData[month] = {
          name: monthName,
          in: 0,
          out: 0,
        };
      }

      if (dato.cucito_in !== null) {
        monthlyData[month].in += parseFloat(dato.cucito_in);
      }
      
      // MODIFICA QUI: Esclude il "girofondo" dai dati "out" del grafico
      if (dato.cucito_out !== null) {
        if (dato.descrizione !== 'girofondo') { // Se NON è un "girofondo", aggiungi a "out"
          monthlyData[month].out += parseFloat(dato.cucito_out);
        }
        // Se è un "girofondo", non facciamo nulla, lo escludiamo dall'out e non lo aggiungiamo all'in
      }
    });

    const sortedMonths = Object.keys(monthlyData)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map((monthKey) => monthlyData[parseInt(monthKey)]);

    const labels = sortedMonths.map((data) => data.name);
    const cucitoInValues = sortedMonths.map((data) => data.in);
    const cucitoOutValues = sortedMonths.map((data) => data.out);

    return {
      labels,
      datasets: [
        {
          label: 'Cucito in',
          data: cucitoInValues,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Cucito out (esclusi girofondi)', // Etichetta più chiara
          data: cucitoOutValues,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    };
  }, [datiFiltrati]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: 'Andamento Mensile Cucito',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('it-IT', {
                style: 'currency',
                currency: 'EUR',
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Mese',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Valore (€)',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: '100%', margin: '0 auto', height: "70vh" }}>
      {datiFiltrati.length > 0 && chartData.labels.length > 0 ? (
        <Bar data={chartData} options={options} height={500} />
      ) : (
        <p>Nessun dato cucito disponibile per il grafico.</p>
      )}
    </div>
  );
}