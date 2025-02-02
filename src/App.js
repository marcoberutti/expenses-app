import { createBrowserRouter, RouterProvider } from 'react-router';
import LayoutRoutes from './routes/LayoutRoutes';
import Riepilogo from './routes/Riepilogo';
import Grafico from './routes/Grafico';
import Home from './routes/Home';
import './App.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutRoutes/>,
    children: [
      {
        path: '/',
        element: <Home/>
      },
      {
        path: '/riepilogo',
        element: <Riepilogo/>
      },
      {
        path: '/grafico',
        element: <Grafico/>
      }
    ]
  }
])

function App() {
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
