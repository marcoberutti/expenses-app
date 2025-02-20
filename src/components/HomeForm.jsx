import { useData } from '../dataContext';
import style from './HomeForm.module.css'

export default function HomeForm(setFormData){
  const { inserisciDati, handleRadioChange, select } = useData();
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
  
    const data = {
      tipo: formData.get('tipo'),
      descrizione: formData.get('descrizione'),
      importo: parseFloat(formData.get('importo')),
      tipologia: formData.get('tipologia'),
      data: formData.get('data')
    };
  
    inserisciDati(data)
  };
  

  return (
    <>

    <h1>Nuova spesa</h1>
    <div className={style.formContainer}>
      <form method="post" onSubmit={handleSubmit} className={style.form}>
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
          <input 
            type="text" 
            name="descrizione" 
            onChange={(e) => setFormData(prev => ({ ...prev, descrizione: e.target.value }))}
            id="descrizione"/>
        </div>
        <div className={style.inputContainer}>
          <label htmlFor="importo">Importo {select ? 'speso' : 'entrata'}</label>
          <input
            type="number" 
            name="importo" 
            id="importo" 
            step="0.01" 
            min="0"
            onChange={(e) => setFormData(prev => ({ ...prev, importo: e.target.value }))}
            />
        </div>
        <div>
          <label htmlFor="data">Data</label>
          <input 
            type="date" 
            name="data" 
            id="data" 
            value={today}
            onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
          />
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
          <button type="submit">Inserisci</button>
        </div>
      </form>
    </div>
    </>
  )
}