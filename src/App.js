import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from "./dataContext"; // Importa il DataProvider
import LayoutRoutes from './routes/LayoutRoutes';
import Riepilogo from './routes/Riepilogo';
import Grafico from './routes/Grafico';
import Home from './routes/Home';

function App() {

  return (
    <DataProvider>
      <BrowserRouter>
          <LayoutRoutes>
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/riepilogo" element={<Riepilogo />} />
                  <Route path="/grafico" element={<Grafico />} />
              </Routes>
          </LayoutRoutes>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
