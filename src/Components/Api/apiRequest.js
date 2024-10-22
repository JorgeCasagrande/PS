const baseUrl = 'https://ps.marketauditv2.com.ar'; // Cambia según la URL base de tu API

// Obtener todos los usuarios
export const getAll = async (entityVariable) => {
  try {
    const response = await fetch(`${baseUrl}/${entityVariable}`);
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en getAll:', error);
    throw error;
  }
};

// Obtener un usuario por ID
export const getById = async (entityVariable, id) => {
  try {
    const response = await fetch(`${baseUrl}/${entityVariable}/${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener el usuario');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en getById:', error);
    throw error;
  }
};

// Crear un nuevo usuario
export const create = async (entityVariable, model) => {
  try {
    const response = await fetch(`${baseUrl}/${entityVariable}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(model),
    });
    if (!response.ok) {
      throw new Error('Error en la creacion');
    }
  } catch (error) {
    console.error('Error en create:', error);
    throw error;
  }
};

// Actualizar un usuario existente
export const update = async (entityVariable,model) => {
  try {
    const response = await fetch(`${baseUrl}/${entityVariable}/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(model),
    });
    if (!response.ok) {
      throw new Error('Error al actaulizar');
    }
  } catch (error) {
    console.error('Error en update:', error);
    throw error;
  }
};

// Eliminar un usuario
export const deleteModel = async (entityVariable,id) => {
  try {

    const body = { id }; // El objeto que contiene la propiedad id

    const response = await fetch(`${baseUrl}/${entityVariable}/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body), // Enviando el objeto con la propiedad id
    });
    if (!response.ok) {
      throw new Error('Error al eliminar');
    }
  } catch (error) {
    console.error('Error en delete:', error);
    throw error;
  }
};
