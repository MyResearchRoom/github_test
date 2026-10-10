  import { Suspense, useCallback, useEffect, useState } from "react";
  import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
  import Sidebar from "./commonComponent/Sidebar";
  import Header from "./commonComponent/Header";
  import { Dashboard, Appointment, Scanner } from "./pages/Receptionist/index";

  import {
    DoctorAppointment,
    DoctorDashboard,
    DoctorReports,
    Patients,
    ReceptionistPage,
    DoctorManagement,
    Finance,
    FinanceBillingHistory,
    FinanceChangePlan,
    FinanceExtendPlan,
  } from "./pages/Doctor/index";

  import {
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
    BirthCertificateForm,
  } from "./pages/IPD";


  import { ICUAdminPanel, ICUDashboard, ICUVitals, ICUDoctorNotes, ICUNursingNotes, 
    ICUMedication, ICUCarePlan, ICUIntakeOutput, ICUProcedure, ICUHandover,
    ICUReport,
    ICUInvestigation,
    ICUDischargeTransfer,
    ICUAdmission,
    ICUAdmissionDetails} from "./pages/ICU";
    import TransferDischargeDetailsPage from "./components/ICU/common/TransferDischargeDetailsPage";
  import ICUDoctorNoteDetails from "./components/ICU/ICUDoctorNotes/ICUDoctorNoteDetails";
  import ICUNursingNotesDetails from "./components/ICU/ICUNursingNotes/ICUNursingNotesDetails";
  import ICUCarePlanDetails from "./components/ICU/ICUCarePlan/ICUCarePlanDetails";

  import { ToastContainer } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  import {LoginPage,RegisterPage,CreatePassword,ForgotPassword,ResetPassword,VerifyEmail,VerifyOtp} from "./pages/index"
  import useAutoLogout from "./hooks/useAutoLogout";
  import { useAppointmentsStats } from "./context/AppointmentStats";
  import { SyncLoader } from "react-spinners";
  import { connectWebSocket } from "./store/slices/webSlice";
  import { todayAppointments } from "./store/slices/todayAppointmentSlice";
  import { useDispatch, useSelector } from "react-redux";
  import { useSearch } from "./context/SearchContext";
  import { getNotifyCount } from "./store/slices/notificationSlice";
  import { useAppointments } from "./context/AppointmentsContext";
  import Profile from "./commonComponent/Profile";
  import AttendenceHistory from "./components/Doctor/AttendenceHistory";
  import {Termspolicies,Help,Signature,AddSlot,AddTime,Addfees,Password,AuditLogs} from "./components/Doctor/setting/index"
  import PageNotFound from "./pages/PageNotFound";

  import { DOCTOR, RECEPTIONIST, SUB_DOCTOR } from "./Constants";
  import ProtectedRoute from "./commonComponent/ProtectedRoute";
  import PaymentView from "./pages/IPD/paymentView";
  import Documnets from "./pages/IPD/Documnets";
