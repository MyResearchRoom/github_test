// src/context/AppointmentsContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { useAuth } from './AuthContext';
import { SUB_DOCTOR } from '../Constants';

// Create the context
const AppointmentsContext = createContext();

// Create a custom hook to use the context
export const useAppointments = () => {
  return useContext(AppointmentsContext);
};

// Create the provider component
export const AppointmentsProvider = ({ children }) => {

  const [appointments, setAppointments] = useState([]);
  const [appointmentTime,setAppointmentTime]=useState('');
  const [subDoctor,setSubdoctor]=useState([]);
  const [selectedDoctor,setSelectedDoctor]=useState('')
  const {token,role}=useAuth();
 
  // const {data,refetch}=useFetch((token && role !== SUB_DOCTOR ) && '/api/doctors/getSlots',{},[token,role])
  // useEffect(()=>{
  //   if(data?.data){
  //     setSlots(data?.data);
  //   }
  // },[data])

  const {data:subDoctorList}=useFetch((token && role !==SUB_DOCTOR ) && '/api/doctors/list',{},[token,role])
  useEffect(()=>{
    if(subDoctorList?.doctors){
      setSubdoctor(subDoctorList?.doctors)
    }
  },[subDoctorList])

  return (
    <AppointmentsContext.Provider value={{ appointments,setAppointments,appointmentTime,setAppointmentTime,subDoctor,setSubdoctor,selectedDoctor,setSelectedDoctor}}>
      {children}
    </AppointmentsContext.Provider>
  );
};
