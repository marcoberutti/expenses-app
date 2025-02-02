import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { format } from "date-fns";
import LayoutRoutes from './routes/LayoutRoutes';
import Riepilogo from './routes/Riepilogo';
import Grafico from './routes/Grafico';
import Home from './routes/Home';
import API_URL from './config';
import './App.css';

function App() {
  // 🔹 Stato per i dati ricevuti dall'API
  const [datas, setDatas] = useState([]);

  // 🔹 Fetch dei dati una sola volta all'inizio
  useEffect(() => {
    fetch(`${API_URL}/dati`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_API_KEY
      }
    })
    .then(res => res.json())
    .then(data => setDatas(data));
  }, []);

  // 🔹 Creiamo il riepilogo in base ai dati
  const riepilogo = Array.from({ length: 12 }, (_, i) => {
    const filteredData = datas.filter(dato => format(new Date(dato.data), 'MM') === (i + 1).toString().padStart(2, '0'));

    return {
      mese: (new Date(2024, i, 1)),
      totIncome: filteredData.reduce((acc, curr) => acc + (parseFloat(curr.Income) || 0), 0),
      totSpesa: filteredData.reduce((acc, curr) => acc + (parseFloat(curr.Spesa) || 0), 0),
      totBenzina: filteredData.reduce((acc, curr) => acc + (parseFloat(curr.Benzina) || 0), 0),
      totExtra: filteredData.reduce((acc, curr) => acc + (parseFloat(curr.Extra) || 0), 0),
      totCasa: filteredData.reduce((acc, curr) => acc + (parseFloat(curr.Casa) || 0), 0),
      totSalute: filteredData.reduce((acc, curr) => acc + (parseFloat(curr.Salute) || 0), 0),
    };
  });

  // 🔹 Passiamo riepilogo a Grafico
  const router = createBrowserRouter([
    {
      path: '/',
      element: <LayoutRoutes/>,
      children: [
        { path: '/', element: <Home/> },
        { path: '/riepilogo', element: <Riepilogo datas={datas} /> },
        { path: '/grafico', element: <Grafico riepilogo={riepilogo} /> } // Passiamo riepilogo qui
      ]
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
