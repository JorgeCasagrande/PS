import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Modal,
  Box,
  TextField,
  Select,
  InputLabel,
  MenuItem,
  FormControl
} from '@mui/material';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale'; // Importa el localizador en español
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { events as initialEvents } from './data';
import { getAll, create, update, deleteModel } from './Api/apiRequest';

// Configura el localizador para español
const localizer = dateFnsLocalizer({
  formats: {
    dateFormat: 'dd/MM/yyyy',
    dayFormat: 'd',
    weekdayFormat: 'cccc',
    monthHeaderFormat: 'MMMM yyyy',
    dayHeaderFormat: 'dddd, d MMMM',
    dayRangeHeaderFormat: ({ start, end }, culture, local) =>
      `${local.format(start, 'd MMMM', culture)} — ${local.format(end, 'd MMMM', culture)}`,
  },
  firstDayOfWeek: 1,
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { es }
});

const RoomAssignmentManagement = () => {
  const [open, setOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [roomFilterId, setRoomFilterId] = useState(null);
  const [eventList, setEventList] = useState(initialEvents);
  const [eventListFilter, setEventListFilter] = useState(eventList);
  const [rooms, setRooms] = useState([]);
  const [roomsFilter, setRoomsFilter] = useState([]);
  const [newEvent, setNewEvent] = useState({
    id: 0,
    titulo: '',
    fecha_inicio: new Date(),
    fecha_fin: new Date(),
    sala_id: '',
    cantidad: 0,
    tipo_evento: ''
  });

  const entityVariable = "Asignacion_Salas";

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const response = await getAll(entityVariable); // Llama al endpoint para obtener los datos
        setEventList(response); // Guarda los datos en el estado
        setEventListFilter(response);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    const fetchRoomsEntities = async () => {
      try {
        const response = await getAll('Salas'); // Llama al endpoint para obtener los datos
        let roomDefault = { id: null, nombre: 'Todas', capacidad: 0 };
        setRooms(response); // Guarda los datos en el estado
        setRoomsFilter([roomDefault, ...response]);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchEntities(); // Llama a la función de obtención de datos
    fetchRoomsEntities();
  }, []); 

  const handleOpen = (event = null) => {
    if (event) {
      setCurrentEvent(event);
      setNewEvent({
        id: event.id,
        titulo: event.titulo,
        fecha_inicio: event.fecha_inicio,
        fecha_fin: event.fecha_fin,
        sala_id: event.sala_id,
        cantidad: event.cantidad,
        tipo_evento: event.tipo_evento
      });
    } else {
      setCurrentEvent(null);
      setNewEvent({
        id: 0,
        titulo: '',
        fecha_inicio: new Date(),
        fecha_fin: new Date(),
        sala_id: '',
        cantidad: 0,
        tipo_evento: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    if (currentEvent) {
      // Edita el evento existente
      await update(entityVariable, newEvent);
    } else {
      // Agrega un nuevo evento
      const newEventData = {
        ...newEvent,
        tipo_evento: 1,
        fecha_inicio: new Date(newEvent.fecha_inicio),
        fecha_fin: new Date(newEvent.fecha_fin),
      };
      await create(entityVariable, newEventData);
    }

    let events = await getAll(entityVariable);
    setEventList(events);
    setRoomFilterId(null);
    setEventListFilter(events);
    handleClose();
  };

  const handleDelete = async () => {
    await deleteModel(entityVariable, currentEvent.id);

    let events = await getAll(entityVariable);
    setEventList(events);
    setRoomFilterId(null);
    setEventListFilter(events);

    handleClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setNewEvent({
      ...newEvent,
      [name]: (name === 'cantidad')  ? parseInt(value) : value
    });
  };

  const handleChangeFilter = (e) => {
    const { name, value } = e.target;
    let filter = value === null ? eventList : eventList.filter(q => q.sala_id === value);
    setRoomFilterId(value);
    setEventListFilter(filter);
  };

  const handleDateChange = (name, value) => {
    setNewEvent({
      ...newEvent,
      [name]: new Date(value)
    });
  };

  return (
    <Container maxWidth={false} style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
      Gestión de asignacion de salas
      </Typography>
      <div style={{ display: "flex", gap: "30px" }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpen()}
        style={{ marginBottom: '1rem', marginTop: '1rem' }}
      >
        Reservar sala
      </Button>

      <FormControl style={{ width: '200px', display: "flex", marginBottom: '1rem' }} margin="normal">
            <InputLabel>Sala</InputLabel>
            <Select
              name="roomFilterId"
              value={roomFilterId}
              onChange={handleChangeFilter}
              label="Sala"
            >
              {roomsFilter
                .map((room) => (
                  <MenuItem key={room.id} value={room.id}>
                    {room.nombre}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
      </div>
      <Calendar
        localizer={localizer}
        events={eventListFilter.map(event => ({
          ...event,
          start: new Date(event.fecha_inicio),
          end: new Date(event.fecha_fin),
          title: `${event.titulo} - ${rooms?.find(room => room.id === event.sala_id)?.nombre}`
        }))}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '600px' }}
        onSelectEvent={(event) => handleOpen(event)}
      />

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2">
            {currentEvent ? 'Editar reserva de sala' : 'Reservar Sala'}
          </Typography>

          <TextField
            label="Título"
            name="titulo"
            value={newEvent.titulo}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Participantes"
            name="cantidad"
            type="number"
            value={newEvent.cantidad}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Sala</InputLabel>
            <Select
              name="sala_id"
              value={newEvent.sala_id}
              onChange={handleChange}
              label="Seleccionar sala"
            >
              {rooms
                .filter((room) => !eventList.some(
                  (event) => event.sala_id === room.id &&
                  (newEvent.fecha_inicio < event.fecha_fin && newEvent.fecha_fin > event.fecha_inicio)
                ) && room.capacidad >= newEvent.cantidad)
                .map((room) => (
                  <MenuItem key={room.id} value={room.id}>
                    {room.nombre} (Capacidad: {room.capacidad})
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <TextField
            label="Fecha y Hora de Inicio"
            type="datetime-local"
            value={format(newEvent.fecha_inicio, "yyyy-MM-dd'T'HH:mm")}
            onChange={(e) => handleDateChange('fecha_inicio', e.target.value)}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Fecha y Hora de Fin"
            type="datetime-local"
            value={format(newEvent.fecha_fin, "yyyy-MM-dd'T'HH:mm")}
            onChange={(e) => handleDateChange('fecha_fin', e.target.value)}
            fullWidth
            margin="normal"
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            style={{ marginTop: '1rem' }}
          >
            {currentEvent ? 'Actualizar' : 'Guardar'}
          </Button>
          {currentEvent && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDelete}
              style={{ marginTop: '1rem' }}
            >
              Eliminar
            </Button>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default RoomAssignmentManagement;
