import { useState, useEffect } from "react";
import { Box, Button, Typography, Modal, TextField, IconButton } from "@mui/material";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import "dayjs/locale/it"; // Import Italian locale
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import { useData } from "../../dataContext";

// Extend dayjs with necessary plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.locale('it'); // Set Italian locale globally

export default function NewEventModal({ open }) {
  const {setOpenModal, colors, style, inserisciEvento} = useData();
  
  const [eventName, setEventName] = useState("");
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [date, setDate] = useState(dayjs().tz("Europe/Rome")); // Initialize with Italian timezone
  
  // Reset date when modal opens
  useEffect(() => {
    if (open) {
      setDate(dayjs().tz("Europe/Rome"));
    }
  }, [open]);
  
  const handleSubmit = () => {
    if (eventName.trim() !== "" && date) {
      
      const formattedDate = date.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
      let formattedStart = formattedDate.includes("T")
      ? formattedDate.replace("T", " ").substring(0, 19)
      : `${formattedDate} 00:00:00`;
  
      inserisciEvento(eventName, formattedStart, selectedColor);
      handleClose();
    }
  };
  
  const handleClose = () => {
    setEventName("");
    setSelectedColor(colors[0]);
    setDate(dayjs().tz("Europe/Rome"));
    setOpenModal(false);
  };
  
  const handleDateChange = (newDate) => {
    // Ensure we're working with a proper Italian timezone date
    const italianDate = dayjs(newDate).tz("Europe/Rome");
    setDate(italianDate);
  };
  
  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title">
      <Box sx={style}>
        <div style={{display:"flex", justifyContent:"space-between"}}>
          <Typography id="modal-modal-title" variant="h6">
            Nuovo evento
          </Typography>
          <button onClick={handleClose} style={{fontSize:"2rem", color:"white", backgroundColor:"transparent", border:"none", cursor:"pointer"}}>
            <i className="bi bi-x"></i>
          </button>
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
            value={date}
            onChange={handleDateChange}
            ampm={false} // Use 24-hour format for Italy
            views={['hours', 'minutes']}
            ampmInClock={false}
            timeSteps={{ minutes: 5 }}
            sx={{ 
              '& .MuiPickersToolbar-root': { color: 'primary.main' },
              '& .MuiClock-pin': { backgroundColor: 'primary.main' },
              '& .MuiClockPointer-root': { backgroundColor: 'primary.main' },
              '& .MuiClockPointer-thumb': { backgroundColor: 'primary.main', borderColor: 'primary.main' },
              '& .MuiClock-clock': { backgroundColor: 'background.paper' }
            }}
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