import style from "./Intestazione.module.css"
import { Button } from '@mui/material'
import "bootstrap-icons/font/bootstrap-icons.css";
import Message from "./Message";
import { useConfig } from "../../configContext";
import { useData } from "../../dataContext";

export default function Intestazione({title}){
  const { handleToggleModals } = useConfig();
  const {modal } = useData();

  return (

    <div className={style.intestazione}>
      <h3 className={style.titoloIntestazione}>{title}</h3>
      <Message/>
      <Button
        variant="contained"
        onClick={handleToggleModals}
        sx={{
          backgroundColor: "gray !important",
          fontWeight: modal === "normal" ? "normal" : "bold",
          padding: "2px",
          minWidth: "fit-content",
          lineHeight: "1.1",
          borderRadius: "50%",
          width: "2rem",
          height: "2rem",
          fontSize: modal === "normal" ? "2rem" : "1rem",
        }}
      >
        {modal === "normal" ? "+" : "x"}
      </Button>
    </div>
  )
}