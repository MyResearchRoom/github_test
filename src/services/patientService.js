import apiClient from "../api/apiClient";

export const patientService = {
  async getPatientsForAppointment(searchTerm) {
    const response = await apiClient.get("/api/patients/get-patients-for-appointment", {
      params: searchTerm ? { searchTerm } : {},
    });
    return response.data;
  },

  async getPatientsById(id) {
    const response = await apiClient.get(`/api/patients/getPatientById/${id}`);
    return response.data;
  },

  async addPatientDocument(payload,patientId,admissionId) {
      const response = await apiClient.post(`/api/patients/addDocuments/${patientId}/${admissionId}`, payload);
      return response.data;
  },

  async getPatientDocuments(patientId, admissionId,documentType) {
      const response = await apiClient.get(`/api/patients/documents/${patientId}/${admissionId}`,
      {
        params: documentType ? { documentType } : {},
      });
      return response.data;
  },

  async createBirthCertificate(payload){
    const response = await apiClient.post(`/api/patients/birth-certificates`, payload);
      return response.data;
  },

  async updateBirthCertificate(payload,certificateId){
    const response = await apiClient.patch(`/api/patients/birth-certificates/${certificateId}`, payload);
      return response.data;
  },

  async getBirthCertificate(motherPatientId) {
      const response = await apiClient.get(`/api/patients/birth-certificates/${motherPatientId}`);
      return response.data;
  },
};