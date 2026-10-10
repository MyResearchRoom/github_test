import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiClient from "../../api/apiClient";

export const todayAppointments = createAsyncThunk(
  "today/appointments",
  async (
    {
      searchTerm = "",
      date = new Date().toISOString().split("T")[0],
      appointmentTime = "",
      doctorId = "",
      doctorType = "",
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.get("/api/appointments/todays-appointments", {
        params: {
          searchTerm,
          date,
          appointmentTime,
          doctorId,
          doctorType,
        },
      });
      if (response?.status === 200) {
        return response?.data?.appointments;
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.error || "Error fetching appointments"
      );
    }
  }
);

export const updateAppointment = createAsyncThunk(
  "update/appointment",
  async ({ appointmentId, formData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        `/api/appointments/submit-appointment/${appointmentId}`,
        formData
      );
      if (response?.status === 200) {
        toast.success("Appointment submitted successfully");
        return { appointmentId, formData };
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.error || "An error occurred"
      );
    }
  }
);

export const updatePaymentModeInAppointment = createAsyncThunk(
  "update-payment/appointment",
  async ({ appointmentId, paymentMode }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `/api/appointments/payment-mode/${appointmentId}`,
        { paymentMode }
      );
      if (response?.status === 200) {
        toast.success("Payment mode updated successfully");
        return { appointmentId, paymentMode };
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.error || "An error occurred"
      );
    }
  }
);

export const updateToxicityInAppointment = createAsyncThunk(
  "update-toxicity/appointment",
  async ({ appointmentId, patientId }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        `/api/patients/update-toxicity/${patientId}`,
        {}
      );
      if (response?.status === 200) {
        toast.success(
          response?.data?.message || "Toxicity updated successfully"
        );
        return { appointmentId, patientId };
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.error || "An error occurred"
      );
    }
  }
);

export const updateAppointmentStatus = createAsyncThunk(
  "update-status/appointment",
  async ({ appointmentId, status }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(
        `/api/appointments/set-current-appointment/${appointmentId}`,
        {status}
      );
      if (response?.status === 200) {
        return { appointmentId, status };
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.error || "Failed to update status"
      );
    }
  }
);

const todayAppointmentSlice = createSlice({
  name: "todayAppointments",
  initialState: {
    appointments: [],
    loading: false,
    error: null,
  },
  reducers: {
    updateParameterInAppointment: (state, action) => {
      const updated = action.payload;
      state.appointments = state.appointments.map((item) =>
        String(item.id) === String(updated.appointmentId)
          ? { ...item, parameters: updated.parameters }
          : item
      );
    },
    newAppointment: (state, action) => {
      const newData = action.payload;
      let inserted = false;
      state.appointments = state.appointments.reduce((acc, item) => {
        if (!inserted && item.status === "out") {
          acc.push(newData); // insert new appointment first
          inserted = true;
        }
        acc.push(item);
        return acc;
      }, []);

      if (!inserted) {
        // no "out" found → add at the end
        state.appointments.push(newData);
      }
    },
    updateStatusInAppointment:(state,action)=>{
      const updated =action.payload;
      if(updated.status==='in'){
        let getPreviousInAppointment=state.appointments.find((item)=>item.status === 'in');
        if(getPreviousInAppointment){
          state.appointments=state.appointments.map((item)=>item.id === getPreviousInAppointment.id ? {...item,status:'out'} :item)
        }
        const getCurrentAppointment=state.appointments.find((item)=>String(item.id) === String(updated.id));
        const removeCurrentAppointment=state.appointments.filter((item)=>String(item.id) !== String(updated.id))
        state.appointments = [getCurrentAppointment,...removeCurrentAppointment];
      }
      else if(updated.status === 'out'){
        const getCurrentAppointment=state.appointments.find((item)=>String(item.id) === String(updated.id));
        const removeCurrentAppointment=state.appointments.filter((item)=>String(item.id) !== String(updated.id))
        state.appointments = [...removeCurrentAppointment,getCurrentAppointment];
      }
    },
    setUpdateDocument:(state,action)=>{
      const updated = action.payload;
      state.appointments = state.appointments.map((item) =>
        String(item.id) === String(updated.appointmentId)
          ? { ...item, document: updated.document,documentType:updated.documentType }
          : item
      );
    },
    saveAppointmentPrescription:(state,action)=>{
      const changeData=action.payload
      const data=action.payload.appointmentId;
      state.appointments=state.appointments.map((item)=>
        String(item.id) === String(data) ? {...item,extraFees:changeData.extraFees, status:'out'}:item
      )
    },
    cancelAppointment:(state,action)=>{
       const data=action.payload;
      state.appointments=state.appointments.map((item)=>
        String(item.id) === String(data) ? {...item,status:'cancel'}:item
      )
    },
    rescheduleAppointment:(state,action)=>{
      const isPresent=state.appointments.find((item)=>String(item.id) === String(action.payload.id));
      if(isPresent){
        state.appointments=state.appointments.filter((item)=>String(item.id) !== String(action.payload.id))
      }else{
        let currentDate=new Date().toISOString().split("T")[0];
        if(currentDate === action.payload.date){
          todayAppointmentSlice.caseReducers.newAppointment(state, { payload: action.payload });
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(todayAppointments.pending, (state) => {
        state.appointments = [];
        state.loading = true;
        state.error = "";
      })
      .addCase(todayAppointments.fulfilled, (state, action) => {
        state.appointments = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(todayAppointments.rejected, (state) => {
        state.appointments = [];
        state.loading = false;
        state.error = "";
      })
      .addCase(updateAppointment.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.appointments = state.appointments.map((item) =>
          item.id === action.payload.appointmentId
            ? { ...item, ...action.payload.formData }
            : item
        );
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update appointment";
        toast.error(state.error)
      })
      .addCase(updatePaymentModeInAppointment.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(updatePaymentModeInAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.appointments = state.appointments.map((item) =>
          item.id === action.payload.appointmentId
            ? { ...item, paymentMode: action.payload.paymentMode }
            : item
        );
      })
      .addCase(updatePaymentModeInAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update appointment";
      })
      .addCase(updateToxicityInAppointment.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(updateToxicityInAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      
        state.appointments = state.appointments.map((item) =>
          item.id === action.payload.appointmentId
            ? {
                ...item,
                patient: {
                  ...item.patient,
                  toxicity: !item.patient.toxicity,
                },
              }
            : item
        );
      })
      .addCase(updateToxicityInAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update toxicity";
        toast.error(state.error);
      }).addCase(updateAppointmentStatus.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.appointments = state.appointments.map((item) =>
          item.id === action.payload.appointmentId
            ? { ...item, status: action.payload.status }
            : item
        );
      })
      .addCase(updateAppointmentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update status";
        toast.error(state.error)
      })
      ;
  },
});

export const { updateParameterInAppointment, newAppointment,updateStatusInAppointment,setUpdateDocument,saveAppointmentPrescription,cancelAppointment,rescheduleAppointment} =
  todayAppointmentSlice.actions;
export default todayAppointmentSlice.reducer;
