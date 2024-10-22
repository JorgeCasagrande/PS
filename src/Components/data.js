export const users = [
    { id: 1, firstName: 'Juan', lastName: 'Pérez' },
    { id: 2, firstName: 'María', lastName: 'López' },
    { id: 3, firstName: 'Carlos', lastName: 'González' },
  ];

  export const parkingPlaces = Array.from({ length: 20 }, (_, index) => {
   
    return {
      id: index + 1,
      name: `Lugar ${index + 1}`,
      occupied: false, // El lugar está ocupado si userId no es null
      assignment: []
    };
  });

  export const officePlaces = Array.from({ length: 40 }, (_, index) => {
    return {
      id: index + 1,
      name: `Lugar ${index + 1}`,
      occupied: false,
      panel: Math.floor(index / 18) + 1, // Determina el peine del lugar
      assignment: []
    };
  });

  export const eventTypes = [
    { id: 1, nombre: 'Reunión' },
    { id: 2, nombre: 'Conferencia' },
    { id: 3, nombre: 'Taller' },
    { id: 4, nombre: 'Seminario' },
    { id: 5, nombre: 'Capacitación' }
  ];
  
  export const rooms = [
    { id: 1, name: 'Sala 1', capacity: 20 },
    { id: 2, name: 'Sala 2', capacity: 50 },
    { id: 3, name: 'Sala 3', capacity: 100 },
    // Agregar más salas según sea necesario
  ];

  export const roomsFilter = [
    {id: null, name: 'Todas', capacity: 0},
    { id: 1, name: 'Sala 1', capacity: 20 },
    { id: 2, name: 'Sala 2', capacity: 50 },
    { id: 3, name: 'Sala 3', capacity: 100 },
    // Agregar más salas según sea necesario
  ];
  
  export const events = [
    // Ejemplo de eventos
    {
      id: 1,
      title: 'Reunión de Proyecto',
      start: new Date('2024-10-05T10:00:00'),
      end: new Date('2024-10-05T12:00:00'),
      roomId: 1,
      participants: 10,
      type: 'Reunión'
    }
    // Agregar más eventos según sea necesario
  ];