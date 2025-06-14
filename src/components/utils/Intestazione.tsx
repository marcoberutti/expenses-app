import style from "./Intestazione.module.css"
import "bootstrap-icons/font/bootstrap-icons.css";
import Message from "./Message";
import { useConfig } from "../../configContext";
import { useData } from "../../dataContext";
import CustomButton from "./CustomButton.tsx";

type Props = {
  title: string
}

export default function Intestazione({title}: Props){
  const { handleToggleModals } = useConfig();
  const {modal } = useData();

  return (

    <div className={style.intestazione}>
      <h3 className={style.titoloIntestazione}>{title}</h3>
      <Message/>
      <CustomButton icon={modal === "normal" ? "bi bi-plus-circle-fill" : "bi bi-dash-circle-fill"} onClick={handleToggleModals}/>
    </div>
  )
}