import apiClient from "../api/apiClient";

const cleanParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== "" && value !== undefined && value !== null)
  );

export const ipdService = {
  async createAdmission(payload) {
    const response = await apiClient.post("/api/ipd/admissions", payload);
    return response.data;
  },

  async getAdmissions(params) {
    const response = await apiClient.get("/api/ipd/admissions", {
      params: cleanParams(params),
    });
    return response.data;
  },

  async getAdmissionBillingSummary(admissionId) {
    const response = await apiClient.get(`/api/ipd/admissions/${admissionId}/billing-summary`);
    return response.data;
  },

  async getTransferOptions() {
    const response = await apiClient.get("/api/ipd/transfers/options");
    return response.data;
  },

  async transferBed(payload) {
    const response = await apiClient.post("/api/ipd/transfers", payload);
    return response.data;
  },

  async getRecentTransfers(limit) {
    const response = await apiClient.get("/api/ipd/transfers/recent", {
      params: cleanParams({ limit }),
    });
    return response.data;
  },

  async getDischarges(params) {
    const response = await apiClient.get("/api/ipd/discharges", {
      params: cleanParams(params),
    });
    return response.data;
  },

  async createDischarge(payload) {
    const response = await apiClient.post("/api/ipd/discharges", payload);
    return response.data;
  },

  async getInvoices(params) {
    const response = await apiClient.get("/api/ipd/accounts/invoices", {
      params: cleanParams(params),
    });
    return response.data;
  },

  async getInvoiceStats() {
    const response = await apiClient.get("/api/ipd/accounts/stats");
    return response.data;
  },

  async createInvoice(payload) {
    const response = await apiClient.post("/api/ipd/accounts/invoices", payload);
    return response.data;
  },

  async updateInvoice(invoiceNo, payload) {
    const response = await apiClient.put(`/api/ipd/accounts/invoices/${invoiceNo}`, payload);
    return response.data;
  },

  async getInvoice(invoiceNo) {
    const response = await apiClient.get(`/api/ipd/accounts/invoices/${invoiceNo}`);
    return response.data;
  },

  async recordInvoicePayment(invoiceNo, payload) {
    const data = typeof payload === "object" && payload !== null ? payload : { amount: payload };
    const response = await apiClient.patch(
      `/api/ipd/accounts/invoices/${invoiceNo}/payment`,
      data
    );
    return response.data;
  },

  async getSubDoctorById(id) {
    const response = await apiClient.get(`/api/subdoctors/${id}`);
    return response.data;
  },

  async getClinicalSummary(admissionId) {
    const response = await apiClient.get(`/api/ipd/admissions/${admissionId}/clinical-summary`);
    return response.data;
  },

  async addClinicalSummarySection(admissionId, payload) {
    const response = await apiClient.post(
      `/api/ipd/admissions/${admissionId}/clinical-summary`,
      payload
    );
    return response.data;
  },

  async updateClinicalSummarySection(id, payload) {
    const response = await apiClient.put(`/api/ipd/clinical-summary/${id}`, payload);
    return response.data;
  },

  async deleteClinicalSummarySection(id) {
    const response = await apiClient.delete(`/api/ipd/clinical-summary/${id}`);
    return response.data;
  },

  async getDoctors() {
    const response = await apiClient.get("/api/ipd/doctors");
    return response.data;
  },

  async getBedStats() {
    const response = await apiClient.get("/api/ipd/beds/stats");
    return response.data;
  },

  async getWards(params) {
    const response = await apiClient.get("/api/ipd/wards", {
      params: cleanParams(params),
    });
    return response.data;
  },


  async getAccounts(params) {
    const response = await apiClient.get("/api/ipd/account/getAccounts", {
      params: cleanParams(params),
    });
    return response.data;
  },

  async getAccountById(id) {
    const response = await apiClient.get(`/api/ipd/account/getAccount/${id}`);
    return response.data;
  },

  async getPatientsWithAccount() {
    const response = await apiClient.get(`/api/ipd/account/admitted-patients`);
    return response.data;
  },

  async addPatientAccountCharges(payload, id) {
    const response = await apiClient.post(`/api/ipd/account/add-charges/${id}`, payload);
    return response.data;
  },

  async getAccountChargesByAccountId(id) {
    const response = await apiClient.get(`/api/ipd/account/getCharges/${id}`);
    return response.data;
  },

  async getAccountPayments(params) {
    const response = await apiClient.get(`/api/ipd/account/getPayments`, {
      params: cleanParams(params),
    });
    return response.data;
  },

  async addPatientAccountPayments(id, payload) {
    const response = await apiClient.post(`/api/ipd/account/add-payment/${id}`, payload);
    return response.data;
  },

  async updatePatientAccountPayment(accountId, id, payload) {
    const response = await apiClient.patch(`/api/ipd/account/edit-payment/${accountId}/${id}`, payload);
    return response.data;
  },

  async getDetailsForPrint(accountId, patientId, paymentId) {
    const response = await apiClient.get(`/api/ipd/account/getPayments/${accountId}/${patientId}/${paymentId}`);
    return response.data;
  },

  async getDischargeDetails(admissionId, dischargeId) {
    const response = await apiClient.get(`/api/ipd/discharge/details/${dischargeId}/${admissionId}`);
    return response.data;
  },

  async completeDischarge(dischargeId) {
    const response = await apiClient.patch(`/api/ipd/complete-discharge/${dischargeId}`);
    return response.data;
  },

  async getAccountPaymentsByAdmissionId(admissionId) {
    const response = await apiClient.get(`/api/ipd/account/payments/admission/${admissionId}`);
    return response.data;
  },

};
