export const currentBedDetails = {
  ward: "General Ward",
  room: "Room 101",
  bed: "101-02",
  patient: {
    name: "Rahul Sharma",
    mrn: "10234",
    gender: "Male",
    age: 35,
    admittedOn: "12 May 2025",
    diagnosis: "Dengue Fever",
  },
};

export const wardOptions = ["General Ward", "ICU", "Post-Surgery", "Pediatrics"];
export const roomOptionsByWard = {
  "General Ward": ["Room 101", "Room 102", "Room 103"],
  ICU: ["ICU - 201", "ICU - 202"],
  "Post-Surgery": ["Room 301", "Room 302"],
  Pediatrics: ["Room 401"],
};
export const bedOptionsByRoom = {
  "Room 101": ["101-01", "101-02", "101-03"],
  "Room 102": ["102-01", "102-02"],
  "Room 103": ["103-01", "103-02", "103-03"],
  "ICU - 201": ["201-01", "201-02", "201-03"],
  "ICU - 202": ["202-01"],
  "Room 301": ["301-01", "301-02"],
  "Room 302": ["302-01", "302-02", "302-03"],
  "Room 401": ["401-01"],
};

export const newBedAvailability = {
  bedCode: "201-03",
  bedType: "ICU",
  status: "Available",
};

export const transferSummary = {
  from: {
    ward: "General Ward",
    room: "Room 101",
    bed: "Bed 101-02",
  },
  to: {
    ward: "ICU",
    room: "Room 201",
    bed: "Bed 201-03",
  },
  patient: {
    name: "Rahul Sharma",
    mrn: "10234",
    gender: "Male",
    age: 35,
  },
  reason: "Patient requires intensive monitoring and ventilator support.",
};

export const recentTransfers = [
  {
    id: 1,
    patient: "Anita Verma",
    mrn: "10234",
    fromBed: "101-01",
    toBed: "201-02",
    dateTime: "12 May 2025, 10:30 AM",
    status: "Completed",
  },
  {
    id: 2,
    patient: "Suresh Patil",
    mrn: "11223",
    fromBed: "301-02",
    toBed: "301-05",
    dateTime: "11 May 2025, 04:15 PM",
    status: "Completed",
  },
  {
    id: 3,
    patient: "Neha Singh",
    mrn: "11550",
    fromBed: "101-03",
    toBed: "201-01",
    dateTime: "11 May 2025, 11:45 AM",
    status: "Completed",
  },
  {
    id: 4,
    patient: "Vikram Rao",
    mrn: "11990",
    fromBed: "302-01",
    toBed: "302-03",
    dateTime: "10 May 2025, 09:20 AM",
    status: "Completed",
  },
];