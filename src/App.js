import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LayoutRoutes from './routes/LayoutRoutes';
import Riepilogo from './routes/Riepilogo';
import Grafico from './routes/Grafico';
import Home from './routes/Home';
import './App.css';
import { Route, Routes } from 'react-router';
import { useData } from './dataContext';

function App() {

  const { datas, isLoading, fetchData, riepilogo } = useData();

  const router = createBrowserRouter([
    {
      path: "*",
      element: (
        <LayoutRoutes datas={datas} isLoading={isLoading} refreshData={fetchData} riepilogo={riepilogo}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/riepilogo" element={<Riepilogo />} />
            <Route path="/grafico" element={<Grafico />} />
          </Routes>
        </LayoutRoutes>
      )
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
