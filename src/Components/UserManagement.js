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

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState({ id: 0, nombre: '', apellido: '', email: '', telefono: ''});
  const [editing, setEditing] = useState(false);

  const entityVariable = "Usuarios"


  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const response = await getAll(entityVariable); // Llama al endpoint para obtener los usuarios
        setUsers(response); // Guarda los usuarios en el estado
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };

    fetchEntities(); // Llama a la función de obtención de usuarios
  }, []); 

  // Maneja la apertura y cierre del modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewUser({ id: 0, nombre: '', apellido: '', email: '', telefono: ''});
    setEditing(false);
  };

  // Maneja el alta y edición de usuarios
  const handleSaveUser = async () => {
    if (editing) {
      await update(entityVariable, newUser);
    } else {
      await create(entityVariable, newUser);
    }

    let users = await getAll(entityVariable);
    setUsers(users);

    handleClose();
  };

  // Maneja la edición del usuario
  const handleEditUser = (user) => {
    setNewUser(user);
    setEditing(true);
    handleOpen();
  };

  // Maneja la eliminación de usuarios
  const handleDeleteUser = async (id) => {
    await deleteModel(entityVariable, id);

    let users = await getAll(entityVariable);
    setUsers(users);
  };

    // Columnas de la grilla
    const columns = [
        { field: 'nombre', headerName: 'Nombre', flex: 1 },
        { field: 'apellido', headerName: 'Apellido', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 2 },
        { field: 'telefono', headerName: 'Teléfono', flex: 1 },
        // { field: 'documento', headerName: 'Documento', flex: 1 },
        {
          field: 'actions',
          headerName: 'Acciones',
          flex: 0.5,
          renderCell: (params) => (
            <>
              <IconButton
                color="primary"
                onClick={() => handleEditUser(params.row)}
              >
                <Edit />
              </IconButton>
              <IconButton
                color="secondary"
                onClick={() => handleDeleteUser(params.row.id)}
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
        Gestión de Usuarios
      </Typography>

      <Button variant="contained" color="primary" onClick={handleOpen}>
        Agregar Usuario
      </Button>

      <div style={{ height: 400, width: '100%', marginTop: '1rem' }}>
        <DataGrid
          rows={users}
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
            {editing ? 'Editar Usuario' : 'Agregar Usuario'}
          </Typography>

          <TextField
            fullWidth
            label="Nombre"
            variant="outlined"
            margin="normal"
            value={newUser.nombre}
            onChange={(e) =>
              setNewUser({ ...newUser, nombre: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Apellido"
            variant="outlined"
            margin="normal"
            value={newUser.apellido}
            onChange={(e) =>
              setNewUser({ ...newUser, apellido: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={newUser.email}
            onChange={(e) =>
              setNewUser({ ...newUser, email: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Teléfono"
            variant="outlined"
            margin="normal"
            value={newUser.telefono}
            onChange={(e) =>
              setNewUser({ ...newUser, telefono: e.target.value })
            }
          />
          {/* <TextField
            fullWidth
            label="Documento"
            variant="outlined"
            margin="normal"
            value={newUser.documento}
            onChange={(e) =>
              setNewUser({ ...newUser, documento: e.target.value })
            }
          /> */}

          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveUser}
            style={{ marginTop: '1rem' }}
          >
            {editing ? 'Guardar Cambios' : 'Agregar Usuario'}
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default UserManagement;
