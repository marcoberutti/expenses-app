import { useEffect, useState } from "react";
import { setDefaultOptions } from "date-fns";
import { it } from 'date-fns/locale';
import { useData } from "../dataContext";
import Loader from "../components/utils/Loader";
import Intestazione from '../components/utils/Intestazione'
import HomeForm from "../components/forms/HomeForm";
import RiepilogoTable from "../components/riepilogo/RiepilogoTable";
import style from './table.module.css'
import ModalRiepilogo from "../components/riepilogo/ModalRiepilogo";
import API_URL from "../config"
// Importa i componenti Material-UI necessari per la tabella
import { Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from "@mui/material"; 

export default function Riepilogo() {

  const { datas, isLoading, ottieniDati, modal, message, inserisciDati, handleRadioChange, select, now, handleToggleModals, modalRiepilogo } = useData();

  const [formData, setFormData] = useState({
    meseCorrente: new Date().toLocaleString('default', { month: 'long' }),
    marco: 0,
    sara: 0,
    cucito: 0,
  });
  const [modalMonthlyBalance, setModalMonthlyBalance] = useState(false);
  const [monthlyDatas, setMonthlyDatas] = useState([]); 
  
  useEffect(() => {
    if (datas.length === 0) {
      ottieniDati("expenses");
    }
  }, [datas, ottieniDati]);

  setDefaultOptions({ locale: it });

  function handleSubmit(e) {
    e.preventDefault();

    fetch(`${API_URL}/newMonthBalance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_API_KEY
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Dati inseriti:', data);
      })
      .catch((error) => {
        console.error('Errore durante l\'inserimento dei dati:', error);
      });
  }

  const fetchMonthlyBalance = async () => {
    try {
      const response = await fetch(`${API_URL}/getMonthBalance`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_API_KEY
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMonthlyDatas(data); 
      setModalMonthlyBalance(true);
    } catch (error) {
      console.error('Errore durante il recupero dei dati mensili:', error);
    }
  };


  return (
    <div>
      { isLoading ? <Loader/> :
        <>
          <Intestazione
            title = "Riepilogo annuo"
            message = {message}
            modal = {modal}
            handleToggleModals={handleToggleModals}
          />
          {modal === "normal" ? 
            <div className={style.tableRiepilogoContainer}>
              {modalRiepilogo === true ? <ModalRiepilogo/> : <RiepilogoTable/>}
            </div>
          :
            <HomeForm inserisciDati={inserisciDati} handleRadioChange={handleRadioChange} select={select} now={now}/>
          }
          {/* La modale del bilancio mensile */}
          {
            <Modal
              open={modalMonthlyBalance}
              onClose={() => setModalMonthlyBalance(false)}
              aria-labelledby="monthly-balance-modal-title"
              aria-describedby="monthly-balance-modal-description"
            >
              {/* Utilizza Box o Paper per il contenuto della modale per uno stile MUI */}
              <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: { xs: '95%', sm: '80%', md: '60%' }, // Aumentata la larghezza
                  maxHeight: '90vh', // Aumentata l'altezza massima
                  bgcolor: 'background.paper', // Usa il colore di sfondo del tema MUI
                  border: '2px solid #000',
                  boxShadow: 24,
                  p: 4, // Padding
                  borderRadius: '8px',
                  textAlign: 'center',
                  overflowY: 'auto' // Abilita lo scroll verticale se necessario
              }}>
                <h2 id="monthly-balance-modal-title" style={{ marginBottom: '15px' }}>Dettaglio Bilancio Mensile</h2>
                {monthlyDatas.length > 0 ? (
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 300 }} aria-label="monthly balance table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Mese</TableCell>
                          <TableCell align="right">Marco</TableCell>
                          <TableCell align="right">Sara</TableCell>
                          <TableCell align="right">Cucito</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {monthlyDatas.map((dato, index) => (
                          <TableRow
                            key={index} // Usa un ID univoco se disponibile, altrimenti index
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">
                              {dato.mese}
                            </TableCell>
                            <TableCell align="right">{dato.marco}</TableCell>
                            <TableCell align="right">{dato.sara}</TableCell>
                            <TableCell align="right">{dato.cucito}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <p>Nessun dato mensile disponibile.</p>
                )}
                <button 
                  onClick={() => setModalMonthlyBalance(false)}
                  style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#6c757d', // Grigio
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Chiudi
                </button>
              </Box>
            </Modal>
          }
        </>
      }
      <div>
        <h1>Riepilogo mensile</h1>
        <div style={{display:"flex",justifyContent:"center"}}>
          <button 
            onClick={fetchMonthlyBalance}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d', // Grigio
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginBottom: '20px',
            }}
            >
            Visualizza Bilancio Mensile
          </button>
        </div>
        <form style={{display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px", margin: "0 auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px"}}>
          <h2 style={{textAlign: "center", marginBottom: "15px"}}>Inserisci Nuovo Bilancio Mensile</h2>
          <div>
            <label htmlFor="marco" style={{display: "block", marginBottom: "5px"}}>Marco</label>
            <input 
              id="marco" 
              name="marco" 
              type="number"
              onChange={(e) => setFormData({...formData, marco: parseFloat(e.target.value) || 0})}
              style={{width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px"}}
            />
          </div>
          <div>
            <label htmlFor="sara" style={{display: "block", marginBottom: "5px"}}>Sara</label>
            <input 
              id="sara" 
              name="sara" 
              type="number" 
              onChange={(e) => setFormData({...formData, sara: parseFloat(e.target.value) || 0})} 
              style={{width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px"}}
            />
          </div>
          <div>
            <label htmlFor="cucito" style={{display: "block", marginBottom: "5px"}}>Cucito</label>
            <input 
              id="cucito" 
              name="cucito" 
              type="number" 
              onChange={(e) => setFormData({...formData, cucito: parseFloat(e.target.value) || 0})} 
              style={{width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px"}}
            />
          </div>
          <button 
            onClick={handleSubmit}
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              backgroundColor: '#6c757d', // Grigio
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Invia dati
          </button>
        </form>
      </div>
    </div>
  );
}
