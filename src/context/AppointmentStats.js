import React, { createContext, useContext, useState, useEffect } from 'react';

import { useFetch } from '../hooks/useFetch';
import { useAuth } from './AuthContext';

// Create context
const AppointmentsStats = createContext();

// Custom hook to use the context
export const useAppointmentsStats = () => {
  return useContext(AppointmentsStats);
};

// Provider component
export const AppointmentsStatsProvider = ({ children }) => {
  // const [appointmentsStats, setAppointmentsStats] = useState(null);
  const [user, setUser] = useState({});
  const {token,role}=useAuth();
  


  // Fetch the appointment statistics from the API

  // const {data:appointmentStats,refetch:getAppointmentStatisticsByDoctor}=useFetch((token && role) && '/api/doctors/appointments-stats');
  // useEffect(()=>{
  //   if(appointmentStats?.stats){
  //     setAppointmentsStats(appointmentStats?.stats)
  //   }
  // },[appointmentStats])



  const {data:getUserData,refetch}=useFetch((token && role) && `/api/receptionists/me`,{},[token,role]);
  useEffect(()=>{
    if(getUserData?.admin){
      setUser(getUserData?.admin)
    }
  },[getUserData])


  const updateUser = (updatedUserData) => {
    setUser((prevUser) => ({ ...prevUser, ...updatedUserData }));
  };


  // Return the provider with the context value
  return (
    <AppointmentsStats.Provider value={{ user,setUser,updateUser,getUser:refetch}}>
      {children}
    </AppointmentsStats.Provider>
  );
};
