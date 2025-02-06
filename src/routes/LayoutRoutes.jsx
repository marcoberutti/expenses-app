import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import style from './layoutRoutes.module.css';
import { DataProvider, useData } from "../dataContext"; // Importa il DataProvider
import Login from "../components/Login";
import { useEffect } from "react";

export default function LayoutRoutes({ children }) {

  const { loginData, isLogged, setIsLogged } = useData();

  useEffect(() => {
    if (localStorage.getItem("Token") && !isLogged) {
      setIsLogged(true);
    }
  }, []);
  

  return (
    <DataProvider>
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
    </DataProvider>
  );
}