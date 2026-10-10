
import React, { useEffect, useState } from "react";
import ParameterModal from "../../modal/ReceptionistModal/ParameterModal";
import * as XLSX from "xlsx";
import { Download } from "lucide-react";
import { CalendarClock } from "lucide-react";
import { IoMdPrint } from "react-icons/io";

import { BookAppointmentModal, PrintBill } from "../../modal/ReceptionistModal";
import TableComponent from "../../commonComponent/TableComponent";
import { DoctorAppointmentColumn } from "../../components/Doctor/tableColumn/DoctorAppointmentColumn";
import { useAppointments } from "../../context/AppointmentsContext";
import { useFetch } from "../../hooks/useFetch";
import FilterRecordCard from "../../commonComponent/FilterRecordCard";
import { useSearch } from "../../context/SearchContext";
import { DOCTOR, SUB_DOCTOR } from "../../Constants";
import convertTimeRange from "../../utils/combineDateTime";
import { useSelector } from "react-redux";
// import DualInvoicePDF from "../../pdf/dualInvoicePdf";

const getStatusBadge = (status) => {
  if (status === "out")
    return { label: "Completed", className: "bg-green-100 text-green-700" };
  if (status === "cancel")
    return { label: "Cancelled", className: "bg-red-100 text-red-700" };
  return { label: "Pending", className: "bg-yellow-100 text-yellow-700" };
};

