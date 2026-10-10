import apiClient from "../api/apiClient";

const cleanParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== "" && value !== undefined && value !== null)
  );

export const wardService = {
  async getWards(params) {
    const response = await apiClient.get("/api/ipd/wards", {
      params: cleanParams(params),
    });
    return response.data;
  },

  async getWardStats() {
    const response = await apiClient.get("/api/ipd/wards/stats");
    return response.data;
  },

  async createWard(payload) {
    const response = await apiClient.post("/api/ipd/wards", payload);
    return response.data;
  },

  async updateWard(id, payload) {
    const response = await apiClient.put(`/api/ipd/wards/${id}`, payload);
    return response.data;
  },

  async deleteWard(id) {
    const response = await apiClient.delete(`/api/ipd/wards/${id}`);
    return response.data;
  },
};