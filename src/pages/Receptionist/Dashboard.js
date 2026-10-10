import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PrintBill } from "../../modal/ReceptionistModal";
import CurrentInOutPatient from "../../components/Receptionist/dashboard/CurrentInOutPatient";
import { useSearch } from "../../context/SearchContext";
import DashCountComponent from "../../components/Receptionist/dashboard/DashCountComponent";
import AppointmentCard from "../../components/Receptionist/dashboard/AppointmentCard";
import { useAppointments } from "../../context/AppointmentsContext";
import NotFound from "../../commonComponent/NotFound";
import { formatTime } from "../../utils/formatTime";
// import { useFetch } from "../../hooks/useFetch";

const Dashboard = () => {
  const todayAppointment = useSelector(
    (state) => state.todayAppointment.appointments
  );
  const {  setSearchTerm } = useSearch();
  const [openBillModal, setOpenBillModal] = useState(false);

  // const [appointment, setAppointment] = useState({});
  const [appointmentId, setAppointmentId] = useState(todayAppointment[0]?.id);
  const [billData, setBillData] = useState(null);
  const [slots,setSlots]=useState([]);
  const {appointmentTime, setAppointmentTime ,subDoctor,selectedDoctor,setSelectedDoctor} =
    useAppointments();

  const handleBillModal = (data) => {
    setOpenBillModal(true);
    setBillData(data);
  };

   const handleDoctor=(e)=>{
    const {value}=e.target
    setSelectedDoctor(value)
    const [id]=value?.split("-")
    const updatedSlots = subDoctor.find(
      (item) => String(item.id) === String(id)
    );
    setSlots(updatedSlots.slots);

  }
  //   const {data}=useFetch('/api/appointments/current-appointment')
  // useEffect(()=>{
  //   if(data?.firstAppointment){
  //     setAppointment(data?.firstAppointment)
  //   }
  // },[data])


  useEffect(() => {
    setAppointmentTime("");
    setSearchTerm("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

 

  return (
    <>
      {openBillModal && (
        <PrintBill setOpenBillModal={setOpenBillModal} appointment={billData} />
      )}

      <DashCountComponent />

      <CurrentInOutPatient appointmentId={appointmentId} />

      <div className="w-full lg:h-[70%] bg-white shadow-md  rounded-lg p-2">
        <div className="flex justify-between items-center mb-3">
          {/* Title */}
          <h1 className="text-base font-semibold text-[#343c6a] w-1/2">
            Today's Appointments
          </h1>

          <div className="flex justify-end gap-2 items-center w-1/2">
            {/* Search bar */}
            <select value={selectedDoctor} onChange={handleDoctor} className="rounded-md py-1.5 w-44 border test-sm truncate border-gray-300 bg-gray-50 outline-none focus:border-gray-500 ">
              <option disabled value=''>Select Doctor</option>
              {
                subDoctor?.length > 0 && subDoctor.map((item)=>(
                  <option key={item.id} value={`${item.id}-${item.type}`}>{item.name}-{item.specialization}</option>
                ))
              }
            </select>
            <select
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              className="rounded-md py-1.5 text-sm truncate w-44 border border-gray-300 bg-gray-50 outline-none focus:border-gray-500 "
            >
              <option  value="">Select Appointment Time</option>
              {slots.length > 0 &&
                slots.map((opt) => (
                  <option
                    key={opt.id}
                    value={`${opt.startTime} - ${opt.endTime}`}
                  >
                    {opt.slotName} - {formatTime(opt.startTime)} – {formatTime(opt.endTime)} 
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div
          className="w-full relative h-[88%]  overflow-y-auto space-y-2"
          style={{ scrollbarWidth: "none" }}
        >
          {todayAppointment.length > 0 ? (
            todayAppointment.map((patient,idx) => {
              return (
                <AppointmentCard
                  key={patient.id}
                  idx={idx}
                  patient={patient}
                  onBillClick={handleBillModal}
                  appointmentId={appointmentId}
                  setAppointmentId={setAppointmentId}
                />
              );
            })
          ) : (
            <NotFound title="No Appointments Found" subTitle="No appointments scheduled at the moment." />
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
