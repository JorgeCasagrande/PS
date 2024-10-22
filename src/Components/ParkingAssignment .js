import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Button,
  Modal,
  Box,
  TextField,
  Autocomplete,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // Importar el ícono de basura
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { parkingPlaces, users } from './data'; // Usa el archivo de datos actualizado

// Registrar los elementos necesarios para los gráficos
ChartJS.register(Title, Tooltip, Legend, ArcElement);

const OfficePlaceManagement = () => {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [places, setPlaces] = useState(parkingPlaces);
  const [fromDateTime, setFromDateTime] = useState("");
  const [toDateTime, setToDateTime] = useState("");
  const [selectedFromDateTime, setSelectedFromDateTime] = useState("");
  const [selectedToDateTime, setSelectedToDateTime] = useState("");
  const [isFilter, setIsFilter] = useState(false);
  const [placesFilter, setPlacesFilter] = useState([])

  const handleFromDateTimeChange = (event) => {
    setFromDateTime(event.target.value);
  };

  const handleToDateTimeChange = (event) => {
    setToDateTime(event.target.value);
  };

  const handleOpen = (place) => {
    setSelectedPlace(place);
    setSelectedUser(
      place.occupied ? users.find((user) => user.id === place.userId) : null
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen2(false);
    setOpen(false);
    setSelectedPlace(null);
    setSelectedUser(null);
  };

  const handleSelectedFromDate = (newValue) => {
    setSelectedFromDateTime(newValue);
  }

  const handleSelectedToDate = (newValue) => {
    setSelectedToDateTime(newValue);
  }

  const handleAssign = () => {
    
    let infoAssignment = {userId: selectedUser.id, from: selectedFromDateTime, to: selectedToDateTime}

    const placesToAssign = places.map((place) =>
      place.id === selectedPlace.id
        ? { ...place, assignment: [...place.assignment, infoAssignment] }
        : place
    );
    // Asignar el usuario al nuevo lugar
    setPlaces(placesToAssign);
    setIsFilter(true);
    setPlacesFilter(filtrarAsignaciones(placesToAssign, fromDateTime, toDateTime));
    setOpen2(true);
  };

  const getToIndexPlace = (placeId, assignmentToRemove) => {
    let assignment = places.filter(q => q.id === placeId);
    return assignment[0]?.assignment?.findIndex(q => q.userId === assignmentToRemove.userId && q.from === assignmentToRemove.from && q.to === assignmentToRemove.to);
  }

  const handleRemoveAssignment = (placeId, assignment) => {
    debugger;
    let assignmentToRemove = getToIndexPlace(placeId, assignment);

    let placesToFilter = places.map((place) =>
      place.id === placeId
    ? { ...place, assignment: place.assignment.filter((q, index) => index !== assignmentToRemove) }
        : place
    )

    setPlaces(placesToFilter);
    setIsFilter(true);
    setPlacesFilter(filtrarAsignaciones(placesToFilter, fromDateTime, toDateTime));
  };

  const handleClick = () => {
    setIsFilter(true);
    setPlacesFilter(filtrarAsignaciones(places, fromDateTime, toDateTime));
  }

  const handleClean = () => {
    setFromDateTime("");
    setToDateTime("");
    setIsFilter(false);
  }

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString('es-ES', { 
      dateStyle: 'long', 
      timeStyle: 'short' 
    });
  };

  function filtrarAsignaciones(places, fechaDesde, fechaHasta) {
    const fechaInicio = new Date(fechaDesde);
    const fechaFin = new Date(fechaHasta);
  debugger;
    return places.map(place => {
      // Filtrar asignaciones dentro del rango de fechas
      const asignacionesFiltradas = place.assignment.filter(asignacion => {
        const fechaAsignacionDesde = new Date(asignacion.from);
        const fechaAsignacionHasta = new Date(asignacion.to);
        return fechaAsignacionDesde >= fechaInicio && fechaAsignacionHasta <= fechaFin;
    });

    // Modificar la propiedad estado si hay asignaciones
    if (asignacionesFiltradas.length > 0) {
      return {
        ...place,
        assignment: asignacionesFiltradas,
        occupied: true // Cambia el estado si hay asignaciones
      };
    }

    return place; // Retornar place sin cambios si no hay asignaciones

    }); // Filtrar lugares sin asignaciones en el rango
  }

  return (
    <Container maxWidth={false} style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Lugares en la Cochera
      </Typography>

      <Box display="flex" gap={2}>
      <TextField
        label="Fecha y Hora Desde"
        type="datetime-local"
        value={fromDateTime}
        onChange={handleFromDateTimeChange}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        label="Fecha y Hora Hasta"
        type="datetime-local"
        value={toDateTime}
        onChange={handleToDateTimeChange}
        InputLabelProps={{
          shrink: true,
        }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleClick}
      >
        Buscar
      </Button>

      <Button
        variant="contained"
        color="primary"
        onClick={handleClean}
      >
        Limpiar
      </Button>
    </Box>

      {isFilter && <div>
        <Typography variant="h5" gutterBottom>
        Lugares
        </Typography>
          <Grid container spacing={2}>
            {placesFilter
              .map((place) => (
                <Grid item xs={2} key={place.id}>
                  <Button
                    variant="contained"
                    fullWidth
                    style={{
                      backgroundColor: place.occupied ? '#ffcccc' : '#ccffcc',
                      color: place.occupied ? '#990000' : '#009900',
                      fontWeight: 'bold',
                      position: 'relative',
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      padding: '0.5rem',
                    }}
                    onClick={() => handleOpen(place)}
                  >
                    <Typography variant="body2" display="block">
                       {place.occupied ? 'Lugar: ' +place.id + ' - '+ place.assignment.length  + ' Asignaciones' : place.name}
                    </Typography>
                    {place.occupied && (
                      <IconButton
                        color="error"
                        size="small"
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          borderRadius: '0 0 0 4px',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveAssignment(place.id);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Button>
                </Grid>
              ))}
          </Grid>
          </div>
          }
          {
            isFilter && 
            <div>
            <Typography variant="h7" gutterBottom style={{ marginTop: '2rem' }}>
              Asignaciones Actuales
            </Typography>
            <ul>
            {
                placesFilter
                  ?.map((p) => p?.assignment?.map((place, index) => {
                    const user = users.find((u) => u.id === place.userId);
                    return (
                      <li key={index} style={{ marginBottom: '0.5rem' }}>
                        {p.name} - {user.firstName} {user.lastName} - {place.from} - {place.to}
                        <IconButton
                          color="error"
                          size="small"
                          style={{ marginLeft: '1rem' }}
                          onClick={() => handleRemoveAssignment(p.id, place)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </li>
                    );
                  }))
            }
            </ul>
          </div>
          }

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2">
            Asignar {selectedPlace ? selectedPlace.name : ''}
          </Typography>

          <Autocomplete
            options={users}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
            value={selectedUser || null}
            onChange={(e, newValue) => setSelectedUser(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Seleccionar Usuario"
                variant="outlined"
                margin="normal"
                fullWidth
              />
            )}
          />

          <Box display="flex" gap={2}>
            <TextField
              label="Fecha y Hora Desde"
              type="datetime-local"
              value={selectedFromDateTime}
              onChange={(e, newValue) => handleSelectedFromDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Fecha y Hora Hasta"
              type="datetime-local"
              value={selectedToDateTime}
              onChange={(e, newValue) => handleSelectedToDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={handleAssign}
            style={{ marginTop: '1rem' }}
          >
            Asignar
          </Button>
        <div>
          <Typography variant="h7" gutterBottom style={{ marginTop: '2rem' }}>
            Asignaciones Actuales
          </Typography>
          <ul>
          {
              placesFilter
                ?.filter((p) => p.id === selectedPlace?.id)[0]?.assignment?.map((place, index) => {
                  const user = users.find((u) => u.id === place.userId);
                  return (
                    <li key={index} style={{ marginBottom: '0.5rem' }}>
                      {user.firstName} {user.lastName} - {place.from} - {place.to}
                      <IconButton
                        color="error"
                        size="small"
                        style={{ marginLeft: '1rem' }}
                        onClick={() => handleRemoveAssignment(selectedPlace?.id, place)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </li>
                  );
                })
          }
          </ul>
        </div>
        </Box>
      </Modal>
      <Modal open={open2} onClose={handleClose}>
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
          Detalles de la Reserva
        </Typography>
        <Typography sx={{ mt: 2 }}>
          <strong>Usuario:</strong> {selectedUser?.firstName + ' '+ selectedUser?.lastName}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          <strong>Lugar:</strong> {selectedPlace?.name}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          <strong>Fecha y Hora Desde:</strong> {formatDateTime(selectedFromDateTime)}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          <strong>Fecha y Hora Hasta:</strong> {formatDateTime(selectedToDateTime)}
        </Typography>
        <Button onClick={handleClose} sx={{ mt: 2 }}>Cerrar</Button>  
        </Box>
      </Modal>
    </Container>
  );
};

export default OfficePlaceManagement;
