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
      if (dato.cucito_out !== null) {
        monthlyData[month].out += parseFloat(dato.cucito_out);
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
          label: 'Cucito out',
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
    maintainAspectRatio: false, // Lascia questo a false per il controllo dell'altezza
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
    // Il div contenitore può avere una larghezza e un'altezza flessibile (es. 100% di larghezza)
    // Non gli diamo un'altezza fissa qui, lasciamo che sia il grafico a dettarla in base alla prop 'height'
    <div style={{ width: '100%', margin: '0 auto', height: "70vh" }}>
      {datiFiltrati.length > 0 && chartData.labels.length > 0 ? (
        // Imposta l'altezza fissa desiderata direttamente sul componente Bar
        // Chart.js userà questa altezza come "altezza desiderata" e la adatterà con responsive:true
        <Bar data={chartData} options={options} height={500} /> 
      ) : (
        <p>Nessun dato cucito disponibile per il grafico.</p>
      )}
    </div>
  );
}