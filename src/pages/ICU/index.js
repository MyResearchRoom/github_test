import React from "react";

const ICUDashboard = React.lazy(() => import("./ICUDashboard"));
const ICUAdmission = React.lazy(() => import("./ICUAdmission"));
const ICUAdmissionDetails = React.lazy(() => import("./ICUAdmissionDetails"));
const ICUAdminPanel = React.lazy(() => import("./ICUAdminPanel"));
const ICUVitals = React.lazy(() => import("./ICUVitals"));
const ICUDoctorNotes = React.lazy(() => import("./ICUDoctorNote"));
const ICUNursingNotes = React.lazy(() => import("./ICUNursingNote"));
const ICUMedication = React.lazy(() => import("./ICUMedication"));
const ICUCarePlan = React.lazy(() => import("./ICUCarePlan"));
const ICUIntakeOutput = React.lazy(() => import("./ICUIntakeOutput"));
const ICUInvestigation = React.lazy(() => import("./ICUInvestigation"));
const ICUProcedure = React.lazy(() => import("./ICUProcedure"));
const ICUDischargeTransfer = React.lazy(() => import("./ICUDischargeTransfer"));
const ICUHandover = React.lazy(() => import("./ICUHandover"));
const ICUReport = React.lazy(() => import("./ICUReports"));





export {
  ICUDashboard, ICUAdmission, ICUAdmissionDetails, ICUAdminPanel, ICUVitals, ICUDoctorNotes, ICUNursingNotes, ICUMedication, 
  ICUCarePlan, ICUIntakeOutput, ICUInvestigation, ICUProcedure, ICUDischargeTransfer, ICUHandover, ICUReport, 
}