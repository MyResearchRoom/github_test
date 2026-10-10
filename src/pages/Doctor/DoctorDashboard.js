import React, { useEffect, useRef, useState } from "react";

import CurrentPatient from "../../components/Doctor/dashboard/CurrentPatient";
import AddPrescription from "../../components/Doctor/dashboard/AddPrescription";
import { useSelector } from "react-redux";
import NotFound from "../../commonComponent/NotFound";
import DoctorAppointmentCard from "../../components/Doctor/dashboard/DoctorAppointmentCard";
import { useFetch } from "../../hooks/useFetch";
import { AiOutlineClose } from "react-icons/ai";
import { FaRegCalendarAlt } from "react-icons/fa";

const DoctorDashboard = () => {
  const todayAppointment = useSelector(
    (state) => state.todayAppointment.appointments
  );

  const [isAppointmentsOpen, setIsAppointmentsOpen] = useState(false);
  const panelRef = useRef(null);

  const currentInAppointment = useSelector((state) => state.webSocket.data);

  const [appointment, setAppointment] = useState({});
  const [isAppointment, setIsAppointment] = useState(false);

  const handleStatusChange = async (item) => {
    setAppointment(item);
    setIsAppointment(true);
    setIsAppointmentsOpen(false); 
  };

  const { data } = useFetch("/api/appointments/current-appointment");

  useEffect(() => {
    if (data?.firstAppointment) {
      setAppointment(data.firstAppointment);
      setIsAppointment(true);
    }
  }, [data]);

  useEffect(() => {
    if (currentInAppointment) {
      let newData = todayAppointment.find(
        (item) => String(item.id) === String(currentInAppointment)
      );
      setAppointment(newData);
      setIsAppointment(true);
    }
  }, [currentInAppointment]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!isAppointmentsOpen) return;
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsAppointmentsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAppointmentsOpen]);

 
  useEffect(() => {
    document.body.style.overflow = isAppointmentsOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isAppointmentsOpen]);

  if (todayAppointment.length === 0) {
    return (
      <div className="bg-white h-full rounded-md flex justify-center items-center">
        <NotFound
          title="No Current Appointment"
          subTitle="No appointments scheduled at the moment."
        />
      </div>
    );
  }

  const pendingCount = todayAppointment.filter(
    (a) => a.status !== "out" && a.status !== "cancel"
  ).length;
  const completedCount = todayAppointment.filter(
    (a) => a.status === "out"
  ).length;

  return (
    <>

      <button
        type="button"
        onClick={() => setIsAppointmentsOpen(true)}
        className="lg:hidden w-full flex items-center justify-between bg-343C6A shadow-md rounded-lg px-3 py-2 mt-2 gap-4"
      >
        <span className="flex items-center gap-2 text-xs md:text-sm font-semibold text-[#ffffff] bg-[#343C6A] px-2 py-1 rounded-md">
          <FaRegCalendarAlt size={15} />
          Today's Appointments
        </span>

        <span className="flex items-center gap-2">
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
            Pending {pendingCount}
          </span>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            Completed {completedCount}
          </span>
        </span>
      </button>

      {isAppointmentsOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" aria-hidden="true" />
      )}

      <div className="w-full flex flex-col lg:flex-row gap-4 h-full">
        <div
          className="w-full lg:w-[75%] mt-2 p-2 bg-white shadow-md rounded-lg relative overflow-y-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {isAppointment ? (
            <>
              <CurrentPatient appointmentId={appointment.id} />
              <div className=" text-[#343C6A] mt-4">
                <AddPrescription appointmentId={appointment.id} />
              </div>
            </>
          ) : (
            <NotFound
              title="No Current Appointment"
              subTitle="There are no patients checked in right now."
            />
          )}
        </div>

        {/* Today's Appointments - inline column on desktop, slide-in drawer on mobile/tablet */}
        <div
          ref={panelRef}
          className={`bg-white p-4 lg:p-0 lg:bg-transparent h-full lg:h-[98%] mt-3 rounded-lg overflow-y-auto
          fixed inset-y-0 right-0 z-40 w-72 sm:w-80 shadow-xl transition-transform duration-300 ease-in-out
          ${isAppointmentsOpen ? "translate-x-0" : "translate-x-full"}
          lg:static lg:translate-x-0 lg:shadow-none lg:z-0 lg:w-[25%]
        `}
          style={{ scrollbarWidth: "none" }}
        >
          {/* Close icon - mobile/tablet only */}
          <button
            type="button"
            onClick={() => setIsAppointmentsOpen(false)}
            className="lg:hidden absolute top-3 right-3 text-gray-600"
            aria-label="Close"
          >
            <AiOutlineClose size={22} />
          </button>

          <div className="mb-2 flex flex-wrap gap-1 w-full pr-8 lg:pr-0">
            <h1 className="text-[15px]   lg:text-[18px]  font-semibold text-[#343C6A]">
              Today's Appointments
            </h1>
            <div className="flex gap-3">
              <span className="text-xs flex justify-center items-center bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                Pending {pendingCount}
              </span>
              <span className="text-xs flex justify-center items-center bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Completed {completedCount}
              </span>
            </div>
          </div>

          <div className="space-y-2 ">
            {todayAppointment &&
              todayAppointment.length > 0 &&
              todayAppointment.map((item, idx) => (
                <DoctorAppointmentCard
                  key={item.id}
                  idx={idx}
                  handleStatusChange={handleStatusChange}
                  appointment={appointment}
                  item={item}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorDashboard;
