import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import style from './layoutRoutes.module.css';

export default function LayoutRoutes() {
  return (
    <div className={style.mainContainer}>
      <Navbar />
      <div className={style.outlet}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}