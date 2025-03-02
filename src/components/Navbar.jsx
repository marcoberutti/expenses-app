import { NavLink } from "react-router";
import style from "./navbar.module.css";
import { useData } from "../dataContext";
import { useEffect } from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Container from '@mui/material/Container';

export default function Navbar({isLogged}) {

  const { setModal, setIsLogged, handleSetTheme, theme } = useData();

  useEffect(() => {
    setModal("normal")
  }, []);

  function handleLogOut(){
    localStorage.removeItem("Token")
    setIsLogged(false);
    window.location.href = "/";
  }

  return (
    <AppBar position="static">
    <Container maxWidth="xl">
      <Toolbar disableGutters sx={{justifyContent: 'space-evenly', width: '100%'}}>
        { isLogged ?
        <>
          <NavLink className={({ isActive }) => isActive ? style.navlinkActive : style.navlink} to="/">Home</NavLink>
          <NavLink className={({ isActive }) => isActive ? style.navlinkActive : style.navlink} to="/riepilogo">Riepilogo</NavLink>
          <NavLink className={({ isActive }) => isActive ? style.navlinkActive : style.navlink} to="/grafico">Grafico</NavLink>
          <FormControl component="fieldset">
            <FormGroup aria-label="position" row>
              <FormControlLabel
                value="end"
                label={theme}
                sx={{
                  "& .MuiFormControlLabel-label": { fontSize: "1.2rem" } // Aumenta la dimensione del testo della label
                }}
                labelPlacement="end"
                control={
                <Switch 
                  checked={theme === "dark"}
                  color="primary" 
                  onChange={handleSetTheme}
                />}
              />
            </FormGroup>
          </FormControl>
          <NavLink className={style.navlink} onClick={handleLogOut}>Log out</NavLink>
        </>
        :
          <NavLink className={({ isActive }) => isActive ? style.navlinkActive : style.navlink} to="/">Login</NavLink>
        }
      </Toolbar>
      </Container>
    </AppBar>
  );
}