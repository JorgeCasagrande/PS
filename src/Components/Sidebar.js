import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Group, Home } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Sidebar = ({ open, onClose }) => {
  return (
    <Drawer open={open} onClose={onClose}>
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary="Inicio" />
        </ListItem>

        <ListItem button component={Link} to="/users">
          <ListItemIcon>
            <Group />
          </ListItemIcon>
          <ListItemText primary="Gestión de Usuarios" />
        </ListItem>

        <ListItem button component={Link} to="/vehicle">
          <ListItemIcon>
            <Group />
          </ListItemIcon>
          <ListItemText primary="Gestión de Vehiculos" />
        </ListItem>

        <ListItem button component={Link} to="/room">
          <ListItemIcon>
            <Group />
          </ListItemIcon>
          <ListItemText primary="Gestión de Salas" />
        </ListItem>

        <ListItem button component={Link} to="/roomAssignment">
          <ListItemIcon>
            <Group />
          </ListItemIcon>
          <ListItemText primary="Gestión de Asignación de Salas" />
        </ListItem>

        <ListItem button component={Link} to="/office">
          <ListItemIcon>
            <Group />
          </ListItemIcon>
          <ListItemText primary="Gestión de oficina" />
        </ListItem>

        <ListItem button component={Link} to="/event">
          <ListItemIcon>
            <Group />
          </ListItemIcon>
          <ListItemText primary="Gestión de eventos" />
        </ListItem>

        <ListItem button component={Link} to="/parking">
          <ListItemIcon>
            <Group />
          </ListItemIcon>
          <ListItemText primary="Gestión de Cocheras" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
