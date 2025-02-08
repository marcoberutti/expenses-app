import { format } from 'date-fns';
import { useData } from '../dataContext';
import style from './HomeForm.module.css'
import { useEffect, useState } from 'react';

export default function HomeFormModifica({setFormData, rowId}){
  const { modificaDati, handleRadioChange, datasForUpdate, select } = useData();
  const [selectDefaultVal, setSelectDefVal] = useState();

  useEffect(() => {
    const excludeKeys = ["id", "descrizione", "data"];
    const filteredEntriesForSelect = Object.entries(datasForUpdate).filter(([key])=> !excludeKeys.includes(key))

    if(filteredEntriesForSelect.length === 1){
      const singleValue = filteredEntriesForSelect[0][0];
      setSelectDefVal(singleValue.toLowerCase())
    }
  }, []);

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
  
    modificaDati(data, datasForUpdate.id)
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "tipologia"){
      setSelectDefVal(value)
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  

  return (
    <>
    <h1>Modifica spesa</h1>
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
            onChange={handleInputChange}
            id="descrizione"
            defaultValue={datasForUpdate.descrizione || ""}
            />
        </div>
        <div className={style.inputContainer}>
          <label htmlFor="importo">Importo</label>
          <input 
            type="number" 
            name="importo" 
            id="importo" 
            step="0.01" 
            onChange={handleInputChange}
            min="0"
            defaultValue={
              datasForUpdate.Benzina ||
              datasForUpdate.Casa ||
              datasForUpdate.Extra ||
              datasForUpdate.Income ||
              datasForUpdate.Salute ||
              datasForUpdate.Spesa
            }
            />
        </div>
        <div>
          <label htmlFor="data">Data</label>
          <input 
            type="date" 
            name="data" 
            id="data" 
            onChange={handleInputChange}
            defaultValue={format(datasForUpdate.data, "yyyy-MM-dd")}/>
        </div>
        <div className={style.inputContainerSelect}>
          {!datasForUpdate.Income &&
          <>
            <label htmlFor="tipologia">Tipologia</label>
            <select 
              name="tipologia" 
              onChange={handleInputChange}
              value={selectDefaultVal}
            >
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