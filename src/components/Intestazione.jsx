import style from "./Intestazione.module.css"
import { useData } from "../dataContext";

export default function Intestazione({title, columnsToHide, handleToggleColumns}){
  const {modal, message, handleToggleModals} = useData();

  return (

    <div className={style.intestazione}>
      <h3>{title}</h3>
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
        <div><button className={modal !== "normal" ? style.exit : style.enter} onClick={handleToggleModals}>{modal !== "normal" ? "x" : "+"}</button></div>
    </div>
  )
}