import React, { useEffect, useReducer, useState } from "react"; // Importa useState
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement, // Importa ArcElement per il grafico a ciambella
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2"; // Importa Doughnut
import { useData } from "../dataContext";
import Loader from "../components/utils/Loader";
import { dataReducer, initialState } from "../reducers/chartReducer"; // Assicurati il percorso corretto
import Intestazione from '../components/utils/Intestazione.tsx'; // Assicurati il percorso corretto
import HomeForm from "../components/forms/HomeForm"; // Assicurati il percorso corretto
import { FormControlLabel, Checkbox, Box } from '@mui/material'; // Importa i componenti MUI

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement); // Registra ArcElement

export default function Grafico() {
  const { datas, isLoading, fetchData, columnsToHide, modal, handleToggleModals } = useData();
  const [state, dispatch] = useReducer(dataReducer, initialState);
  const { graficoData, doughnutChartData, barOptions, doughnutOptions } = state; // Destruttura doughnutChartData e le opzioni specifiche

  // Stato per il tipo di grafico selezionato ('bar' o 'doughnut')
  const [chartType, setChartType] = useState('pie');

  useEffect(() => {
    if (datas.length === 0) {
      fetchData();
    }
  }, [datas, fetchData]);

  useEffect(() => {
    if (datas.length > 0) {
      dispatch({ type: 'SET_DATI', payload: datas });
    }
  }, [datas]);

  // Gestori per i checkbox
  const handleBarChange = (event) => {
    if (event.target.checked) {
      setChartType('bar');
    }
  };

  const handleDoughnutChange = (event) => {
    if (event.target.checked) {
      setChartType('doughnut');
    }
  };

  return (
    <div>
      {isLoading ? <Loader /> :
        <>
          <Intestazione
            title="Grafico"
            columnsToHide={columnsToHide}
            handleToggleModals={handleToggleModals}
          />
          {modal === "normal" ?
            <Box sx={{ p: 2 }}> {/* Utilizza Box per un po' di padding */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}> {/* Spazio per i checkbox */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={chartType === 'pie'}
                      onChange={handleDoughnutChange}
                      name="chartTypeDoughnut"
                      color="primary"
                    />
                  }
                  label="Pie chart"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={chartType === 'bar'}
                      onChange={handleBarChange}
                      name="chartTypeBar"
                      color="primary"
                    />
                  }
                  label="Bar chart"
                />
              </Box>

              <div style={{ width: "100%", margin: "0 auto", height: "60vh" }}>
                {graficoData?.labels.length > 0 ? (
                  chartType === 'bar' ? (
                    <Bar data={graficoData} options={barOptions} /> // Usa barOptions
                  ) : (
                    // Assicurati che doughnutChartData esista e abbia dati
                    doughnutChartData?.labels.length > 0 ? (
                      <Doughnut data={doughnutChartData} options={doughnutOptions} /> // Usa doughnutOptions
                    ) : (
                      <p>Nessun dato disponibile per il grafico a ciambella.</p>
                    )
                  )
                ) :
                  <Loader />
                }
              </div>
            </Box>
            :
            <HomeForm />
          }
        </>
      }
    </div>
  );
}