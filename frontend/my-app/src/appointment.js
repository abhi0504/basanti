import React, { useState, useEffect } from 'react';
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import firebase from 'firebase';
// import { Firestore } from 'firebase/firestore';
import { colRef } from './firebaseConfig';
import { getDocs } from "firebase/firestore";


const AppointmentCalendar = () => {

    const [appointments, setAppointments] = useState([]);
    useEffect(() => {
        const fetchAppointments = async () => {
          try {
            console.log(colRef);
            getDocs(colRef).then((snapshot) => {
                console.log(snapshot.docs);
                const appointmentsData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            })
            // const snapshot = await Firestore().collection('appointments').get();
            // const appointmentsData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            // setAppointments(appointmentsData);
          } catch (error) {
            console.error('Error fetching appointments:', error);
          }
        };
    
        fetchAppointments();
      }, []);

  return (
     <div>
      <Fullcalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={appointments.map((appointment) => ({
          id: appointment.id,
          title: appointment.title,
          date: appointment.date, // Convert Firestore Timestamp to Date object
        }))}
      />
    </div>
  );
}

export default AppointmentCalendar;