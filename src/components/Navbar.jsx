import { NavLink } from "react-router";
import style from "./navbar.module.css";

export default function Navbar() {
  return (
    <nav className={style.navbar}>
      <ul>
        <NavLink className={style.navlink} to="/">Home</NavLink>
        <NavLink className={style.navlink} to="/riepilogo">Riepilogo</NavLink>
        <NavLink className={style.navlink} to="/grafico">Grafico</NavLink>
      </ul>
    </nav>
  );
}