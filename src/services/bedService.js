import apiClient from "../api/apiClient";

const cleanParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== "" && value !== undefined && value !== null)
  );

export const bedService = {
  async getBedHierarchy() {
    const response = await apiClient.get("/api/ipd/beds/hierarchy");
    return response.data;
  },

  async getBedStats() {
    const response = await apiClient.get("/api/ipd/beds/stats");
    return response.data;
  },

    async getOccupiedBedPatients() {
    const response = await apiClient.get("/api/ipd/beds/occupied-patients");
    return response.data;
  },

  async createBed(payload) {
    const response = await apiClient.post("/api/ipd/beds", payload);
    return response.data;
  },

  async updateBed(id, payload) {
    const response = await apiClient.put(`/api/ipd/beds/${id}`, payload);
    return response.data;
  },

  async deleteBed(id) {
    const response = await apiClient.delete(`/api/ipd/beds/${id}`);
    return response.data;
  },

  async assignPatient(bedId, patientId) {

    const response = await apiClient.put(`/api/ipd/beds/${bedId}`, {
      status: "occupied",
      patientId,
    });
    return response.data;
  },
};
