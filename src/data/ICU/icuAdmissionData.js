export const patients = [
  { id: "p-01", name: "Rahul Sharma", bed: "ICU-01" },
  { id: "p-02", name: "Amit Patil", bed: "ICU-02" },
  { id: "p-03", name: "Priya Nair", bed: "ICU-04" },
  { id: "p-04", name: "Suresh Iyer", bed: "ICU-05" },
  { id: "p-05", name: "Kavitha Rao", bed: "ICU-06" },
  { id: "p-06", name: "Mohan Das", bed: "ICU-07" },
];

export const icuUnits = [
  {
    id: "medical-icu-b",
    name: "Medical ICU - Block B",
    beds: [
      { bed: "ICU-01", status: "Occupied" },
      { bed: "ICU-02", status: "Occupied" },
      { bed: "ICU-03", status: "Available" },
      { bed: "ICU-04", status: "Occupied" },
      { bed: "ICU-05", status: "Occupied" },
      { bed: "ICU-06", status: "Occupied" },
      { bed: "ICU-07", status: "Occupied" },
      { bed: "ICU-08", status: "Occupied" },
      { bed: "ICU-09", status: "Available" },
      { bed: "ICU-10", status: "Available" },
    ],
  },
  {
    id: "surgical-icu-c",
    name: "Surgical ICU - Block C",
    beds: [
      { bed: "ICU-11", status: "Occupied" },
      { bed: "ICU-12", status: "Occupied" },
      { bed: "ICU-13", status: "Occupied" },
      { bed: "ICU-14", status: "Occupied" },
      { bed: "ICU-15", status: "Occupied" },
      { bed: "ICU-16", status: "Occupied" },
      { bed: "ICU-17", status: "Occupied" },
      { bed: "ICU-18", status: "Occupied" },
      { bed: "ICU-19", status: "Available" },
      { bed: "ICU-20", status: "Occupied" },
    ],
  },
];









