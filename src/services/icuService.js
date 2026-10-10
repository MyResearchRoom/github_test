import apiClient from "../api/apiClient";

const cleanParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== "" && value !== undefined && value !== null)
  );

export const icuService = {

  async tranferIPDToICU(payload) {
    const response = await apiClient.post("/api/icu/admission/create-admissions", payload);
    return response.data;
  },

  async Admit(payload) {
    const response = await apiClient.post("/api/icu/admission/admit", payload);
    return response.data;
  },

  async getVitals(params) {
    const response = await apiClient.get("/api/vitals/getvitals", {
      params: cleanParams(params),
    });
    return response.data;
  },

  async addvitals(payload) {
    const response = await apiClient.post(`/api/vitals/add-vitals`, payload);
    return response.data;
  },

  async getLatestVitals(params = {}) {
    const response = await apiClient.get("/api/vitals/getLatestVitals", {
      params: cleanParams(params),
    });

    return response.data;
  },

  async getInputOutput(params) {
    const response = await apiClient.get("/api/intakeOutput/getIntakeOutput", {
      params: cleanParams(params),
    });
    return response.data;
  },

   async getLatestInputOutput(params) {
    const response = await apiClient.get("/api/intakeOutput/getLatest", {
      params: cleanParams(params),
    });

    return response.data;
  },  


  async addInputOutput(payload) {
    const response = await apiClient.post(`/api/intakeOutput/add-intakeOutput`, payload);
    return response.data;
  },

  async getAdmissions(params) {
    const response = await apiClient.get("/api/icu/admission/getAdmissions", {
      params: cleanParams(params),
    });
    return response.data;
  },

  async getAdmissionDetailsByPatientid(patientId) {
    const response = await apiClient.get(`/api/icu/admission/admissions/patient/${patientId}`);
    return response.data;
  },

  async getDoctorNotes(patientId, icuAdmissionId, noteDate) {
    const response = await apiClient.get("/api/icuNote/getDoctorNotes", {
      params: cleanParams({ patientId, icuAdmissionId, noteDate }),
    });
    return response.data;
  },

  async addDoctorNote(payload) {
    const response = await apiClient.post("/api/icuNote/add-note", payload);
    return response.data;
  },

  async getMedications(patientId, icuAdmissionId, startDate) {
    const response = await apiClient.get(`/api/icuMedications/getPatientMedications/${patientId}/${icuAdmissionId}`, {
      params: cleanParams({ startDate }),
    });
    return response.data;
  },

  async addMedications(payload) {
    const response = await apiClient.post("/api/icuMedications/add-medication", payload);
    return response.data;
  },

  async getLatestMedications(params = {}) {
    const response = await apiClient.get("/api/icuMedications/getLatestMedications", {
      params: cleanParams(params),
    });
    return response.data;
  },

  async getCarePlans(patientId, icuAdmissionId, startDate) {
    const response = await apiClient.get(`/api/icuCarePlan/getPatientCarePlans/${patientId}/${icuAdmissionId}`, {
      params: cleanParams({ startDate }),
    });
    return response.data;
  },

  async addCarePlans(payload) {
    const response = await apiClient.post("/api/icuCarePlan/add-carePlan", payload);
    return response.data;
  },

  async getNurseData() {
    const response = await apiClient.get("/api/receptionists/getNurseData");
    return response.data;
  },

  async getLatestNursingNote(params = {}) {
    const response = await apiClient.get(
      "/api/icuNursingNote/getLatestNursingNote",
      {
        params: cleanParams(params),
      }
    );

    return response.data;
  },

  async getNursingNotes(patientId, icuAdmissionId, searchTerm, noteDate) {
    const response = await apiClient.get(
      "/api/icuNursingNote/getNursingNotes",
      {
        params: cleanParams({
          patientId,
          icuAdmissionId,
          searchTerm,
          noteDate,
        }),
      }
    );
    return response.data;
  },

  async addNursingNote(payload) {
    const response = await apiClient.post("/api/icuNursingNote/add-note", payload);
    return response.data;
  },

  async getInvestigations(patientId, icuAdmissionId, date, searchTerm) {
    const response = await apiClient.get("/api/icuInvestigations/getInvestigations", {
      params: cleanParams({ patientId, icuAdmissionId, date, searchTerm }),
    });
    return response.data;
  },

  async addInvestigations(payload) {
    const response = await apiClient.post("/api/icuInvestigations/add-investigation", payload);
    return response.data;
  },


  async getProcedure(date, icuAdmissionId, patientId, searchTerm) {
    const response = await apiClient.get("/api/icuProcedure/getProcedures", {
      params: cleanParams({ patientId, icuAdmissionId, date, searchTerm }),
    });
    return response.data;
  },

  async addProcedure(payload) {
    const response = await apiClient.post("/api/icuProcedure/add-Procedure", payload);
    return response.data;
  },

  async getProcedureById(id) {
    const response = await apiClient.get(`/api/icuProcedure/proceduresById/${id}`);
    return response.data;
  },

  async getLatestDoctorNotes() {
    const response = await apiClient.get(`/api/icuNote/getLatestDoctorNotes`);
    return response.data;
  },

  async getLatestCarePlans(searchTerm, startDate) {
    const response = await apiClient.get(`/api/icuCarePlan/getLatestCarePlans`,
      {
        params: { searchTerm, startDate, },
      }
    );
    return response.data;
  },

  async getICUBeds(params = {}) {
    const response = await apiClient.get("/api/ipd/beds/getICUBeds", {
      params: cleanParams(params),
    });
    return response.data;
  },

}