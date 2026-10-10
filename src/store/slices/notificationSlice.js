import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiClient from "../../api/apiClient";

export const getNotifications = createAsyncThunk(
  "get/notify",
  async ({ page, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/api/notifications?page=${page}&limit=${limit}`);
      if (response.data.success) {
        return response?.data?.data;
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "failed to get notification"
      );
    }
  }
);

export const updateToMarkAsRead = createAsyncThunk(
  "update/markRead",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(
        `/api/notifications/${id}/read`,
        {}
      );
      if (response?.data?.success) {
        return { id };
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "failed to update notification"
      );
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "delete/notify",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/api/notifications/${id}`);
      if (response?.data?.success) {
        return { id };
      }
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "failed to delete notification"
      );
    }
  }
);
export const getNotifyCount=createAsyncThunk("get/notifyCount",async(_,{rejectWithValue})=>{
  try {
    const response=await apiClient.get(`/api/notifications/count`);
    if(response?.data?.success){
      return response.data.data.count;
    }
  } catch (error) {
    return rejectWithValue(
        error?.response?.data?.message || "failed to delete notification"
      );
  }
})

const notificationSlice = createSlice({
  name: "todayAppointments",
  initialState: {
    notifications: [],
    notifyCount:0,
    loading: false,
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    error: null,
  },
  reducers: {
    addNewNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.notifyCount = state.notifyCount + 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data;
        state.currentPage = action.payload.pagination.currentPage;
        state.totalPages = action.payload.pagination.totalPages;
        state.itemsPerPage = action.payload.pagination.itemsPerPage;
        state.error = null;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
        state.notifications = [];
        state.currentPage = 1;
        state.totalPages = 1;
        state.itemsPerPage = 10;
        state.error = action.payload || "";
        toast.error(state.error);
      })
      .addCase(updateToMarkAsRead.pending, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(updateToMarkAsRead.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.notifications = state.notifications.map((item) =>
          item.id === action.payload.id ? { ...item, isRead: true } : item
        );
        state.notifyCount = state.notifyCount > 0 ? state.notifyCount - 1 : 0;
      })
      .addCase(updateToMarkAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Faild to update";
        toast.error(state.error);
      })
      .addCase(deleteNotification.pending, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // find the deleted notification first
        const deleted = state.notifications.find(
          (item) => item.id === action.payload.id
        );
        state.notifications = state.notifications.filter(
          (item) => item.id !== action.payload.id
        );

        // decrement count if it was unread
        if (deleted && !deleted.isRead) {
          state.notifyCount = state.notifyCount > 0 ? state.notifyCount - 1 : 0;
        }
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete notification";
        toast.error(state.error);
      })
      .addCase(getNotifyCount.pending,(state)=>{
        state.loading = true;
        state.error = "";
      }).addCase(getNotifyCount.fulfilled,(state,action)=>{
        state.loading=false;
        state.error=null;
        state.notifyCount=action.payload
      }).addCase(getNotifyCount.rejected,(state,action)=>{
        state.loading = false;
        state.error = action.payload || "Failed to get notification count";
        toast.error(state.error);
      });
  },
});

export const { addNewNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
