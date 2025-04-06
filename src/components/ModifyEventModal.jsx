import { useState, useEffect } from "react";
import { Box, Button, Typography, Modal, TextField, IconButton } from "@mui/material";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import "dayjs/locale/it"; // Import Italian locale
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import { useData } from "../dataContext";
import { format } from "date-fns";

// Extend dayjs with UTC plugin
dayjs.extend(utc);
dayjs.locale('it'); // Set Italian locale

export default function ModifyEventModal({ open, event }) {
  const { setOpenModalModifica, colors, style, modificaEvento } = useData();
  
  // Initialize state with null values and update them when event changes
  const [eventName, setEventName] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [date, setDate] = useState(null);
  
  // Update state when event data changes
  useEffect(() => {
    if (event) {
      setEventName(event.title || "");
      setSelectedColor(event.color || colors[0]);
      setDate(dayjs(event.start));
      console.log("Event loaded:", event);
    }
  }, [event, colors]);
  
  const handleSubmit = () => {
    if (event && eventName.trim() !== "" && date) {
      // Use the selected date from state, not the original event date
      const formattedDate = format(date.toDate(), "yyyy-MM-dd HH:mm:ss");
      
      const updatedEvent = {
        title: eventName,
        start: formattedDate,
        color: selectedColor
      };
      
      console.log("Updating event:", updatedEvent);
      modificaEvento(updatedEvent, event.id);
      handleClose();
    } else {
      console.error("Cannot update event: missing required data", { event, eventName, date });
    }
  };
  
  const handleClose = () => {
    setOpenModalModifica(false);
  };
  
  const handleDateChange = (newDate) => {
    console.log("Date changed:", newDate);
    setDate(dayjs(newDate));
  };
  
  // If event is not defined, don't render
  if (!event) return null;
  
  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title">
      <Box sx={style}>
        <div style={{display:"flex", justifyContent:"space-between"}}>
          <Typography id="modal-modal-title" variant="h6">
            Modifica evento
          </Typography>
          <button onClick={()=> handleClose()} style={{fontSize:"2rem", color:"white", backgroundColor:"transparent", border:"none", cursor:"pointer"}}>
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
          Salva
        </Button>
      </Box>
    </Modal>
  );
}