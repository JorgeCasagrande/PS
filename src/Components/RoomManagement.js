import React, { useState, useEffect } from 'react';
import {
  Container,
  Button,
  Modal,
  TextField,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit, Delete } from '@mui/icons-material';
import { getAll, getById, create, update, deleteModel } from './Api/apiRequest';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [open, setOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({ id: 0, nombre: '', capacidad: 0 });
  const [editing, setEditing] = useState(false);

  const entityVariable = "Salas";

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const response = await getAll(entityVariable); // Llama al endpoint para obtener los datos
        setRooms(response); // Guarda los datos en el estado
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchEntities(); // Llama a la función de obtención de datos
  }, []); 

  // Maneja la apertura y cierre del modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewRoom({ id: 0, nombre: '', capacidad: 0 });
    setEditing(false);
  };

    // Maneja el alta y edición de salas
    const handleSaveRoom = async () => {
      if (editing) {
        await update(entityVariable, newRoom);
      } else {
        await create(entityVariable, newRoom);
      }
  
      let entities = await getAll(entityVariable);
      setRooms(entities);
  
      handleClose();
    };

  // Maneja la edición de la sala
  const handleEditRoom = (room) => {
    setNewRoom(room);
    setEditing(true);
    handleOpen();
  };

  // Maneja la eliminación de salas
  const handleDeleteRoom = async (id) => {
    await deleteModel(entityVariable, id);

    let entities = await getAll(entityVariable);
    setRooms(entities);
  };

  // Columnas de la grilla
  const columns = [
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'capacidad', headerName: 'Capacidad', flex: 1 },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={() => handleEditRoom(params.row)}
          >
            <Edit />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleDeleteRoom(params.row.id)}
          >
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Container maxWidth={false} style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Salas
      </Typography>

      <Button variant="contained" color="primary" onClick={handleOpen}>
        Agregar Sala
      </Button>

      <div style={{ height: 400, width: '100%', marginTop: '1rem' }}>
        <DataGrid
          rows={rooms}
          columns={columns}
          pageSize={5}
          disableSelectionOnClick
          autoHeight
          style={{ width: '100%' }}
        />
      </div>

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
            {editing ? 'Editar Sala' : 'Agregar Sala'}
          </Typography>

          <TextField
            fullWidth
            label="Nombre"
            variant="outlined"
            margin="normal"
            value={newRoom.nombre}
            onChange={(e) =>
              setNewRoom({ ...newRoom, nombre: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Capacidad"
            variant="outlined"
            margin="normal"
            value={newRoom.capacidad}
            onChange={(e) =>
              setNewRoom({ ...newRoom, capacidad: parseInt(e.target.value) })
            }
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveRoom}
            style={{ marginTop: '1rem' }}
          >
            {editing ? 'Guardar Cambios' : 'Agregar Sala'}
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default RoomManagement;
