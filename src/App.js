import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './Components/Sidebar';
import UserManagement from './Components/UserManagement';
import VehicleManagement from './Components/VehicleManagement';
import RoomManagement from './Components/RoomManagement';
import ParkingAssignment from './Components/ParkingAssignment ';
import OfficePlaceManagement from './Components/OfficePlaceManagement';
import EventManagement from './Components/EventManagement';
import RoomAssignmentManagement from  './Components/RoomAssignmentManagement'

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <Router>
      <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Aplicacion PS
            </Typography>
          </Toolbar>
        </AppBar>

        <Sidebar open={isDrawerOpen} onClose={toggleDrawer} />

        <div style={{ padding: '2rem' }}>
          <Routes>
            <Route path="/users" element={<UserManagement />} />
            <Route path="/vehicle" element={<VehicleManagement />} />
            <Route path="/room" element={<RoomManagement />} />
            <Route path="/parking" element={<ParkingAssignment />} />
            <Route path="/office" element={<OfficePlaceManagement />} />
            <Route path="/event" element={<EventManagement />} />
            <Route path="/roomAssignment" element={<RoomAssignmentManagement />} />
            <Route path="/" element={<Typography variant="h4">Bienvenido a la Aplicación</Typography>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
