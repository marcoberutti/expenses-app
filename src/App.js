import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from "./dataContext"; // Importa il DataProvider
import LayoutRoutes from './routes/LayoutRoutes';
import Riepilogo from './routes/Riepilogo';
import Grafico from './routes/Grafico';
import Home from './routes/Home';
import ListaSpesa from './routes/ListaSpesa';

function App() {

  return (
    <DataProvider>
      <BrowserRouter>
          <LayoutRoutes>
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/riepilogo" element={<Riepilogo />} />
                  <Route path="/grafico" element={<Grafico />} />
                  <Route path="/lista_spesa" element={<ListaSpesa />} />
              </Routes>
          </LayoutRoutes>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
