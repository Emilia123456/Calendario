import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { getEvents, addEvent, updateEvent, deleteEvent } from './Service/service';
import { Feather } from '@expo/vector-icons';

// componente EventItem para mostrar cada evento individualmente
// React.memo para evitar renderizados si no cambia el evento
const EventItem = React.memo(({ item, onEdit, onDelete }) => (
  <View style={styles.eventItem}>
    <View>
      {/* título y la fecha del evento */}
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDate}>{item.date}</Text>
    </View>
    <View style={styles.eventButtons}>
      {/* boton de editar */}
      <TouchableOpacity onPress={() => onEdit(item)} style={styles.iconButton}>
        <Feather name="edit" size={18} color="#4A90E2" />
      </TouchableOpacity>
      {/* boton de eliminar */}
      <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.iconButton}>
        <Feather name="trash-2" size={18} color="#E53E3E" />
      </TouchableOpacity>
    </View>
  </View>
));

export default function App() {
  const [events, setEvents] = useState([]); // almacenar eventos
  const [selectedEvent, setSelectedEvent] = useState(null); // estado para el evento seleccionado
  const [title, setTitle] = useState(""); // almacenar titulos
  const [date, setDate] = useState(""); // almacenar fechas

  // cargar eventos
  useEffect(() => {
    loadEvents();
  }, []);

  // cargar eventos desde la API
  const loadEvents = async () => {
    const eventsFromApi = await getEvents();
    setEvents(eventsFromApi);
  };

  // agregar un evento y recargar la lista 
  const handleAddEvent = async () => {
    if (title && date) {
      await addEvent({ title, date });
      loadEvents();
      setTitle(""); // limpiar el campo de título
      setDate(""); // limpiar el campo de fecha
    }
  };

  // actualizar un evento  y recargar la lista
  const handleUpdateEvent = async () => {
    if (selectedEvent && title && date) {
      await updateEvent({ id: selectedEvent.id, title, date });
      loadEvents();
      setSelectedEvent(null); // limpiar el evento seleccionado
      setTitle("");
      setDate("");
    }
  };

  // eliminar un evento y recargar la lista
  const handleDeleteEvent = async (id) => {
    await deleteEvent(id);
    loadEvents();
  };

  // seleccionar un evento para editar
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setTitle(event.title); // llenar el título con los datos del evento seleccionado
    setDate(event.date); // llenar la fecha con los datos del evento seleccionado
  };

  // función de renderizado para cada item de evento con `useCallback` para optimización
  const renderEventItem = useCallback(({ item }) => (
    <EventItem item={item} onEdit={handleSelectEvent} onDelete={handleDeleteEvent} />
  ), []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7FAFC" />
      
      {/* titulo principal */}
      <Text style={styles.header}>Gestor de Eventos</Text>
      
      {/* componente de calendario */}
      <Calendar
        onDayPress={(day) => setDate(day.dateString)} // guardar la fecha seleccionada en el calendario
        markedDates={events.reduce((acc, event) => {
          acc[event.date] = { marked: true, dotColor: '#4A90E2' };
          return acc;
        }, {})} // marcar los días con eventos
        style={styles.calendar}
        theme={{
          todayTextColor: '#4A90E2', 
          arrowColor: '#4A90E2', 
          monthTextColor: '#2D3748', 
          textMonthFontWeight: 'bold',
          textDayFontSize: 14,
          textMonthFontSize: 16,
        }}
      />

      <View style={styles.inputContainer}>
        {/* input del título del evento */}
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Título del evento"
          placeholderTextColor="#A0AEC0"
        />
        
        {/* input de la fecha del evento */}
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="Fecha del evento"
          placeholderTextColor="#A0AEC0"
        />
        
        {/* boton para agregar o actualizar el evento */}
        <TouchableOpacity
          style={[styles.button, selectedEvent ? styles.updateButton : styles.addButton]}
          onPress={selectedEvent ? handleUpdateEvent : handleAddEvent}
        >
          <Text style={styles.buttonText}>
            {selectedEvent ? "Actualizar Evento" : "Agregar Evento"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* lista de eventos */}
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderEventItem}
        contentContainerStyle={styles.eventList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC', 
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
    marginVertical: 16,
  },
  calendar: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#2D3748',
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#4A90E2',
  },
  updateButton: {
    backgroundColor: '#F6AD55',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  eventList: {
    paddingHorizontal: 16,
  },
  eventItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#718096',
  },
  eventButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
});
