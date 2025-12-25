import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import type { TimelineEvent } from '../types';

interface EventListProps {
  events: TimelineEvent[];
  onEventsChange: (events: TimelineEvent[]) => void;
}

const EventList: React.FC<EventListProps> = ({ events, onEventsChange }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<TimelineEvent | null>(null);

  const addEvent = () => {
    const newEvent: TimelineEvent = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      title: 'New Event',
      description: 'Description here...'
    };
    onEventsChange([...events, newEvent]);
    startEditing(newEvent);
  };

  const deleteEvent = (id: string) => {
    onEventsChange(events.filter(e => e.id !== id));
  };

  const startEditing = (event: TimelineEvent) => {
    setEditingId(event.id);
    setEditForm({ ...event });
  };

  const saveEdit = () => {
    if (!editForm) return;
    onEventsChange(events.map(e => e.id === editForm.id ? editForm : e));
    setEditingId(null);
    setEditForm(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleEditChange = (key: keyof TimelineEvent, value: string) => {
    if (editForm) {
      setEditForm({ ...editForm, [key]: value });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
          Events ({events.length})
        </h3>
        <button
          onClick={addEvent}
          className="flex items-center px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-3 h-3 mr-1" /> Add Event
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {events.map((event) => (
          <div key={event.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            {editingId === event.id && editForm ? (
              // Edit Mode
              <div className="space-y-2">
                <input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => handleEditChange('date', e.target.value)}
                  className="w-full px-2 py-1 text-xs border rounded outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  value={editForm.title}
                  placeholder="Title"
                  onChange={(e) => handleEditChange('title', e.target.value)}
                  className="w-full px-2 py-1 text-sm font-medium border rounded outline-none focus:border-blue-500"
                />
                <textarea
                  value={editForm.description}
                  placeholder="Description"
                  rows={2}
                  onChange={(e) => handleEditChange('description', e.target.value)}
                  className="w-full px-2 py-1 text-xs border rounded outline-none focus:border-blue-500 resize-none"
                />
                <div className="flex justify-end space-x-2 mt-2">
                   <button onClick={cancelEdit} className="p-1 text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                   </button>
                   <button onClick={saveEdit} className="p-1 text-green-500 hover:text-green-700">
                    <Check className="w-4 h-4" />
                   </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="group relative">
                <div className="flex justify-between items-start">
                    <div>
                        <span className="inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-slate-100 rounded mb-1">
                            {event.date}
                        </span>
                        <h4 className="text-sm font-semibold text-slate-800">{event.title}</h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{event.description}</p>
                    </div>
                </div>
                
                <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 pl-2 pb-2 rounded-bl-lg">
                    <button onClick={() => startEditing(event)} className="p-1 text-blue-500 hover:text-blue-700">
                        <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deleteEvent(event.id)} className="p-1 text-red-400 hover:text-red-600">
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {events.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-sm">
                No events yet. Click "Add Event" to start.
            </div>
        )}
      </div>
    </div>
  );
};

export default EventList;