export const icuAdmissionDataPatient = [
  {
    id: "ICU-ADM-001",
    patientId: "P-1001",
    name: "Rahul Sharma",
    age: 58,
    gender: "Male",
    phone: "+91 98765 43210",
    uhid: "UHID-2026-001",
    mrn: "MRN-1001",

    admissionType: "Direct Admission",
    admissionDate: "22 Sep 2026",
    admissionTime: "10:30 AM",

    icuUnit: "ICU - 1",
    bedNumber: "ICU-01",
    bedType: "Ventilator",

    referringDoctor: "Dr. Amit Kulkarni",
    consultingDoctor: "Dr. V. Mehta",

    diagnosis: "Acute Respiratory Failure",
    initialCondition: "Critical",

    isolationRequired: "No",
    isolationType: "",

    status: "admitted",

    notes: "Patient admitted with respiratory distress and low oxygen saturation.",
  },

  {
    id: "ICU-ADM-002",
    patientId: "P-1002",
    name: "Priya Deshmukh",
    age: 46,
    gender: "Female",
    phone: "+91 98234 56120",
    uhid: "UHID-2026-002",
    mrn: "MRN-1002",

    admissionType: "Emergency Admission",
    admissionDate: "22 Sep 2026",
    admissionTime: "08:15 AM",

    icuUnit: "ICU - 1",
    bedNumber: "ICU-02",
    bedType: "Standard",

    referringDoctor: "Dr. Neha Patil",
    consultingDoctor: "Dr. S. Joshi",

    diagnosis: "Severe Pneumonia",
    initialCondition: "Watch",

    isolationRequired: "Yes",
    isolationType: "Respiratory Isolation",

    status: "admitted",

    notes: "Under close monitoring due to respiratory infection.",
  },

  {
    id: "ICU-ADM-003",
    patientId: "P-1003",
    name: "Suresh Patil",
    age: 67,
    gender: "Male",
    phone: "+91 97654 32109",
    uhid: "UHID-2026-003",
    mrn: "MRN-1003",

    admissionType: "Transfer from IPD",
    admissionDate: "21 Sep 2026",
    admissionTime: "06:45 PM",

    icuUnit: "ICU - 1",
    bedNumber: "ICU-03",
    bedType: "Ventilator",

    referringDoctor: "Dr. R. Deshpande",
    consultingDoctor: "Dr. V. Mehta",

    diagnosis: "Acute Myocardial Infarction",
    initialCondition: "Critical",

    isolationRequired: "No",
    isolationType: "",

    status: "admitted",

    notes: "Transferred from IPD following acute cardiac deterioration.",
  },

  {
    id: "ICU-ADM-004",
    patientId: "P-1004",
    name: "Anita Joshi",
    age: 52,
    gender: "Female",
    phone: "+91 98987 12345",
    uhid: "UHID-2026-004",
    mrn: "MRN-1004",

    admissionType: "Emergency Admission",
    admissionDate: "20 Sep 2026",
    admissionTime: "11:20 AM",

    icuUnit: "ICU - 2",
    bedNumber: "ICU-04",
    bedType: "Isolation",

    referringDoctor: "Dr. P. Shah",
    consultingDoctor: "Dr. Neha Patil",

    diagnosis: "Sepsis",
    initialCondition: "Critical",

    isolationRequired: "Yes",
    isolationType: "Contact Isolation",

    status: "admitted",

    notes: "Patient requires continuous hemodynamic monitoring.",
  },

  {
    id: "ICU-ADM-005",
    patientId: "P-1005",
    name: "Vijay More",
    age: 61,
    gender: "Male",
    phone: "+91 98123 45678",
    uhid: "UHID-2026-005",
    mrn: "MRN-1005",

    admissionType: "Direct Admission",
    admissionDate: "19 Sep 2026",
    admissionTime: "03:40 PM",

    icuUnit: "ICU - 2",
    bedNumber: "ICU-05",
    bedType: "Standard",

    referringDoctor: "Dr. Amit Kulkarni",
    consultingDoctor: "Dr. S. Joshi",

    diagnosis: "Post Operative Monitoring",
    initialCondition: "Stable",

    isolationRequired: "No",
    isolationType: "",

    status: "admitted",

    notes: "Post-operative patient kept under ICU observation.",
  },

  {
    id: "ICU-ADM-006",
    patientId: "P-1006",
    name: "Meena Pawar",
    age: 43,
    gender: "Female",
    phone: "+91 97531 86420",
    uhid: "UHID-2026-006",
    mrn: "MRN-1006",

    admissionType: "Transfer from IPD",
    admissionDate: "18 Sep 2026",
    admissionTime: "09:10 PM",

    icuUnit: "ICU - 2",
    bedNumber: "ICU-06",
    bedType: "Isolation",

    referringDoctor: "Dr. S. Joshi",
    consultingDoctor: "Dr. Neha Patil",

    diagnosis: "Severe Asthma Exacerbation",
    initialCondition: "Watch",

    isolationRequired: "No",
    isolationType: "",

    status: "admitted",

    notes: "Patient shifted from IPD due to worsening respiratory symptoms.",
  },

  {
    id: "ICU-ADM-007",
    patientId: "P-1007",
    name: "Mahesh Shinde",
    age: 72,
    gender: "Male",
    phone: "+91 98654 12390",
    uhid: "UHID-2026-007",
    mrn: "MRN-1007",

    admissionType: "Emergency Admission",
    admissionDate: "17 Sep 2026",
    admissionTime: "02:30 PM",

    icuUnit: "ICU - 1",
    bedNumber: "ICU-07",
    bedType: "Ventilator",

    referringDoctor: "Dr. R. Deshpande",
    consultingDoctor: "Dr. V. Mehta",

    diagnosis: "Septic Shock",
    initialCondition: "Critical",

    isolationRequired: "No",
    isolationType: "",

    status: "discharged",

    notes: "Patient improved after ICU treatment and was shifted to ward.",
  },
];



