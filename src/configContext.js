import React, { createContext, useContext, useState, useEffect } from "react";
import { useSharedState } from "./sharedStateContext";

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {

  const { modal, setModal } = useSharedState();

  const [valoriOutcome, setValoriOutcome] = useState(["Spesa", "Benzina", "Extra", "Casa", "Salute","Investimenti", "tasse", "cucito_out"])
  const [valoriIncome, setValoriIncome] = useState(["Income", "cucito_in"])
  const colors = ["#FF5733", "#4287f5", "#00cc66", "#FFD700", "#8A2BE2", "#E91E63", "#FF9800", "#4CAF50"];
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 3,
  };
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "dark";
  });

  const [columnsToHide, setColumnsToHide] = useState([
    {nome: "Data", visible: true},
    {nome: "Descr.", visible: true},
    {nome: "Spesa", visible: true},
    {nome: "Entrate", visible: true},
    {nome: "Benzina", visible: true},
    {nome: "Extra", visible: true},
    {nome: "Casa", visible: true},
    {nome: "Salute", visible: true},
    {nome: "Investimenti", visible: true},
    {nome: "Tasse", visible: true},
  ]);

  const [formData, setFormData] = useState({
    descrizione: '',
    spesa: '',
    income: '',
    benzina: '',
    extra: '',
    casa: '',
    salute: '',
    data: '',
    investimenti: '',
    tasse:'',
    cucito_in:'',
    cucito_out:'',
  });
  
  const handleSetTheme = (e) => {
    setTheme(e.target.checked ? "dark" : "light")
  }

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]); 

  const handleToggleModals = () => {
    switch (modal) {
      case "modifica":
      setModal("normal")
      break
      case "form":
      setModal("normal")
      break
      case "normal":
      setModal("form")
      break
      default:
    }
  };

    const value = {
      valoriOutcome,
      valoriIncome,
      colors,
      style,
      columnsToHide,
      setColumnsToHide,
      handleSetTheme,
      theme,
      formData,
      setFormData,
      handleToggleModals,
    }
  
  
  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig deve essere usato dentro un DataProvider");
  }
  return context;
};