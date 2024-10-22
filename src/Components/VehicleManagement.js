import React, { useState, useEffect } from 'react';
import {
  Container,
  Button,
  Modal,
  TextField,
  Box,
  Typography,
  IconButton,
  Autocomplete,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit, Delete } from '@mui/icons-material';
import { getAll, getById, create, update, deleteModel } from './Api/apiRequest';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ id: 0, marca: '', modelo: '', patente: '', usuario_id: null });
  const [editing, setEditing] = useState(false);

  const entityVariable = "Vehiculos"

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const response = await getAll(entityVariable); // Llama al endpoint para obtener los datos
        setVehicles(response); // Guarda los vehiculos en el estado
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    const fetchUserEntities = async () => {
      try {
        const response = await getAll('Usuarios'); // Llama al endpoint para obtener los datos
        setUsers(response); // Guarda los vehiculos en el estado
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchEntities(); // Llama a la función de obtención de datos
    fetchUserEntities();
  }, []); 

  // Maneja la apertura y cierre del modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewVehicle({ id: 0, marca: '', modelo: '', patente: '', usuario_id: null });
    setEditing(false);
  };

  // Maneja el alta y edición de vehículos
  const handleSaveVehicle = async () => {
    if (editing) {
      await update(entityVariable, newVehicle);
    } else {
      await create(entityVariable, newVehicle);
    }

    let vehicles = await getAll(entityVariable);
    setVehicles(vehicles);

    handleClose();
  };

  // Maneja la edición del vehículo
  const handleEditVehicle = (vehicle) => {
    setNewVehicle(vehicle);
    setEditing(true);
    handleOpen();
  };

  // Maneja la eliminación de vehículos
  const handleDeleteVehicle = async (id) => {
    await deleteModel(entityVariable, id);

    let vehicle = await getAll(entityVariable);
    setVehicles(vehicle);
  };

  // Columnas de la grilla
  const columns = [
    { field: 'marca', headerName: 'Marca', flex: 1 },
    { field: 'modelo', headerName: 'Modelo', flex: 1 },
    { field: 'patente', headerName: 'Patente', flex: 1 },
    {
      field: 'usuario_id',
      headerName: 'Usuario',
      flex: 1,
      valueGetter: (params) => {
        const user = users?.find((u) => u.id === params);
        return user ? `${user.nombre} ${user.apellido}` : '';
      },
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={() => handleEditVehicle(params.row)}
          >
            <Edit />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleDeleteVehicle(params.row.id)}
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
        Gestión de Vehículos
      </Typography>

      <Button variant="contained" color="primary" onClick={handleOpen}>
        Agregar Vehículo
      </Button>

      <div style={{ height: 400, width: '100%', marginTop: '1rem' }}>
        <DataGrid
          rows={vehicles}
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
            {editing ? 'Editar Vehículo' : 'Agregar Vehículo'}
          </Typography>

          <TextField
            fullWidth
            label="Marca"
            variant="outlined"
            margin="normal"
            value={newVehicle.marca}
            onChange={(e) =>
              setNewVehicle({ ...newVehicle, marca: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Modelo"
            variant="outlined"
            margin="normal"
            value={newVehicle.modelo}
            onChange={(e) =>
              setNewVehicle({ ...newVehicle, modelo: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Patente"
            variant="outlined"
            margin="normal"
            value={newVehicle.patente}
            onChange={(e) =>
              setNewVehicle({ ...newVehicle, patente: e.target.value })
            }
          />
          <Autocomplete
            options={users}
            getOptionLabel={(option) => `${option.nombre} ${option.apellido}`}
            value={users.find((u) => u.id === newVehicle.usuario_id) || null}
            onChange={(e, newValue) =>
              setNewVehicle({ ...newVehicle, usuario_id: newValue ? newValue.id : null })
            }
            renderInput={(params) => (
              <TextField {...params} label="Usuario" variant="outlined" margin="normal" fullWidth />
            )}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveVehicle}
            style={{ marginTop: '1rem' }}
          >
            {editing ? 'Guardar Cambios' : 'Agregar Vehículo'}
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default VehicleManagement;
