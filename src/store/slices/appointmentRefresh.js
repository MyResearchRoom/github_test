import { createSlice } from "@reduxjs/toolkit";

const appointmentSlice = createSlice({
  name: "appointment",
  initialState: {
    refreshKey: 0,
  },
  reducers: {
    refreshAppointments: (state) => {
      state.refreshKey += 1;
    },
  },
});

export const { refreshAppointments } = appointmentSlice.actions;

export default appointmentSlice.reducer;