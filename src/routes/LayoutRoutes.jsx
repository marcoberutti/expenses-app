import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import style from './layoutRoutes.module.css';
import { useData } from "../dataContext"; // Importa il DataProvider
import Login from "../components/Login";
import { useEffect, useMemo } from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export default function LayoutRoutes({ children }) {

  const { loginData, isLogged, setIsLogged, theme } = useData();

  useEffect(() => {
    if (localStorage.getItem("Token") && !isLogged) {
      setIsLogged(true);
    }
  }, []);

  const darkTheme = useMemo(() =>
    createTheme({
        palette: {
            mode: theme,
        },
    }), [theme]
  );

  return (
      <ThemeProvider theme={darkTheme} key={theme}>
      <CssBaseline />
        <Navbar isLogged={isLogged}/>
        { isLogged ? 
            <div className={style.mainContainer}>
              <div className={style.outlet}>
                {children}
              </div>
              <Footer />
            </div>
            :
            <Login handleLogin={loginData}/>
        }
      </ThemeProvider>
  );
}