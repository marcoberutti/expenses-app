import style from "./Intestazione.module.css"
import "bootstrap-icons/font/bootstrap-icons.css";
import { useData } from "../dataContext";

export default function Intestazione({title, columnsToHide, handleToggleColumns}){
  const {modal, message, handleToggleModals} = useData();

  return (

    <div className={style.intestazione}>
      <h3 className={style.titoloIntestazione}>{title}</h3>
      {message !== '' && <h4 className={style.successAlert}>{message}</h4> }
      {columnsToHide && columnsToHide.map(column =>
        column.visible === false ? 
            <div key={column.nome}>
              <span>
                <input 
                type="checkbox"
                checked={column.visible}
                onChange={(e)=> handleToggleColumns(e)}
                />
                <span>{column.nome}</span>
              </span>
            </div>
        : null
      )}
      <button 
        onClick={handleToggleModals}
        className={style.iconButton}
      >
        {modal !== "normal" ? 
          <span className={style.iconCircle}>
            <i className="bi bi-x"></i>
          </span> : 
          <span className={style.iconCircle}>
            <i className="bi bi-plus"></i>
          </span>
        }
      </button>
    </div>
  )
}