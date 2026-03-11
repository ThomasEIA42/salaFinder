import React, { useState } from 'react';

interface ReservationData {
  spaceId: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  attendees: number;
}

export default function ReservationForm() {
  const [formData, setFormData] = useState<ReservationData>({
    spaceId: '',
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    attendees: 1
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para detectar conflictos antes de enviar [cite: 7, 24]
    console.log("Datos de reserva enviados:", formData);
    // [cite: 21, 22]
    alert("Reserva enviada. Estado: Pendiente de aprobación.");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-surface border border-border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Nueva Reserva</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Selección de Espacio */}
        <div>
          <label className="block text-sm font-medium mb-1">Espacio [cite: 14, 15]</label>
          <select 
            name="spaceId" 
            required 
            className="w-full p-2 border rounded"
            onChange={handleChange}
          >
            <option value="">Selecciona un salón/cancha</option>
            <option value="1">Laboratorio de Cómputo A</option>
            <option value="2">Cancha de Fútbol</option>
            <option value="3">Sala de Juntas 201</option>
          </select>
        </div>

        {/* Fecha y Horas  */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">Fecha</label>
            <input type="date" name="date" required className="w-full p-2 border rounded" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Asistentes </label>
            <input type="number" name="attendees" min="1" required className="w-full p-2 border rounded" onChange={handleChange} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">Hora Inicio</label>
            <input type="time" name="startTime" required className="w-full p-2 border rounded" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hora Fin</label>
            <input type="time" name="endTime" required className="w-full p-2 border rounded" onChange={handleChange} />
          </div>
        </div>

        {/* Propósito  */}
        <div>
          <label className="block text-sm font-medium mb-1">Propósito de la reserva</label>
          <textarea 
            name="purpose" 
            placeholder="Ej: Clase de Web Engineering" 
            className="w-full p-2 border rounded"
            required
            onChange={handleChange}
          ></textarea>
        </div>

        <button 
          type="submit" 
          className="bg-brand-700 text-white font-bold py-2 px-4 rounded hover:bg-opacity-90 transition-colors"
        >
          Confirmar Reserva
        </button>
      </form>
    </div>
  );
}