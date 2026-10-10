import React from "react";

const IPDDashboard = React.lazy(() => import("./IPDDashboard"));
const AdmitPatient = React.lazy(() => import("./AdmitPatient"));
const AdmittedPatientsList = React.lazy(() =>
  import("./AdmittedPatientsList")
);
const WardManagement = React.lazy(() => import("./WardManagement"));
const RoomManagement = React.lazy(() => import("./RoomManagement"));
const BedManagement = React.lazy(() => import("./BedManagement"));
const BedTransfer = React.lazy(() => import("./BedTransfer"));
const DischargeSummary = React.lazy(() => import("./DischargeSummary"));
const Accounts = React.lazy(() => import("./Accounts"));
const InvoiceDetails = React.lazy(() => import("./InvoiceDetails"));
const PatientDetails = React.lazy(() => import("./PatientDetails"));
const Payments = React.lazy(() => import("./Payments"));

const BirthCertificateForm = React.lazy(() => import("./BirthCertificateForm"));





export {
  IPDDashboard,
  AdmitPatient,
  AdmittedPatientsList,
  WardManagement,
  RoomManagement,
  BedManagement,
  BedTransfer,
  DischargeSummary,
  Accounts,
  InvoiceDetails,
  PatientDetails,
  Payments,
  BirthCertificateForm
};
