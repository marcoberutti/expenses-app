import { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import NewEventModal from '../components/calendar/NewEventModal';
import { useData } from '../dataContext';
import { format } from 'date-fns';
import ModifyEventModal from '../components/calendar/ModifyEventModal';
import itLocale from '@fullcalendar/core/locales/it';
import { useEvent } from '../eventsContext';

export default function Calendar() {
  const { eventi, fetchEvents, modificaEvento, openModal, setOpenModal, openModalModifica, setOpenModalModifica } = useEvent();
  const calendarRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  useEffect(() => {
    if (eventi.length === 0) {
      fetchEvents();
    }
  }, []);
  
  
  const handleEventDrop = (info) => {
    const formattedDate = format(info.event.start, "yyyy-MM-dd HH:mm:ss");
    
    const updatedEvent = {
      title: info.event.title,
      start: formattedDate,
      color: info.event.backgroundColor
    };
    
    modificaEvento(updatedEvent, info.event.id);
  };
  
  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setOpenModal(true);
  };
  
  const handleEventClick = (info) => {
    const eventData = {
      id: info.event.id,
      title: info.event.title,
      start: info.event.startStr,
      color: info.event.backgroundColor || "#007bff"
    };
    
    setSelectedEvent(eventData);
    setOpenModalModifica(true);
  };
  
  // Reset selectedEvent when modal closes
  useEffect(() => {
    if (!openModalModifica) {
    }
  }, [openModalModifica]);
  
  return (
    <div style={{ height: "90vh", display: "flex", flexDirection: "column" }}>
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
      <NewEventModal open={openModal} selectedDate={selectedDate} />
      {selectedEvent && (
        <ModifyEventModal
          open={openModalModifica}
          event={selectedEvent}
        />
      )}
    </div>
  );
}