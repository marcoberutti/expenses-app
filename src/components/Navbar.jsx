import { NavLink } from "react-router";
import style from "./navbar.module.css";
import { useData } from "../dataContext";
import { useEffect } from "react";
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Badge, { badgeClasses } from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Container from '@mui/material/Container';

export default function Navbar({isLogged}) {

  const { setModal, setIsLogged, handleSetTheme, theme, listaSpesa, fetchListSpesa } = useData();

  useEffect(() => {
    setModal("normal")    
    if (listaSpesa.length === 0) {
      fetchListSpesa();
    }
  }, []);

  function handleLogOut(){
    localStorage.removeItem("Token")
    setIsLogged(false);
    window.location.href = "/";
  }

  const CartBadge = styled(Badge)`
    & .${badgeClasses.badge} {
      top: -12px;
      right: -6px;
    }
  `;

  return (
    <AppBar position="static">
    <Container maxWidth="xl">
      <Toolbar disableGutters sx={{justifyContent: 'space-between', width: '100%'}}>
        { isLogged ?
        <>
          <NavLink className={({ isActive }) => isActive ? style.navlinkActive : style.navlink} to="/"><i className="bi bi-house"></i></NavLink>
          <NavLink className={({ isActive }) => isActive ? style.navlinkActive : style.navlink} to="/riepilogo"><i className="bi bi-table"></i></NavLink>
          <NavLink className={({ isActive }) => isActive ? style.navlinkActive : style.navlink} to="/grafico"><i className="bi bi-graph-up-arrow"></i></NavLink>
          <NavLink className={({ isActive }) => isActive ? style.navlinkActive : style.navlink} to="/lista_spesa">
            <IconButton>
              <ShoppingCartIcon fontSize="small" sx={{color:"white"}}/>
              <CartBadge badgeContent={listaSpesa && listaSpesa.length} color={theme === "dark" ? "primary" : "info"} overlap="circular" />
            </IconButton>
          </NavLink>
          <FormControl component="fieldset" style={{border:"2px solid gray", paddingLeft:"5px", borderRadius:"10px"}}>
            <FormGroup aria-label="position" row>
              <FormControlLabel
                value="end"
                label={theme === "dark" ? 
                <i className="bi bi-moon-stars" style={{fontSize:"1rem"}}></i> : 
                <i className="bi bi-brightness-high" style={{fontSize:"1rem"}}></i>
                }
                sx={{
                  "& .MuiFormControlLabel-label": { fontSize: "1.2rem"}, 
                  "marginRight": "5px"
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
          <NavLink className={style.navlink} onClick={handleLogOut}><i className="bi bi-person-x" style={{fontSize:"1.3rem"}}></i></NavLink>
        </>
        :
          <NavLink className={({ isActive }) => isActive ? style.navlinkActive : style.navlink} to="/">Login</NavLink>
        }
      </Toolbar>
      </Container>
    </AppBar>
  );
}