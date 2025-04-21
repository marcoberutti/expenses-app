import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useData } from "../dataContext";
import Login from "../components/utils/Login";
import { useEffect, useMemo, useState } from "react"; // Add useState
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useConfig } from "../configContext";
import { SpesaProvider } from "../spesaContext";
import { EventProvider } from "../eventsContext";
import Loader from "../components/utils/Loader";

export default function LayoutRoutes({ children }) {
  const { loginData, isLogged, setIsLogged } = useData();
  const { theme } = useConfig();
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  
  useEffect(() => {
    const token = localStorage.getItem("Token");
    if (token && !isLogged) {
      setIsLogged(true);
    }
    setIsLoading(false);
  }, []);
  
  const darkTheme = useMemo(() =>
    createTheme({
      palette: {
        mode: theme,
      },
    }), [theme]
  );
  
  if (isLoading) {
    return <Loader/>
  }
  
  return (
    <SpesaProvider>
      <EventProvider>
        <ThemeProvider theme={darkTheme} key={theme}>
          <CssBaseline />
            <Navbar />
            { isLogged ?
                <>
                  {children}
                  <Footer />
                </>
              :
              <Login handleLogin={loginData}/>
            }
        </ThemeProvider>
      </EventProvider>
    </SpesaProvider>
  );
}