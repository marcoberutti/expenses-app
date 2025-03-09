import { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import CalendarModal from '../components/CalendarModal';
import { useData } from '../dataContext';
import {format} from 'date-fns'
import NewEventModal from '../components/NewEventModal';
import itLocale from '@fullcalendar/core/locales/it';

export default function Calendar() {
  const {eventi, inserisciEvento, fetchEvents, modificaEvento, } = useData();
  const calendarRef = useRef(null)

  useEffect(() => {
    if(eventi.length === 0){
      fetchEvents()
    }
  }, [])

  const [openModal, setOpenModal] = useState(false);
  const [openModalModifica, setOpenModalModifica] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventDrop = (info) => {
    const formattedDate = format(info.event.start, "yyyy-MM-dd HH:mm:ss");

    const updatedEvent = {
      title: info.event.title,
      start: formattedDate,
      color: info.event.backgroundColor
    };
  
    modificaEvento(updatedEvent, info.event.id)
  };

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setOpenModal(true);
  };

  const handleEventClick = (info) => {
    setSelectedEvent({
      id: info.event.id,
      title: info.event.title,
      start: info.event.startStr,
      color: info.event.backgroundColor || "#007bff"
    }); 
    setOpenModalModifica(true)
  }

  const addEvent = (eventName, selectedColor) => {
    
    if (!eventName || !selectedDate) return;
  
    let formattedStart = selectedDate.includes("T")
      ? selectedDate.replace("T", " ").substring(0, 19)
      : `${selectedDate} 00:00:00`;
  
    inserisciEvento(eventName, formattedStart,selectedColor);
  
    setOpenModal(false);
  };
  

  return (
    <div  style={{ height: "90vh", display: "flex", flexDirection: "column" }}>
      <FullCalendar
        ref={calendarRef}
        height="100%"
        locale={itLocale}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={eventi}
        editable={true}
        droppable={true}
        eventDrop={handleEventDrop}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false // Imposta a `false` per rimuovere "AM/PM"
        }} 
      />
      <CalendarModal open={openModal} handleClose={() => setOpenModal(false)} addEvent={addEvent} />
      {selectedEvent && (
      <NewEventModal
        open={openModalModifica}
        handleClose={() => setOpenModalModifica(false)}
        event={selectedEvent}
      />
      )}
    </div>
  );
}