import ICUProcedureDetails from "./components/ICU/ICUProcedure/ICUProcedureDetails";
import ICUVitalsDetails from "./components/ICU/ICUPatientVitals/ICUPatientVitalDetails";
import ICUMedicationDetails from "./components/ICU/ICUMedication/ICUMedicationDetails";
import ICUIntakeOutputDetails from "./components/ICU/ICUIntakeOutput/ICUIntakeOutputDetails";

  function App() {
    const dispatch = useDispatch();
    const isConnected = useSelector((state) => state.webSocket.connected);
    const { debounceSearchTerm } = useSearch();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user } = useAppointmentsStats();

    const { appointmentTime,selectedDoctor } = useAppointments();
    const navigate = useNavigate();
    const toggleSidebar = useCallback(() => {
      setIsSidebarOpen((prev) => !prev); 
    }, []);

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    useAutoLogout(token);
    const location = useLocation();

    const [activeModule, setActiveModule] = useState(
    location.pathname.startsWith("/ipd")
      ? "IPD"
      : location.pathname.startsWith("/icu")
      ? "ICU"
      : "OPD"
  );

    const allowedLoggedInRoles = [DOCTOR, SUB_DOCTOR, RECEPTIONIST];

  const handleModuleChange = useCallback(
    (module) => {
      setActiveModule(module);

      if (module === "IPD") {
        navigate("/ipd");
      } else if (module === "ICU") {
        navigate("/icu");
      } else {
        navigate("/");
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (location.pathname.startsWith("/ipd")) {
      setActiveModule("IPD");
    } else if (location.pathname.startsWith("/icu")) {
      setActiveModule("ICU");
    } else {
      setActiveModule("OPD");
    }
  }, [location.pathname]);

    const isVerificationRoute =
      location.pathname.startsWith("/verify-email") ||
      location.pathname.startsWith("/api/auth/verify");

    useEffect(() => {
      const publicRoutes = [
        "/forgot-password",
        "/reset-password",
        "/verify-email",
        "/api/auth/verify",
        "/verifyOtp",
        "/register",
      ];
      const isPublic = publicRoutes.some((route) =>
        location.pathname.startsWith(route)
      );

      if (!isPublic) {
        if (!token || !role) {
          navigate("/");
        }
        //  else {
        //   getUser();
        // }
      }
    }, [token, role, location.pathname]);

    useEffect(() => {
      let doctorId='';
      if(selectedDoctor){
        const [id]=selectedDoctor?.split('-');
        doctorId=id;
      }
      if (token) {
        dispatch(connectWebSocket({ token ,doctorId}));
      }
    }, [token,selectedDoctor]);

    useEffect(() => {
      if (isConnected) {
        const [doctorId,doctorType]=selectedDoctor?.split('-')
        dispatch(
          todayAppointments({
            appointmentTime: appointmentTime,
            date: new Date().toISOString().split("T")[0],
            doctorId:doctorId,
            doctorType:doctorType,
            ...(role === RECEPTIONIST && { searchTerm: debounceSearchTerm }),
          })
        );
      }
    }, [isConnected, dispatch, debounceSearchTerm, appointmentTime,selectedDoctor]);

    useEffect(() => {
      if (isConnected && role === DOCTOR) {
        dispatch(getNotifyCount());
      }
    }, [isConnected]);

    return (
      <>
        {token && !isVerificationRoute ? (
          <div className="h-[100vh] w-[100%] flex bg-[#f8fafc]">
            <Sidebar
              isOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
              name={user.name}
              profile={user.profile}
              profileContentType={user.profileContentType}
              attendences={user.attendances}
              activeModule={activeModule}
              onModuleChange={handleModuleChange}
            />
            <div className="lg:w-[88%] h-[100%] w-full sm:w-[100%] overflow-y-auto"  style={{ scrollbarWidth: "none" }}>
              <Header
                toggleSidebar={toggleSidebar}
                clinicName={
                  role === DOCTOR ? user.clinicName : user?.doctor?.clinicName
                }
                activeModule={activeModule}
              />
              <div
                className="bg-[#f8fafc] h-[92%] shadow-inner p-3 overflow-y-auto"
                style={{ scrollbarWidth: "none" }}
              >
                {/* lazy loading pages start */}
                <Suspense
                  fallback={
                    <div>
                      <SyncLoader color={"#8658ae"} margin={2} size={10} />
                    </div>
                  }
                >

                <Routes>
                  <Route path="/icu" element={<ICUDashboard />} />
                  <Route path="/icu-admission" element={<ICUAdmission />} />
                  <Route path="/icu-admission/:patientId" element={<ICUAdmissionDetails />} />
                  <Route path="/icu-admin-panel" element={<ICUAdminPanel />} />
                  <Route path="/icu-vitals" element={<ICUVitals />} />

                  <Route path="/icu-vitals/:patientId"
                    element={<ICUVitalsDetails />}
                  />
                  
                  <Route path="/icu-doctor-notes" element={<ICUDoctorNotes />} />
                  <Route path="/icu-doctor-notes/:noteId" element={<ICUDoctorNoteDetails />} />

                  <Route path="/icu-nursing-notes" element={<ICUNursingNotes />} />
                  <Route path="/icu-nursing-notes/:noteId" element={<ICUNursingNotesDetails />} />

                  <Route path="/icu-medication" element={<ICUMedication />} />
                  <Route path="/icu-medication/:medicationId" element={<ICUMedicationDetails />} />
                  <Route path="/icu-care-plan" element={<ICUCarePlan />} />
                  <Route path="/icu-care-plan/:patientId" element={<ICUCarePlanDetails />} />
                  <Route path="/icu-intake-output" element={<ICUIntakeOutput />} />
                  <Route path="/icu-intake-output/:patientId" element={<ICUIntakeOutputDetails/>} />

                  <Route path="/icu-procedure" element={<ICUProcedure />} />
                  <Route path="/icu-procedure/:procedureId" element={<ICUProcedureDetails/>}/>
                  <Route path="/icu-investigation" element={<ICUInvestigation />} />
                  <Route path="/icu-transfer-discharge" element={<ICUDischargeTransfer />} />
                  <Route path="/icu-transfer-discharge/:recordId" element={<TransferDischargeDetailsPage />} />

                  <Route path="/icu-handover" element={<ICUHandover />} />
                  <Route path="/icu-reports" element={<ICUReport/>} />

                {/* </Routes>
                  
                <Routes> */}
                    <Route
                      path="/ipd"
                      element={
                        <ProtectedRoute
                          role={role}
                          allowedRoles={allowedLoggedInRoles}
                          element={<IPDDashboard />}
                        />
                      }
                    />
                    <Route
                      path="/ipd/admit-patient"
                      element={
                        <ProtectedRoute
                          role={role}
                          allowedRoles={allowedLoggedInRoles}
                          element={<AdmitPatient />}
                        />
                      }
                    />
                    <Route
                      path="/ipd/admissions"
                      element={
                        <ProtectedRoute
                          role={role}
                          allowedRoles={allowedLoggedInRoles}
                          element={<AdmittedPatientsList />}
                        />
                      }
                    />
                    <Route
                      path="/ipd/admissions/:mrn"
                      element={
                        <ProtectedRoute
                          role={role}
                          allowedRoles={allowedLoggedInRoles}
                          element={<PatientDetails />}
                        />
                      }
                    />
                    <Route
                      path="/ipd/admission-doc"
                      element={
                        <ProtectedRoute
                          role={role}
                          allowedRoles={allowedLoggedInRoles}
                          element={<Documnets />}
                        />
                      }
                    />
                    
                    <Route
                      path="/ipd/wards"
                      element={
                        <ProtectedRoute
                          role={role}
                          allowedRoles={allowedLoggedInRoles}
                          element={<WardManagement />}
                        />
                      }
                    />
                    <Route
                      path="/ipd/rooms"
                      element={
                        <ProtectedRoute
                          role={role}
                          allowedRoles={allowedLoggedInRoles}
                          element={<RoomManagement />}
                        />
                      }
                    />
                    <Route
                      path="/ipd/beds"
                      element={
                        <ProtectedRoute
                          role={role}
                          allowedRoles={allowedLoggedInRoles}
                          element={<BedManagement />}
                        />
                      }
                    />
                    <Route
                      path="/ipd/bed-transfer"
                      element={
                        <ProtectedRoute
                          role={role}
                          allowedRoles={allowedLoggedInRoles}
                          element={<BedTransfer />}
                        />
                      }
                    />
                    <Route
                      path="/ipd/discharge"
                      element={
                        <ProtectedRoute
                          role={role}
                          allowedRoles={allowedLoggedInRoles}
                          element={<DischargeSummary />}
                        />
                      }
                    />
                    <Route
                      path="/ipd/accounts"
                      element={
                        <ProtectedRoute
                          role={role}
                          allowedRoles={allowedLoggedInRoles}
                          element={<Accounts />}
                        />
                      }
                    />
                    <Route
                      path="/ipd/payments"
                      element={
                        <ProtectedRoute
                          role={role}
                          allowedRoles={allowedLoggedInRoles}
                          element={<Payments/>}
                        />
                      }
                    />
                    
                    <Route
                      path="/ipd/paymentView/:admissionId"
                      element={
                        <ProtectedRoute
                          role={role}
                          allowedRoles={allowedLoggedInRoles}
                          element={<PaymentView/>}
                        />
                      }
                    />

                    <Route
                      path="/ipd/accounts/:accountId"
                      element={
                        <ProtectedRoute
                          role={role}
                          allowedRoles={allowedLoggedInRoles}
                          element={<InvoiceDetails />}
                        />
                      }
                    />

                    <Route
                      path="/ipd/birth-certificate"
                      element={
                        <ProtectedRoute
                          role={role}
                          allowedRoles={allowedLoggedInRoles}
                          element={<BirthCertificateForm />}
                        />
                      }
                    />

                    {(role === DOCTOR || role === SUB_DOCTOR) && (
                      <>
                        <Route
                          path="/"
                          element={
                            <ProtectedRoute
                              role={role}
                              allowedRoles={[DOCTOR, SUB_DOCTOR]}
                              element={
                                <DoctorDashboard
                                  name={user.name}
                                  clinicName={user.clinicName}
                                />
                              }
                            />
                          }
                        />
                        <Route
                          path="/appointments"
                          element={
                            <ProtectedRoute role={role} allowedRoles={[DOCTOR,SUB_DOCTOR]} element={<DoctorAppointment />} />
                          }
                        />
                        <Route path="/patients" element={
                          <ProtectedRoute role={role} allowedRoles={[DOCTOR,SUB_DOCTOR]} element={<Patients />} />
                        } />
                        <Route
                          path="/receptionist"

                          element={
                            <ProtectedRoute role={role} allowedRoles={[DOCTOR]} element={<ReceptionistPage />} />
                          }
                        />
                        <Route
                          path="/doctor-management"
                          element={
                            <ProtectedRoute role={role} allowedRoles={[DOCTOR]} element={<DoctorManagement />} />
                          }
                        />
                        {/* <Route path="/setting" element={<DoctorSetting />} > */}
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/signature" element={<Signature />} />
                        <Route path="/add-fees" element={
                          <ProtectedRoute role={role} allowedRoles={[DOCTOR]} element={<Addfees />} />
                        } />
                        <Route path="/add-time" element={
                          <ProtectedRoute role={role} allowedRoles={[DOCTOR]} element={<AddTime />} />
                        } />
                        <Route path="/add-slot" element={
                          <ProtectedRoute role={role} allowedRoles={[DOCTOR]} element={<AddSlot />} />
                        } />
                        <Route path="/change-password" element={
                          <ProtectedRoute role={role} allowedRoles={[DOCTOR,SUB_DOCTOR]} element={<Password />} />
                        } />
                        <Route path="/audit-logs" element={<ProtectedRoute role={role} allowedRoles={[DOCTOR]} element={<AuditLogs />} />} />
                        <Route path="/privacy" element={<Termspolicies />} />
                        {/* </Route> */}
                        <Route path="/scanner" element={
                          <ProtectedRoute role={role} allowedRoles={[DOCTOR]} element={<Scanner />} />
                        } />
                        <Route path="/finance" element={
                          <ProtectedRoute role={role} allowedRoles={[DOCTOR]} element={<Finance />} />
                        } />
                        <Route path="/finance/billing-history" element={
                          <ProtectedRoute role={role} allowedRoles={[DOCTOR]} element={<FinanceBillingHistory />} />
                        } />
                        <Route path="/finance/change-plan" element={
                          <ProtectedRoute role={role} allowedRoles={[DOCTOR]} element={<FinanceChangePlan />} />
                        } />
                        <Route path="/finance/extend-plan" element={
                          <ProtectedRoute role={role} allowedRoles={[DOCTOR]} element={<FinanceExtendPlan />} />
                        } />

                        <Route path="/verify-email/:token" element={<VerifyEmail />} />
                        <Route path="/reports" element={
                          <ProtectedRoute role={role} allowedRoles={[DOCTOR]} element={<DoctorReports />} />
                        } />
                      </>
                    )}
                    {role === RECEPTIONIST && (
                      <>
                        <Route
                          path="/"
                          element={
                            <ProtectedRoute role={role} allowedRoles={[RECEPTIONIST]} element={<Dashboard
                              name={user.name}
                              clinicName={user?.doctor?.clinicName}
                            />} />
                          }
                        />
                        <Route path="/appointments" element={
                          <ProtectedRoute role={role} allowedRoles={[RECEPTIONIST]} element={<Appointment />} />
                        } />
                        {/* <Route path="/setting" element={<Settings />} > */}
                        <Route path="/profile" element={<Profile />} />
                        <Route
                          path="/attendence"
                          element={
                            <ProtectedRoute role={role} allowedRoles={[RECEPTIONIST]} element={<AttendenceHistory />} />
                          }
                        />
                        <Route path="/privacy" element={<Termspolicies />} />
                        <Route path="/help" element={<Help />} />
                        {/* </Route> */}
                        <Route path="/scanner" element={<Scanner />} />
                      </>
                    )}

                    <Route path="*" element={<PageNotFound />} />
                </Routes>

                </Suspense>
              </div>
            </div>
          </div>
        ) : (
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/verifyOtp" element={<VerifyOtp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/create-password" element={<CreatePassword />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-email/:token" element={<VerifyEmail />} />
              <Route path="/api/auth/verify/:token" element={<VerifyEmail />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
        )}
        <ToastContainer />
      </>
    );
  }

  export default App;
