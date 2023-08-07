// AppointmentForm.js
import React, { useState } from 'react';
import { colRef } from './firebaseConfig';
import { addDoc } from "firebase/firestore";


const AppointmentForm = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

        const date = new Date(); 
      addDoc(colRef, {title,
        date: date})
      setTitle('');
      setDate('');
    } catch (error) {
      console.error('Error adding appointment:', error);
    }
  };

  return (
    <div>
      <h2>Book an Appointment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label>Date:</label>
          <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
};

export default AppointmentForm;
