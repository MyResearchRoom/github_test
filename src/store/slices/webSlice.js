import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {cancelAppointment, newAppointment, rescheduleAppointment, saveAppointmentPrescription, updateParameterInAppointment, updateStatusInAppointment} from "../slices/todayAppointmentSlice"
import { toast } from "react-toastify";
import { addNewNotification } from "./notificationSlice";

let socket=null;


export const getSocket = () => socket;
export const connectWebSocket = createAsyncThunk(
  "web/connectToWeb",
  async ({token,doctorId=''}, { dispatch, rejectWithValue }) => {
    try {
        
       socket = new WebSocket(`${process.env.REACT_APP_WEB_APP_API_URL}/?token=${token}&doctorId=${doctorId}`);

      return await new Promise((resolve) => {
        socket.onopen = () => {
          resolve("connected");
        };
        socket.onmessage = (event) => { 
          try {
            const data = JSON.parse(event.data);
            console.log(data)
            if(data.event==='parametersUpdated'){
              dispatch(updateParameterInAppointment(data))
            }else if(data.event === 'newAppointment'){
              dispatch(newAppointment(data.appointment))
            }else if(data.event === "appointmentUpdated"){
              dispatch(updateStatusInAppointment(data.appointment))
              dispatch(inAppointment(data.appointment))
            }else if(data.event ==='updatedAppointment'){
              dispatch(saveAppointmentPrescription(data.appointment))
            }else if(data.event ==='cancelAppointment'){
              dispatch(cancelAppointment(data.appointment.id))
            }else if(data.event === 'rescheduleAppointment'){
              dispatch(rescheduleAppointment(data.appointment))
            }
            else if(data.type==='notification'){
              toast.info(data.data.message)
              dispatch(addNewNotification(data.data))
            }
            
          } catch (err) {
            console.log("Invalid WebSocket message", event.data);
          }
        };
        socket.onerror = (error) => {
          console.log("❌ WebSocket error:", error);
          rejectWithValue("WebSocket error");
        };
        socket.onclose = (event) => {
            resolve("disconnected");
        };
      });
    } catch (error) {
      return rejectWithValue("WebSocket connection failed");
    }
  }
);

const webSlice = createSlice({
  name: "web",
  initialState: {
    data: null,
    loading: false,
    error: "",
    connected: false,
  },
  reducers: {
    inAppointment: (state, action) => {
      const updated =action.payload;
      if(updated.status === 'in'){
        state.data=updated.id
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(connectWebSocket.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.connected = false;
    }).addCase(connectWebSocket.fulfilled,(state)=>{
        state.connected=true;
        state.loading=false;
    }).addCase(connectWebSocket.rejected,(state,action)=>{
        state.loading = false;
        state.error = action.payload || "WebSocket connection error";
        state.connected = false;
    })
  },
});

export const { inAppointment} = webSlice.actions;
export default webSlice.reducer;
