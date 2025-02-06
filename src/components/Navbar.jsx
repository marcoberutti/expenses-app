import { NavLink, useLocation } from "react-router";
import style from "./navbar.module.css";
import { useData } from "../dataContext";
import { useEffect } from "react";

export default function Navbar({isLogged}) {

  const { setModal, setIsLogged } = useData();
  const location = useLocation();

  useEffect(() => {
    setModal(false)
  }, [location]);

  function handleLogOut(){
    localStorage.removeItem("Token")
    setIsLogged(false);
    window.location.href = "/";
  }

  return (
    <nav className={style.navbar}>
      <ul>
        { isLogged ?
        <>
          <NavLink className={({ isActive }) => isActive ? style.navlinkActive : style.navlink} to="/">Home</NavLink>
          <NavLink className={({ isActive }) => isActive ? style.navlinkActive : style.navlink} to="/riepilogo">Riepilogo</NavLink>
          <NavLink className={({ isActive }) => isActive ? style.navlinkActive : style.navlink} to="/grafico">Grafico</NavLink>
          <NavLink className={style.navlink} onClick={handleLogOut}>Log out</NavLink>
        </>
        :
          <NavLink className={({ isActive }) => isActive ? style.navlinkActive : style.navlink} to="/">Login</NavLink>
        }
      </ul>
    </nav>
  );
}