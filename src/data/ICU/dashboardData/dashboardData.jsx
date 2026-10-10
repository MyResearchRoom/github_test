import { myImg } from "../../../assets/ICUimages/images";

export const statCards = [
  {
    label: "Total Beds",
    value: "20",
    color: "text-zinc-800",
    image: myImg.total_beds,
  },
  {
    label: "Occupied",
    value: "16",
    color: "text-purple-600",
    image: myImg.beds_occupied,
  },
  {
    label: "Available",
    value: "04",
    color: "text-pink-600",
    image: myImg.available_beds,
  },
  {
    label: "Critical",
    value: "03",
    color: "text-red-600",
    image: myImg.icu_critical,
  },
  {
    label: "Vitals Due",
    value: "05",
    color: "text-orange-600",
    image: myImg.vitals_due,
  },

  {
    label: "Medication Due",
    value: "07",
    color: "text-emerald-600",
    image: myImg.medication_due,
  },
];



export const icuBedData = [
  {
    id: "icu-01",
    bed: "ICU-01",
    patient: "Rahul Sharma",
    age: 62,
    gender: "M",
    uhid: "UHID-2026-001",
    condition: "Critical",
    respiratorySupport: "Mechanical Vent", // 🔴 High Priority
    doctor: "Dr. A. Mehta",
    admissionDate: "11 Sep 2026",
    admissionTime: "08:30",
    status: "Occupied",
  },
  {
    id: "icu-02",
    bed: "ICU-02",
    patient: "Amit Patil",
    age: 55,
    gender: "M",
    uhid: "UHID-2026-002",
    condition: "Stable",
    respiratorySupport: "Room Air", // ⚪ Neutral
    doctor: "Dr. S. Kumar",
    admissionDate: "10 Sep 2026",
    admissionTime: "14:20",
    status: "Occupied",
  },
  {
    id: "icu-04",
    bed: "ICU-04",
    patient: "Priya Nair",
    age: 47,
    gender: "F",
    uhid: "UHID-2026-003",
    condition: "Watch",
    respiratorySupport: "Oxygen (4L/min)", // 🟡 Low-Medium Priority
    doctor: "Dr. A. Mehta",
    admissionDate: "11 Sep 2026",
    admissionTime: "06:45",
    status: "Occupied",
  },
  {
    id: "icu-05",
    bed: "ICU-05",
    patient: "Suresh Iyer",
    age: 71,
    gender: "M",
    uhid: "UHID-2026-004",
    condition: "Critical",
    respiratorySupport: "BiPAP", // 🟠 Medium-High Priority
    doctor: "Dr. R. Patel",
    admissionDate: "09 Sep 2026",
    admissionTime: "22:10",
    status: "Occupied",
  },
  {
    id: "icu-06",
    bed: "ICU-06",
    patient: "Kavitha Rao",
    age: 38,
    gender: "F",
    uhid: "UHID-2026-005",
    condition: "Stable",
    respiratorySupport: "Room Air",
    doctor: "Dr. S. Kumar",
    admissionDate: "08 Sep 2026",
    admissionTime: "11:30",
    status: "Occupied",
  },
  {
    id: "icu-07",
    bed: "ICU-07",
    patient: "Deepa Singh",
    age: 52,
    gender: "F",
    uhid: "UHID-2026-006",
    condition: "Watch",
    respiratorySupport: "High-Flow Nasal Cannula", // 🟠 Medium Priority
    doctor: "Dr. A. Mehta",
    admissionDate: "10 Sep 2026",
    admissionTime: "19:15",
    status: "Isolation",
  },
  {
    id: "icu-08",
    bed: "ICU-08",
    patient: "Mohan Das",
    age: 66,
    gender: "M",
    uhid: "UHID-2026-007",
    condition: "Critical",
    respiratorySupport: "Mechanical Vent", // 🔴 High Priority
    doctor: "Dr. R. Patel",
    admissionDate: "07 Sep 2026",
    admissionTime: "16:40",
    status: "Occupied",
  },
  {
    id: "icu-11",
    bed: "ICU-11",
    patient: "Rajan Verma",
    age: 58,
    gender: "M",
    uhid: "UHID-2026-008",
    condition: "Stable",
    respiratorySupport: "Oxygen (2L/min)",
    doctor: "Dr. S. Kumar",
    admissionDate: "06 Sep 2026",
    admissionTime: "09:10",
    status: "Occupied",
  },
];


export const criticalPatientsData = [
  { patient: "Rahul Sharma", age: 62, gender: "M", bed: "ICU-01", lastVitals: "BP 88/56 | SpO2 91%" },
  { patient: "Suresh Iyer", age: 71, gender: "M", bed: "ICU-05", lastVitals: "BP 90/60 | SpO2 93%" },
  { patient: "Mohan Das", age: 66, gender: "M", bed: "ICU-08", lastVitals: "—" },
];

export const todaysTasksData = [
  { patient: "Rahul Sharma", bed: "ICU-01", task: "Record Vitals", dueTime: "10:00", status: "Overdue" },
  { patient: "Priya Nair", bed: "ICU-04", task: "Medication - Vancomycin", dueTime: "10:00", status: "Pending" },
  { patient: "Suresh Iyer", bed: "ICU-05", task: "Doctor Review", dueTime: "10:30", status: "Pending" },
  { patient: "Mohan Das", bed: "ICU-08", task: "Blood Sample Collection", dueTime: "11:00", status: "Pending" },
  { patient: "Amit Patil", bed: "ICU-02", task: "Dressing Change", dueTime: "12:00", status: "Pending" },
  { patient: "Kavitha Rao", bed: "ICU-06", task: "Nursing Note", dueTime: "14:00", status: "Pending" },
];