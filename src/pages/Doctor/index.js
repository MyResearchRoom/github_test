import React from "react";

const DoctorAppointment = React.lazy(() => import("./DoctorAppointment"));
const DoctorDashboard = React.lazy(() => import("./DoctorDashboard"));
const DoctorReports = React.lazy(() => import("./DoctorReports"));
const DoctorSetting = React.lazy(() => import("./DoctorSetting"));
const Patients = React.lazy(() => import("./Patients"));
const ReceptionistPage = React.lazy(() => import("./Receptionist"));
const DoctorManagement=React.lazy(()=>import("./DoctorManagement"))
const Finance = React.lazy(() => import("./Finance"));
const FinanceBillingHistory = React.lazy(() => import("./FinanceBillingHistory"));
const FinanceChangePlan = React.lazy(() => import("./FinanceChangePlan"));
const FinanceExtendPlan = React.lazy(() => import("./FinanceExtendPlan"));

export {
  DoctorAppointment,
  DoctorDashboard,
  DoctorReports,
  DoctorSetting,
  Patients,
  ReceptionistPage,
  DoctorManagement,
  Finance,
  FinanceBillingHistory,
  FinanceChangePlan,
  FinanceExtendPlan,
}