const DoctorAppointment = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [openParameter, setOpenParameter] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [parameters, setParameters] = useState(null);
  const [appointmentId, setAppointmentId] = useState(null);
  const [billData, setBillData] = useState(null);
  const [openBillModal, setOpenBillModal] = useState(false);
  const [count, setCount] = useState(null);
  const { subDoctor } = useAppointments();
  const [appointmentTime, setAppointmentTime] = useState("");
  const [slots, setSlots] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [docId, docType] = doctorId?.split("-");
  const { debounceSearchTerm } = useSearch();
  const [rescheduleAppointment, setRescheduleAppointment] = useState(null);
  const [openAppointmentModal, setOpenAppointmentModal] = useState(false);


  const [date, setDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Ensure two-digit month
    const day = String(today.getDate()).padStart(2, "0"); // Ensure two-digit day
    return `${year}-${month}-${day}`;
  });

  const refreshKey = useSelector(
    (state) => state.appointment.refreshKey
  );

  

  const handleOpenModal = (id, item) => {
    setAppointmentId(id);
    setParameters(item);
    setOpenParameter(!openParameter);
  };

  const handleRescheduleAppointment = (data) => {
    const {
      id,
      appointmentTime,
      patient,
      date,
      process,
      reason,
      doctorId,
      subDoctorId,
      doctorType,
    } = data;
    setRescheduleAppointment({
      id,
      appointmentTime,
      patient,
      date,
      process,
      reason,
      doctorId: doctorId ? doctorId : subDoctorId,
      doctorType,
    });
    setOpenAppointmentModal(true);
  };
  const handleDoctor = (e) => {
    const { value } = e.target;
    setDoctorId(value);
    const [id] = value?.split("-");
    const updatedSlots = subDoctor.find(
      (item) => String(item.id) === String(id),
    );
    setSlots(updatedSlots.slots);
    setAppointmentTime("");
  };

  const handleExportExcel = () => {
    const rows = appointments.map((item) => ({
      
      "Patient Id": item.patient?.patientId || "-",
      "Patient Name": item.patient?.name || "-",
      Phone: item.patient?.mobileNumber || "-",
      // Doctor: item.doctor?.name || item.doctorName || "",
      Doctor: item.doctorType ==="doctor" ? item?.doctor?.name : item?.subDoctor?.name,
      Date: item.date
        ? new Date(item.date).toLocaleDateString("en-GB")
        : "-",
      Time: item?.appointmentTime ? convertTimeRange(item.appointmentTime) : "-",
      "Booked Via": item.process || "-",
      Status : item.status === "out"
              ? "Completed"
              : item.status === "cancel"
              ? "Cancelled"
              : "Pending",
      Reason: item.reason || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Appointments");

    const colWidths = Object.keys(rows[0] || {}).map((key) => ({
      wch: Math.max(key.length, 18),
    }));
    worksheet["!cols"] = colWidths;

    XLSX.writeFile(workbook, `Appointments_${date}.xlsx`);
  };

  // get appointments api
  const { data, loading } = useFetch(
    "/api/appointments/todays-appointments",
    {
      params: {
        searchTerm: debounceSearchTerm,
        date,
        appointmentTime,
        doctorId: docId,
        doctorType: docType,
      },
    },
    [debounceSearchTerm, date, appointmentTime, doctorId,refreshKey],
  );

  useEffect(() => {
    if (data?.appointments) {
      setAppointments(data.appointments);
      setCount(data.stats);
    }
  }, [data]);

  const { data: subdoc_slot } = useFetch(
    token && role === SUB_DOCTOR && "/api/doctor_time_slots/subdoctor-slots",
  );

  useEffect(() => {
    if (subdoc_slot?.data) {
      setSlots(subdoc_slot?.data);
    }
  }, [subdoc_slot]);


  return (
    <>
      {openParameter && (
        <ParameterModal
          openParameter={openParameter}
          setOpenParameter={setOpenParameter}
          parameters={parameters}
          appointmentId={appointmentId}
        />
      )}
      {openAppointmentModal && (
        <BookAppointmentModal
          openAppointmentModal={openAppointmentModal}
          setOpenAppointmentModal={setOpenAppointmentModal}
          appointment={rescheduleAppointment}
          setRescheduleAppointment={setRescheduleAppointment}
        />
      )}
      {openBillModal && (
        <PrintBill setOpenBillModal={setOpenBillModal} appointment={billData} />
      )}
      <div className="w-full bg-white shadow-md  rounded-lg">
        {/* Section 1 */}

        <FilterRecordCard>
          <div className=" flex flex-col gap-0">
            <p className="lg:text-lg text-base font-semibold text-[#343C6A] mb-1">
              Appointments
            </p>
            <div className="flex gap-3">
              <span className="inline-flex items-center justify-center whitespace-nowrap text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                Pending {count?.pendingCnt}
              </span>

              <span className="inline-flex items-center justify-center whitespace-nowrap text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                Completed {count?.completeCnt}
              </span>
            </div>
          </div>

          

          {/* <button
            onClick={handleNewPrintBill}
            className="flex items-center justify-center gap-1 whitespace-nowrap border border-[#d3cccc] text-[#343C6A] text-sm px-3 py-2 rounded-md disabled:opacity-50 w-full sm:w-auto"
          >
            New Print Bill
          </button> */}

          <FilterRecordCard.Filters>
            <button
              onClick={handleExportExcel}
              disabled={!appointments.length}
              className="flex items-center justify-center gap-1 whitespace-nowrap border border-[#d3cccc] text-[#343C6A] text-sm px-3 py-2 rounded-md disabled:opacity-50 w-full sm:w-auto"
            >
              <Download size={14} />
              Export Excel
            </button>
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

        {/* Desktop / large-tablet table */}
        <div
          className="hidden lg:block h-[88%] w-[100%] px-2 gap-2 text-sm md:text-[15px] text-[#343C6A]  rounded-lg overflow-y-auto "
          style={{ scrollbarWidth: "none" }}
        >
          <TableComponent
            loading={loading}
            headerBg={"bg-gray-100"}
            columns={DoctorAppointmentColumn({
              handleOpenModal,
              setOpenBillModal,
              openBillModal,
              setBillData,
              handleRescheduleAppointment,
            })}
            data={appointments}
          />
        </div>

        {/* Mobile / tablet card list */}
        <div
          className="lg:hidden h-[100%] w-full px-2 py-2 overflow-y-auto space-y-2"
          style={{ scrollbarWidth: "none" }}
        >
          {loading && (
            <p className="text-center text-sm text-gray-500 py-6">Loading...</p>
          )}

          {!loading && appointments.length === 0 && (
            <p className="text-center text-sm text-gray-500 py-6">
              No appointments found.
            </p>
          )}

          {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {appointments.map((item, idx) => {
              const status = getStatusBadge(item.status);
              return (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm p-3"
                >
                  {/* Header: Sr no, name, phone, status */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400">Sr No. {idx + 1}</p>
                      <p className="font-semibold text-[#343C6A] truncate">
                        {item.patient?.name || item.patientName}
                      </p>
                      {(item.patient?.mobileNumber || item.patientPhone) && (
                        <p className="text-xs text-gray-500">
                          ({item.patient?.mobileNumber || item.patientPhone})
                        </p>
                      )}
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  {/* Details grid */}
                  <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                    <div>
                      <p className="text-xs text-gray-400">PID</p>
                      <p className="font-medium truncate">
                        {item.patient?.patientId || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Time</p>
                      <p className="font-medium truncate">
                        {item.appointmentTime || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Visit Reason</p>
                      <p className="font-medium truncate">
                        {item.reason || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Fees</p>
                      <p className="font-medium text-green-700">
                        {item.fees !== undefined ? `Rs. ${item.fees}` : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Process</p>
                      <p
                        className={`font-medium truncate ${
                          item.process === "Phone Call"
                            ? "text-blue-600"
                            : "text-purple-600"
                        }`}
                      >
                        {item.process || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Payment Mode</p>
                      <p className="font-medium truncate">
                        {item.paymentMode || "-"}
                      </p>
                    </div>
                  </div>

                  {/* Actions: Vitals, Reschedule, Bill */}
                  <div className="mt-3 flex items-center justify-end gap-4 border-t border-gray-100 pt-2">
                    <button
                      onClick={() => handleOpenModal(item.id, item.parameters)}
                      className="text-xs font-semibold bg-[#F2E2FF] text-[#521785] px-3 py-1.5 rounded-md"
                    >
                      Vitals
                    </button>
                    <button
                      onClick={() => handleRescheduleAppointment(item)}
                      className="text-[#521785]"
                      aria-label="Reschedule appointment"
                    >
                      <CalendarClock size={20} />
                    </button>
                    <button
                      onClick={() => {
                        setBillData(item);
                        setOpenBillModal(true);
                      }}
                      className="text-[#521785]"
                      aria-label="Print bill"
                    >
                      <IoMdPrint size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DoctorAppointment;
