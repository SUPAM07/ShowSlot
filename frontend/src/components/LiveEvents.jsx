import React from 'react';
import { events } from '../utils/constants'; // Ensure this matches your export type

const LiveEvents = () => {
  return (
    <div className='max-w-screen-xl mx-auto px-4 py-10'>
      <h2 className='text-2xl font-semibold mb-6'>The Best Of Live Events</h2>
      
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4'>
        {events.map((event, i) => (
          <div 
            // Better to use a unique ID if your events have one (e.g., event.id)
            key={event.id || i} 
            className='rounded-xl overflow-hidden relative group shadow-sm cursor-pointer'
          >
            <img 
              src={event.img} 
              alt={event.title} 
              className='w-full h-56 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105'
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveEvents;