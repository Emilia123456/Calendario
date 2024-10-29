// array inicial de eventos hardcodeada
let events = [
  { id: 1, title: "Evento de Cumpleaños", date: "2024-10-29" },
  { id: 2, title: "Reunión de Trabajo", date: "2024-10-30" },
  { id: 3, title: "Cena Familiar", date: "2024-10-31" },
];

// función para obtener todos los eventos - devuelve un array 
export const getEvents = async () => {
  return events;
};

// función para agregar un nuevo evento - recibe el nuevo evento, le asigna un ID único y lo agrega al array `events`
export const addEvent = async (newEvent) => {
  newEvent.id = events.length + 1; // le pone un nuevo ID 
  events.push(newEvent); // agrega el evento al array
  return newEvent; 
};

// función para actualizar un evento - recibe el evento actualizado y reemplaza el evento existente en el array `events` - Si encuentra el evento por ID, lo actualiza; si no, no realiza cambios
export const updateEvent = async (updatedEvent) => {
  events = events.map((event) =>
    event.id === updatedEvent.id ? updatedEvent : event
  );
  return updatedEvent; // Devuelve el evento actualizado
};

// función para eliminar un evento - elimina el evento segun el ID especificado
export const deleteEvent = async (id) => {
  events = events.filter((event) => event.id !== id); // Elimina el evento por ID
  return { success: true }; 
};
