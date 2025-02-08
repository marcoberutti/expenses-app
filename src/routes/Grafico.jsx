import React, { useEffect, useReducer } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { useData } from "../dataContext";
import Loader from "../components/Loader";
import {dataReducer, initialState} from "../reducers/chartReducer";
import Intestazione from "../components/Intestazione";
import HomeForm from "../components/HomeForm";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Grafico() {
  const { datas, isLoading, fetchData, columnsToHide, handleToggleColumns, modal, handleToggleModals } = useData();
  const [state, dispatch] = useReducer(dataReducer, initialState);
  const { graficoData, options } = state;

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

  return (
    <div>
      {isLoading ? <Loader/> :
          <>
          <Intestazione
            title = "Grafico"
            columnsToHide = {columnsToHide}
            handleToggleModals = {handleToggleModals}
          />
          {modal === "normal" ? 
            <div style={{ width: "100%", margin: "0 auto", height: "60vh" }}>
              {graficoData?.labels.length > 0  ? (
                <Bar data={graficoData} options={options} />
              ) : 
                <Loader/>
              }
            </div>
          :
            <HomeForm/>
          }
          </>
      }
    </div>
  );
}
