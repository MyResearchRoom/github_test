import React, { useEffect, useState } from "react";

import {
  ParameterModal,
  BookAppointmentModal,
  PrintBill,
} from "../../modal/ReceptionistModal";
import axios from "axios";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import convertTimeRange from "../../utils/combineDateTime";
import TableComponent from "../../commonComponent/TableComponent";
import { receptionistAppointmentColumn } from "../../components/Receptionist/tableColumn/receptionistAppointmentColumn";
import { useAppointments } from "../../context/AppointmentsContext";
import { useFetch } from "../../hooks/useFetch";
import FilterRecordCard from "../../commonComponent/FilterRecordCard";
import { useSearch } from "../../context/SearchContext";


const Appointment = () => {
  const [openParameter, setOpenParameter] = useState(false);
  const [openAppointmentModal, setOpenAppointmentModal] = useState(false);
  const [openBillModal, setOpenBillModal] = useState(false);
  const {debounceSearchTerm}=useSearch()
  const [appointments, setAppointments] = useState([]);
  const [appointmentId, setAppointmentId] = useState(null);
  const [tempParameters, setTempParameters] = useState(null);
  const [billData, setBillData] = useState(null);
  const [rescheduleAppointment, setRescheduleAppointment] = useState(null);
  const [appointmentTime, setAppointmentTime] = useState("");
  const [count, setCount] = useState(null);
  const [doctorId,setDoctorId]=useState('');
  const [slots,setSlots]=useState([]);
  const {subDoctor } = useAppointments();

  const [date, setDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  const handleParameter = (id, parameters) => {
    setAppointmentId(id);
    setTempParameters(parameters);
    setOpenParameter(!openParameter);
  };

  const handleRescheduleAppointment = (data) => {
    console.log("data",data);
    
    const { id, appointmentTime, patient, date, process, reason,doctorId,doctorType,subDoctorId} = data;
    setRescheduleAppointment({
      id,
      appointmentTime,
      patient,
      date,
      process,
      reason,
      doctorId,
      doctorType,
      subDoctorId
    });
    setOpenAppointmentModal(true);
  };

  const handleStatusChange = async (value, id) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/appointments/set-current-appointment/${id}`,
        {
          status: value,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setAppointments((prevData) => {
          // Update the status of the specified appointment
          const updatedAppointments = prevData.map((item) =>
            item.id === id ? { ...item, status: value } : item
          );

          // Custom sort based on the status
          return updatedAppointments.sort((a, b) => {
            const statusOrder = { in: 1, null: 2, out: 3 }; // Define the order

            // Get the status for sorting
            const aStatus = a.status || "null"; // Default to "null" if undefined
            const bStatus = b.status || "null";

            // Compare based on the defined order
            return (statusOrder[aStatus] || 3) - (statusOrder[bStatus] || 3);
          });
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to update");
    }
  };

  const handlePaymentModeChange = async (value, id) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/appointments/payment-mode/${id}`,
        {
          paymentMode: value,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setAppointments((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, paymentMode: value } : item
          )
        );
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occured");
    }
  };

  const getTitle = () => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    if (date === today) return "Today's Appointments";
    return "Appointments";
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

  const title = getTitle();

  const { loading, data } = useFetch(
    "/api/appointments/todays-appointments",
    {
      params: {
        searchTerm:debounceSearchTerm,
        date,
        appointmentTime,
        doctorId:doctorId.split('-')[0],
        doctorType:doctorId.split('-')[1]
      },  
    },
    [debounceSearchTerm, date, appointmentTime,doctorId]
  );

  useEffect(() => {
    if (data?.appointments) {
      setAppointments(data?.appointments);
      setCount(data?.stats);
    }
  }, [data]);

  const downloadAppointmentsExcel = () => {
      if (!appointments || appointments.length === 0) {
        toast.error("No appointment data found.");
        return;
      }
  
      const excelData = appointments.map((item, index) => ({
        "Sr No.": index + 1,
        "Doctor": item.doctorType ==="doctor" ? item?.doctor?.name : item?.subDoctor?.name,
        "Patient Name": item?.patient?.name || "-",
        "Mobile Number": item?.patient?.mobileNumber || "-",
        "Patient ID": item?.patient?.patientId || "-",
        "Appointment Time": item?.appointmentTime
          ? convertTimeRange(item.appointmentTime)
          : "-",
        "Visit Reason": item?.reason || "-",
        "Fees": Number(item?.fees || 0) + Number(item?.extraFees || 0),
        "Booked via": item?.process || "-",
        "Status":
          item?.status === "out"
            ? "Completed"
            : item?.status === "cancel"
            ? "Cancelled"
            : "Pending",
        "Payment Mode": item?.paymentMode || "-",
        "Date": item?.date
          ? new Date(item.date).toLocaleDateString("en-GB")
          : "-",
      }));
  
      const worksheet = XLSX.utils.json_to_sheet(excelData);
  
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Appointments");
  
      XLSX.writeFile(
        workbook,
        `Appointments_${new Date().toISOString().split("T")[0]}.xlsx`
      );
  };

  return (
    <>
      {/* {isPatientForm && (
        <PatientRegistrationForm
          isPatientForm={isPatientForm}
          setIsPatientForm={setIsPatientForm}
        />
      )} */}
      {openParameter && (
        <ParameterModal
          openParameter={openParameter}
          setOpenParameter={setOpenParameter}
          parameters={tempParameters}
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
        <PrintBill
          setOpenBillModal={setOpenBillModal}
          appointment={billData}
          setBillData={setBillData}
        />
      )}
      <div className="h-[100%] bg-white shadow-md  w-full rounded-lg p-2">
        <FilterRecordCard>
          <div className="flex flex-col gap-0 w-full">
            <h1 className="text-[15px] font-semibold mb-1">{title}</h1>
            <div className="flex gap-3">
              <span className="text-xs flex justify-center items-center bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                Pending {count?.pendingCnt}
              </span>
              <span className="text-xs flex justify-center items-center bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Completed {count?.completeCnt}
              </span>
            </div>
          </div>

          <FilterRecordCard.Filters>

            <div className="w-full sm:w-full lg:w-44 min-w-0 truncate">
              <button
                onClick={downloadAppointmentsExcel}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Download Excel
              </button>
            </div>
          
           <FilterRecordCard.DoctorSelect data={subDoctor} value={doctorId} onChange={handleDoctor}/>
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

        <div
          className="w-full relative h-[90%] text-sm md:text-[15px] overflow-y-auto"
          style={{ scrollbarWidth: "none" }}
        >
          <TableComponent
            columns={receptionistAppointmentColumn({
              date,
              handleStatusChange,
              handlePaymentModeChange,
              openBillModal,
              setOpenBillModal,
              setBillData,
              handleParameter,
              handleRescheduleAppointment,
            })}
            data={appointments}
            headerBg={"bg-gray-100"}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default Appointment;
