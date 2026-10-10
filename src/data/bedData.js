export const bedStats = [
  {
    heading: "Total Beds",
    value: 156,
    subtext: "All beds",
    color: "#F3E8FF",
  },
  {
    heading: "Occupied Beds",
    value: 114,
    subtext: "73.08% occupied",
    color: "#DCFCE7",
  },
  {
    heading: "Available Beds",
    value: 42,
    subtext: "26.92% available",
    color: "#E0F2FE",
  },
  {
    heading: "Under Maintenance",
    value: 6,
    subtext: "3.85% of total beds",
    color: "#FFEDD5",
  },
];

export const wardFilterOptions = ["All Wards", "General Ward", "ICU", "Post-Surgery"];
export const roomFilterOptions = ["All Rooms", "101", "201", "301"];
export const bedTypeFilterOptions = ["All Bed Types", "General", "Semi-Fowler", "Single (ICU)"];
export const statusFilterOptions = ["All Status", "Available", "Occupied", "Maintenance", "Discharged"];

// Hierarchy: Ward -> Room -> Beds
export const bedHierarchy = [
  {
    wardId: 1,
    wardName: "General Ward",
    roomNumber: "101",
    capacity: 6,
    defaultExpanded: true,
    beds: [
      {
        bedCode: "101-01",
        status: "available",
        bedType: "General",
      },
      {
        bedCode: "101-02",
        status: "occupied",
        bedType: "General",
        patient: { name: "Rahul Sharma", mrn: "10234" },
      },
      {
        bedCode: "101-03",
        status: "occupied",
        bedType: "General",
        patient: { name: "Anita Verma", mrn: "10567" },
      },
      {
        bedCode: "101-04",
        status: "maintenance",
        bedType: "General",
      },
      {
        bedCode: "101-05",
        status: "available",
        bedType: "General",
      },
      {
        bedCode: "101-06",
        status: "available",
        bedType: "General",
      },
    ],
  },
  {
    wardId: 2,
    wardName: "ICU",
    roomNumber: "201",
    capacity: 4,
    defaultExpanded: false,
    beds: [
      {
        bedCode: "201-01",
        status: "occupied",
        bedType: "Single (ICU)",
        patient: { name: "Manoj Rathi", mrn: "10890" },
      },
      {
        bedCode: "201-02",
        status: "available",
        bedType: "Single (ICU)",
      },
      {
        bedCode: "201-03",
        status: "occupied",
        bedType: "Single (ICU)",
        patient: { name: "Divya Nair", mrn: "10921" },
      },
      {
        bedCode: "201-04",
        status: "maintenance",
        bedType: "Single (ICU)",
      },
    ],
  },
  {
    wardId: 3,
    wardName: "Post-Surgery",
    roomNumber: "301",
    capacity: 6,
    defaultExpanded: true,
    beds: [
      {
        bedCode: "301-01",
        status: "occupied",
        bedType: "Semi-Fowler",
        patient: { name: "Suresh Patil", mrn: "11223" },
      },
      {
        bedCode: "301-02",
        status: "available",
        bedType: "Semi-Fowler",
      },
      {
        bedCode: "301-03",
        status: "occupied",
        bedType: "Semi-Fowler",
        patient: { name: "Neha Singh", mrn: "11550" },
      },
      {
        bedCode: "301-04",
        status: "maintenance",
        bedType: "Semi-Fowler",
      },
      {
        bedCode: "301-05",
        status: "available",
        bedType: "Semi-Fowler",
      },
      {
        bedCode: "301-06",
        status: "occupied",
        bedType: "Semi-Fowler",
        patient: { name: "Vikram Rao", mrn: "11990" },
      },
    ],
  },
];