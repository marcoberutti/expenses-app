import style from './HomeForm.module.css'

export default function HomeForm({inserisciDati,handleRadioChange, select, now}){
  return (
    <div className={style.formContainer}>
      <form method="post" onSubmit={(e) => inserisciDati(e)} className={style.form}>
        <div>
          <label htmlFor="spesa">uscita</label>
          <input type="radio" name="tipo" id="spesa" value="outcome"
            onChange={handleRadioChange}
            checked={select === true}
          />
        </div>
        <div>
        <label htmlFor="income">entrata</label>
        <input type="radio" name="tipo" id="income" value="entrata"
          onChange={handleRadioChange}
          checked={select === false}
        />
        </div>
        <div className={style.inputContainer}>
        <label htmlFor="descrizione">Descrizione</label>
        <input type="text" name="descrizione" id="descrizione"/>
        </div>
        <div className={style.inputContainer}>
        <label htmlFor="importo">Importo {select ? 'speso' : 'entrata'}</label>
        <input type="number" name="importo" id="importo"/>
        </div>
        <div className={style.inputContainerSelect}>
          {select &&
          <>
            <label htmlFor="tipologia">Tipologia</label>
            <select name="tipologia" id="">
              <option value="spesa">Spesa</option>
              <option value="benzina">Benzina</option>
              <option value="extra">Extra</option>
              <option value="casa">Casa</option>
              <option value="salute">Salute</option>
            </select>
          </>
          }
        </div>
        <div>
          <input type="text" name="data" hidden value={now} readOnly/>
          <button type="submit">Inserisci</button>
        </div>
      </form>
    </div>
  )
}