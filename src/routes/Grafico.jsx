import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { format } from "date-fns";
import { it } from 'date-fns/locale';

// Registriamo i componenti di Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Grafico({ riepilogo }) {
  // 🔹 Estrarre i nomi dei mesi e i valori da riepilogo
  const mesi = riepilogo.map(item => format(item.mese, 'MMMM', { locale: it })); 
  const income = riepilogo.map(item => item.totIncome);
  const spesa = riepilogo.map(item => item.totSpesa);
  const benzina = riepilogo.map(item => item.totBenzina);
  const extra = riepilogo.map(item => item.totExtra);
  const casa = riepilogo.map(item => item.totCasa);
  const salute = riepilogo.map(item => item.totSalute);

  // 🔹 Configurazione dei dati per Chart.js
  const data = {
    labels: mesi,
    datasets: [
      {
        label: "Income",
        data: income,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Spesa",
        data: spesa,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
      {
        label: "Benzina",
        data: benzina,
        backgroundColor: "rgba(255, 206, 86, 0.6)",
      },
      {
        label: "Extra",
        data: extra,
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
      {
        label: "Casa",
        data: casa,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Salute",
        data: salute,
        backgroundColor: "rgba(255, 159, 64, 0.6)",
      },
    ],
  };

  // 🔹 Opzioni di configurazione
  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Riepilogo Spese e Entrate Mensili" },
    },
  };

  return (
    <div style={{ width: "80%", margin: "0 auto" }}>
      <h1>Grafico</h1>
      <Bar data={data} options={options} />
    </div>
  );
}
