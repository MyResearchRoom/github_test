import apiClient from "../api/apiClient";

const cleanParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== "" && value !== undefined && value !== null)
  );

export const roomService = {
  async getRooms(params) {
    const response = await apiClient.get("/api/ipd/rooms", {
      params: cleanParams(params),
    });
    return response.data;
  },

  async getRoomStats() {
    const response = await apiClient.get("/api/ipd/rooms/stats");
    return response.data;
  },

  async createRoom(payload) {
    const response = await apiClient.post("/api/ipd/rooms", payload);
    return response.data;
  },

  async updateRoom(id, payload) {
    const response = await apiClient.put(`/api/ipd/rooms/${id}`, payload);
    return response.data;
  },

  async deleteRoom(id) {
    const response = await apiClient.delete(`/api/ipd/rooms/${id}`);
    return response.data;
  },
};