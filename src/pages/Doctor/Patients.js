
import React, { useEffect, useState } from "react";
import { UserRound, Phone, CalendarDays, Clock, Eye, Stethoscope } from "lucide-react";
import ViewDetailsModal from "../../modal/DoctorModal/ViewDetailsModal";

import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../commonComponent/Pagination";
import TableComponent from "../../commonComponent/TableComponent";
import { PatientListColumn } from "../../components/Doctor/tableColumn/PatientListColumn";
import { useAppointments } from "../../context/AppointmentsContext";
import { useFetch } from "../../hooks/useFetch";
import FilterRecordCard from "../../commonComponent/FilterRecordCard";

import { useSearch } from "../../context/SearchContext";
import { DOCTOR, SUB_DOCTOR } from "../../Constants";
import { capitalizeWords } from "../../utils/capitalizeWords";



const Patients = () => {
  const token=localStorage.getItem('token');
  const role=localStorage.getItem('role');
  
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [patientCount, setPatientCount] = useState("");
  const [date, setDate] = useState("");
  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState({});
  const [appointmentTime, setAppointmentTime] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [docId,docType]=doctorId?.split('-')
  const { debounceSearchTerm } = useSearch();
  const {  subDoctor } = useAppointments();
  const [slots,setSlots]=useState([]);
  const { currentPage, totalPages, goToPage, setTotalPages } = usePagination();

  const handleViewDetails = (patient) => {
    setPatient(patient);
    setIsViewDetailsOpen(true);
  };

  const handleDoctor=(e)=>{
    const {value}=e.target
    setDoctorId(value)

    const [id]=value?.split("-")
    
    const updatedSlots = subDoctor.find(
      (item) => String(item.id) === String(id)
    );
    setSlots(updatedSlots.slots);
    setAppointmentTime('')
  }

  const { loading: patientLoading, data: patientData } = useFetch(
    "/api/patients/patients",
    {
      params: {
        page: currentPage,
        searchTerm: debounceSearchTerm,
        date,
        appointmentTime,
        doctorId:docId,
        doctorType:docType
      },
    },
    [currentPage, debounceSearchTerm, date, appointmentTime,doctorId]
  );

  const { data: patientCountData } = useFetch("/api/patients/count/all-time");

  useEffect(() => {
    if (patientData?.patients) {
      setPatients(patientData.patients);
      setTotalPages(patientData?.pagination?.totalPages);
    }
  }, [patientData]);

  useEffect(() => {
    if (patientCountData?.data) {
      setPatientCount(patientCountData?.data?.count);
    }
  }, [patientCountData]);

  const {data:subdoc_slot}=useFetch((token && role === SUB_DOCTOR) && '/api/doctor_time_slots/subdoctor-slots')

  useEffect(()=>{
    if(subdoc_slot?.data){
      setSlots(subdoc_slot?.data)
    }
  },[subdoc_slot])

  return (
    <>
      {isViewDetailsOpen && (
        <ViewDetailsModal
          isOpen={isViewDetailsOpen}
          onClose={() => setIsViewDetailsOpen(false)}
          patient={patient}
        />
      )}

      <div className="w-full relative h-full mx-auto bg-white shadow-md rounded-lg overflow-hidden flex flex-col">
        
        <FilterRecordCard>
          <div className="w-full lg:w-[30%] space-y-1 flex flex-col gap-0">
            <p className="lg:text-lg text-base font-semibold text-[#343C6A]">Patient History</p>
            <p className="text-sm lg:text-base font-medium text-[#343C6A]">Total Patient - {patientCount || 0}</p>
          </div>

          <FilterRecordCard.Filters>
            {localStorage.getItem("role") === DOCTOR && (
              <FilterRecordCard.DoctorSelect
                data={subDoctor}
                value={doctorId}
                onChange={handleDoctor}
              />
            )}

            <FilterRecordCard.Select
              value={appointmentTime}
              slots={slots}
              onChange={(e) => setAppointmentTime(e.target.value)}
            />

            <FilterRecordCard.Date
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </FilterRecordCard.Filters>
        </FilterRecordCard>

        {/* Desktop Table */}
        <div className="hidden lg:block flex-1 min-h-0 w-full mb-2 px-2 gap-2 text-sm md:text-[15px] text-[#343C6A] rounded-lg overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <TableComponent
            loading={patientLoading}
            headerBg={"bg-gray-100"}
            columns={PatientListColumn({ handleViewDetails })}
            data={patients}
          />
        </div>

        {/* Mobile + Tablet Cards */}
        <div className="block lg:hidden flex-1 min-h-0 overflow-y-auto px-3 sm:px-4 pb-3" style={{ scrollbarWidth: "none" }}>
          
          {patientLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-56 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          )}

          {!patientLoading && patients.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <UserRound size={24} className="text-gray-400" />
              </div>

              <p className="text-sm font-medium text-gray-600">No patients found</p>
              <p className="text-xs text-gray-400 mt-1">Try changing the date or filters.</p>
            </div>
          )}

          {!patientLoading && patients.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {patients.map((patient, index) => (
                <PatientCard
                  key={patient.id || patient._id || index}
                  patient={patient}
                  handleViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="shrink-0 px-2 py-1 bg-white border-t border-gray-100">
          {patients.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              goToPage={goToPage}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Patients;

const PatientCard = ({ patient, handleViewDetails }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      
      <div className="p-4 flex items-start justify-between gap-3 border-b border-gray-100">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#343C6A]/10 flex items-center justify-center shrink-0">
            <UserRound size={19} className="text-[#343C6A]" />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-semibold text-[#343C6A] truncate">
              {capitalizeWords(patient?.patient?.name) || "N/A"}
            </h3>

            {patient?.patient?.mobileNumber && (
              <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                <Phone size={12} />
                <span>{patient.patient.mobileNumber}</span>
              </div>
            )}
          </div>
        </div>

        <button type="button" onClick={() => handleViewDetails(patient.patient)} className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#343C6A] text-white text-xs hover:bg-[#293154] transition">
          <Eye size={14} />
          History
        </button>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-5">
          
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <UserRound size={15} className="text-blue-600" />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] text-gray-400">PID</p>
              <p className="text-sm font-medium text-gray-700 truncate">
                {patient?.patient?.patientId || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
              <CalendarDays size={15} className="text-green-600" />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] text-gray-400">Last Visit</p>
              <p className="text-sm font-medium text-gray-700 truncate">
                {patient?.date?.slice(0, 10) || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
              <Stethoscope size={15} className="text-orange-600" />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] text-gray-400">Visit Reason</p>
              <p className="text-sm font-medium text-gray-700 break-words">
                {patient?.reason || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
              <Clock size={15} className="text-purple-600" />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] text-gray-400">Process</p>
              <p className={`text-sm font-medium ${patient?.process === "In-Person" ? "text-[#b76df3]" : "text-[#58b3f8]"}`}>
                {patient?.process || "N/A"}
              </p>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};
