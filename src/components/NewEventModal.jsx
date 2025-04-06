import { useState } from "react";
import { Box, Button, Typography, Modal, TextField, IconButton } from "@mui/material";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import "dayjs/locale/it"; // Import Italian locale
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import { useData } from "../dataContext";

export default function CalendarModal({ open, addEvent }) {
  const {eventi, inserisciEvento, fetchEvents, modificaEvento, openModal, setOpenModal, colors, style} = useData();
  
  const [eventName, setEventName] = useState("");
  const [selectedColor, setSelectedColor] = useState(colors[0]); // Colore di default
  const [date, setDate] = useState(null); // Data di default
  
  const handleSubmit = () => {
    if (eventName.trim() !== "" && date) {
      const formattedDate = date.toISOString(); // Formatta la data come stringa ISO
      addEvent(eventName, formattedDate, selectedColor);
      setEventName("");
      setSelectedColor(colors[0]);
      setDate(null);
      setOpenModal(false);
    }
  };
  
  const handleClose = () => {
    setEventName("");
    setSelectedColor(colors[0]);
    setDate(null);
    setOpenModal(false);
  };
  
  const handleDateChange = (newDate) => {
    const data = dayjs(newDate).utc();
    setDate(data);
  };
  
  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title">
      <Box sx={style}>
        <div style={{display:"flex", justifyContent:"space-between"}}>
          <Typography id="modal-modal-title" variant="h6">
            Nuovo evento
          </Typography>
          <button onClick={()=> handleClose()} style={{fontSize:"2rem", color:"white", backgroundColor:"transparent", border:"none", cursor:"pointer"}}><i className="bi bi-x"></i></button>
        </div>
        <TextField
          fullWidth
          label="Nome evento"
          variant="outlined"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          sx={{ mt: 2 }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
          <StaticTimePicker
            onChange={handleDateChange}
            defaultValue={dayjs()}
            ampm={false} // Use 24-hour format for Italy
            views={['hours', 'minutes']}
            ampmInClock={false}
          />
        </LocalizationProvider>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Seleziona un colore:
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          {colors.map((color) => (
            <IconButton
              key={color}
              onClick={() => setSelectedColor(color)}
              sx={{
                width: 20,
                height: 20,
                bgcolor: color,
                border: selectedColor === color ? "2px solid white" : "none",
                transform: selectedColor === color ? "scale(1.5)" : "none",
                borderRadius: "50%",
              }}
            />
          ))}
        </Box>
        
        <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
          Aggiungi
        </Button>
      </Box>
    </Modal>
  );
}