import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LayoutRoutes from './routes/LayoutRoutes';
import Riepilogo from './routes/Riepilogo';
import Grafico from './routes/Grafico';
import Home from './routes/Home';
import ListaSpesa from './routes/ListaSpesa';
import Calendar from './routes/Calendar';
import Cucito from './routes/Cucito';

function App() {

  return (
      <BrowserRouter>
          <LayoutRoutes>
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/riepilogo" element={<Riepilogo />} />
                  <Route path="/grafico" element={<Grafico />} />
                  <Route path="/page_cucito" element={<Cucito />} />
                  <Route path="/lista_spesa" element={<ListaSpesa />} />
                  <Route path="/calendar" element={<Calendar />} />
              </Routes>
          </LayoutRoutes>
      </BrowserRouter>
  );
}

export default App;
