import { useState } from "react";
import { Box, Button, Typography, Modal, TextField, IconButton } from "@mui/material";

// Stile del modal
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

// Array di colori disponibili
const colors = ["#FF5733", "#4287f5", "#00cc66", "#FFD700", "#8A2BE2", "#E91E63", "#FF9800", "#4CAF50"];

export default function CalendarModal({ open, handleClose, addEvent }) {
  const [eventName, setEventName] = useState("");
  const [selectedColor, setSelectedColor] = useState(colors[0]); // Colore di default

  const handleSubmit = () => {
    if (eventName.trim() !== "") {
      addEvent(eventName, selectedColor);
      setEventName("");
      setSelectedColor(colors[0]);
      handleClose();
    }
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title">
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6">
          Nuovo evento
        </Typography>
        <TextField
          fullWidth
          label="Nome evento"
          variant="outlined"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          sx={{ mt: 2 }}
        />

        {/* Color Picker con pallini */}
        <Typography variant="body1" sx={{ mt: 2 }}>
          Seleziona un colore:
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          {colors.map((color) => (
            <IconButton
              key={color}
              onClick={() => setSelectedColor(color)}
              sx={{
                width: 30,
                height: 30,
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
