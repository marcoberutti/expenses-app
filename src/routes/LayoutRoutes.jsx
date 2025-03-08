import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import style from './layoutRoutes.module.css';
import { useData } from "../dataContext";
import Login from "../components/Login";
import { useEffect, useMemo, useState } from "react"; // Add useState
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export default function LayoutRoutes({ children }) {
  const { loginData, isLogged, setIsLogged, theme } = useData();
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  
  useEffect(() => {
    // Check for token
    const token = localStorage.getItem("Token");
    if (token && !isLogged) {
      setIsLogged(true);
    }
    // Set loading to false after checking
    setIsLoading(false);
  }, []);
  
  const darkTheme = useMemo(() =>
    createTheme({
      palette: {
        mode: theme,
      },
    }), [theme]
  );
  
  // Show nothing (or a loader) while checking authentication
  if (isLoading) {
    return null; // Or return a loading spinner component
  }
  
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