export const mockVitals = [
  { recordedAtTime: "08:00 AM", recordedAtDate: "29-09-2026", temperature: 101.4, pulse: 112, systolicBP: 88, diastolicBP: 56, spo2: 91, bsl: 186, respiratoryRate: 26, notes: "", recordedby: "Neha Gupta", status: "Critical" },
  { recordedAtTime: "09:00 AM", recordedAtDate: "29-09-2026", temperature: 101.3, pulse: 104, systolicBP: 92, diastolicBP: 60, spo2: 93, bsl: 154, respiratoryRate: 22, notes: "", recordedby: "Ragini Sharma", status: "Abnormal" },
  { recordedAtTime: "10:00 AM", recordedAtDate: "29-09-2026", temperature: 100.0, pulse: 96, systolicBP: 108, diastolicBP: 68, spo2: 96, bsl: 118, respiratoryRate: 18, notes: "", recordedby: "Ananya Sharma", status: "Normal" },
];

export const mockDoctorNotes = [
  { recordedAtTime: "08:00 AM", recordedAtDate: "29-09-2026", chiefComplaint: "Worsening hypoxia, increased work of breathing", clinicalFindings: "SpO2 91% on 10L O2 mask. Bilateral crepitations. BP 88/56 mmHg.", diagnosis: "Acute Respiratory Failure with septic shock", treatmentPlan: "Continue IV antibiotics. Increase vasopressor support. Consider NIV.", doctorAdvice: "Strict fluid balance monitoring. Repeat ABG in 4 hours.", notes: "Family counselled regarding condition.", doctor: "Dr. A. Mehta" },
  { recordedAtTime: "08:00 AM", recordedAtDate: "29-09-2026", chiefComplaint: "Fever spike 39.2°C", clinicalFindings: "Elevated WBC 18,000. Blood cultures sent.", diagnosis: "Septic Shock - source under investigation", treatmentPlan: "Broad spectrum antibiotics initiated. IV fluids 30ml/kg bolus.", doctorAdvice: "Monitor urine output hourly.", notes: "Procalcitonin pending.", doctor: "Dr. A. Mehta" },
];


export const mockNursingNotes = [
  {
    recordedAtDate: "2026-09-03",
    recordedAtTime: "08:30",
    patientCondition: "Restless, requiring frequent reassurance",
    observations: "Catheter intact, urine output 20ml/hr (low). IV sites patent.",
    nursingIntervention: "Repositioned patient. Oral care done. Pressure ulcer check completed.",
    patientResponse: "Settled after repositioning. Urine output marginally improved.",
    additionalNotes: "Continue hourly urine output monitoring.",
    nurse: "Staff Nurse Meena Rao",
  },
];

export const mockIntakeOutput = [
  { date: "2026-09-03", time: "07:00", category: "Intake", type: "IV Fluids (NS)", quantity: 250, remarks: "Running at 125ml/hr" },
  { date: "2026-09-03", time: "07:00", category: "Output", type: "Urine (Catheter)", quantity: 20, remarks: "Low output, monitoring" },
  { date: "2026-09-03", time: "08:00", category: "Intake", type: "Norepinephrine Infusion", quantity: 50, remarks: "Vasopressor" },
  { date: "2026-09-03", time: "08:00", category: "Output", type: "Urine (Catheter)", quantity: 25, remarks: "" },
];

