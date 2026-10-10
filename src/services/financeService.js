import apiClient from "../api/apiClient";

const unwrapError = (error, fallback) => {
  const errors = error?.response?.data?.errors;
  if (Array.isArray(errors) && errors.length > 0) throw errors;
  throw new Error(error?.response?.data?.message || error?.response?.data?.error || fallback);
};

export const financeService = {
  getOverview: async () => {
    try {
      const response = await apiClient.get("/api/finance/overview");
      return response?.data;
    } catch (error) {
      unwrapError(error, "Failed to load finance details");
    }
  },

  getPlans: async () => {
    try {
      const response = await apiClient.get("/api/finance/plans");
      return response?.data;
    } catch (error) {
      unwrapError(error, "Failed to load plans");
    }
  },

  getPlanById: async (planVersionId) => {
    try {
      const response = await apiClient.get(`/api/finance/plans/${planVersionId}`);
      return response?.data;
    } catch (error) {
      unwrapError(error, "Failed to load plan");
    }
  },

  getPlanHistory: async () => {
    try {
      const response = await apiClient.get("/api/finance/plans/history");
      return response?.data;
    } catch (error) {
      unwrapError(error, "Failed to load billing history");
    }
  },

  changePlan: async (payload) => {
    try {
      const response = await apiClient.patch("/api/finance/change-plan", payload);
      return response?.data;
    } catch (error) {
      unwrapError(error, "Failed to change plan");
    }
  },

  extendPlan: async (payload) => {
    try {
      const response = await apiClient.patch("/api/finance/extend-plan", payload);
      return response?.data;
    } catch (error) {
      unwrapError(error, "Failed to extend plan");
    }
  },
};
