import { configureStore } from "@reduxjs/toolkit";
import webSocketReducer from "./slices/webSlice";
import todayAppointmentReducer from "./slices/todayAppointmentSlice";
import notificationReducer from "./slices/notificationSlice";
import appointmentSlice from "./slices/appointmentRefresh";
export const store=configureStore({
    reducer :{
        webSocket: webSocketReducer,
        todayAppointment : todayAppointmentReducer,
        notify:notificationReducer,
        appointment: appointmentSlice,
    }
})