export const mockInvestigations = [
  {
    id: "inv-01",
    patientId: "P-1001",
    patient: "Rahul Sharma",
    investigationName: "Complete Blood Count",
    investigationDate: "03 Sep 2026",
    result: "WBC: 14,500 | Hb: 9.2 | Plt: 88,000 | hsb: 88,000 | rbc: 88,000",
    document: "CBC_Report.pdf",
  },
  {
    id: "inv-02",
    patientId: "P-1001",
    patient: "Rahul Sharma",
    investigationName: "ABG",
    investigationDate: "03 Sep 2026",
    result: "pH: 7.31 | PaCO2: 48 | PaO2: 72",
    document: "ABG_Report.pdf",
  },
  {
    id: "inv-03",
    patientId: "P-1001",
    patient: "Rahul Sharma",
    investigationName: "Electrolytes",
    investigationDate: "03 Sep 2026",
    result: "Na: 132 | K: 3.1 | Cl: 98",
    document: "Electrolytes_Report.pdf",
  },
  {
    id: "inv-04",
    patientId: "P-1001",
    patient: "Rahul Sharma",
    investigationName: "Chest X-Ray",
    investigationDate: "02 Sep 2026",
    result: "Bilateral infiltrates",
    document: "Chest_XRay.jpg",
  },
];

export const initialProcedures = [
  {
    id: "proc-01",
    patientId: "p-01",
    patient: "Rahul Sharma",
    procedureName: "Central Line Insertion (R. IJV)",
    procedureDate: "28 Aug 2026",
    procedureTime: "14:30",
    preProcedureNotes:
      "Patient explained about the procedure. Consent obtained.",
    indication:
      "Vasopressor administration, CVP monitoring",
    details:
      "Right Internal Jugular Vein cannulated. Triple lumen. Confirmed on X-Ray.",
    complications: "No",
    postProcedureCondition:
      "Stable, line functioning",
  },
  {
    id: "proc-02",
    patientId: "p-04",
    patient: "Suresh Iyer",
    procedureName: "Urinary Catheterization",
    procedureDate: "02 Sep 2026",
    procedureTime: "11:00",
    preProcedureNotes:
      "Procedure explained to patient.",
    indication:
      "Strict urine output monitoring",
    details:
      "16F Foley catheter inserted. Clear urine draining.",
    complications: "No",
    postProcedureCondition:
      "Comfortable",
  },

  {
    id: "proc-03",
    patientId: "p-01",
    patient: "Rahul Sharma",
    procedureName: "Arterial Line Insertion",
    procedureDate: "05 Sep 2026",
    procedureTime: "16:15",
    preProcedureNotes:
      "Procedure explained and consent confirmed.",
    indication:
      "Continuous invasive blood pressure monitoring",
    details:
      "Left radial artery cannulated successfully using sterile technique.",
    complications: "No",
    postProcedureCondition:
      "Stable, arterial line functioning well",
  },
];


export const initialCarePlansData = [
  {
    id: "care-01",
    icuAdmissionId: "adm-001",
    patientId: "P-1001",
    problem: "Risk of Infection",
    goal: "Prevent hospital-acquired infection",
    intervention: "Strict hand hygiene, IV site care, daily line review",
    frequency: "Every shift",
    assignedNurseId: "nurse-001",
    startDate: "28 Aug 2026",
    status: "ACTIVE",
    reviewDate: "05 Sep 2026",
  },
  {
    id: "care-02",
    icuAdmissionId: "adm-001",
    patientId: "P-1001",
    problem: "Impaired Gas Exchange",
    goal: "Maintain SpO2 > 95%",
    intervention: "Oxygen therapy, positioning, regular suctioning",
    frequency: "2 hourly",
    assignedNurseId: "nurse-002",
    startDate: "28 Aug 2026",
    status: "INPROCESS",
    reviewDate: "05 Sep 2026",
  },
  {
    id: "care-03",
    icuAdmissionId: "adm-002",
    patientId: "P-1002",
    problem: "Pain Management",
    goal: "Pain score < 3",
    intervention: "Analgesic as charted, positioning, reassurance",
    frequency: "4 hourly",
    assignedNurseId: "nurse-001",
    startDate: "30 Aug 2026",
    status: "COMPLETED",
    reviewDate: "07 Sep 2026",
  },
];