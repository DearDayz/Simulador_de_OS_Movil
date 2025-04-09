
import React, { useState } from "react";
import { Calendar as CalendarIcon, Plus, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { es } from "date-fns/locale";

interface Event {
  id: number;
  title: string;
  date: Date;
  time?: string;
}

const CalendarApp: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([
    { id: 1, title: "Reunión de trabajo", date: new Date(2025, 3, 11), time: "10:00" },
    { id: 2, title: "Dentista", date: new Date(2025, 3, 15), time: "16:30" },
    { id: 3, title: "Cumpleaños de Ana", date: new Date(2025, 3, 20) },
  ]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState<{ title: string; time?: string }>({ title: "", time: "" });
  
  const filteredEvents = events.filter(
    event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
  );
  
  const addEvent = () => {
    if (newEvent.title.trim()) {
      const event: Event = {
        id: Date.now(),
        title: newEvent.title,
        date: date,
        time: newEvent.time && newEvent.time.trim() ? newEvent.time : undefined
      };
      
      setEvents([...events, event]);
      setNewEvent({ title: "", time: "" });
      setShowAddEvent(false);
    }
  };
  
  const deleteEvent = (id: number) => {
    setEvents(events.filter(event => event.id !== id));
  };
  
  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("es", { month: "long", year: "numeric" });
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="bg-blue-500 p-4 text-white">
        <h2 className="text-xl font-semibold text-center">{formatMonth(date)}</h2>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={date => date && setDate(date)}
            locale={es}
            className="border-0 mx-auto"
          />
          
          <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">
                Eventos: {date.toLocaleDateString("es", { weekday: "long", day: "numeric" })}
              </h3>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex items-center" 
                onClick={() => setShowAddEvent(true)}
              >
                <Plus size={16} className="mr-1" /> Añadir
              </Button>
            </div>
            
            {filteredEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay eventos para este día</p>
            ) : (
              <div className="space-y-2">
                {filteredEvents.map(event => (
                  <div 
                    key={event.id} 
                    className="p-3 bg-gray-100 rounded-lg flex justify-between items-start"
                  >
                    <div>
                      <div className="font-medium">{event.title}</div>
                      {event.time && (
                        <div className="text-sm text-gray-500">{event.time}</div>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-gray-400 hover:text-red-500"
                      onClick={() => deleteEvent(event.id)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showAddEvent && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-sm">
            <h3 className="text-lg font-medium mb-4">Nuevo Evento</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="Título del evento"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora (opcional)
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  placeholder="Ej: 14:30"
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddEvent(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={addEvent}>Guardar</Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-4 border-t">
        <div className="text-xs text-gray-500 text-center">
          <CalendarIcon size={16} className="inline-block mr-1" />
          <span>Calendario • {events.length} eventos</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarApp;
