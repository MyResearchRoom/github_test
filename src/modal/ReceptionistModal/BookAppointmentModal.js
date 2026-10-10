import React, { useEffect, useRef, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";
import useModalClose from "../../hooks/useModalClose";
import { Button } from "@mui/material";
import { FiUser } from "react-icons/fi";
import { motion } from "framer-motion";
import { useAppointments } from "../../context/AppointmentsContext";
import { useSearch } from "../../context/SearchContext";
import { useFetch } from "../../hooks/useFetch";
import apiClient from "../../api/apiClient";
import { SUB_DOCTOR } from "../../Constants";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { refreshAppointments } from "../../store/slices/appointmentRefresh";
import { useDispatch } from "react-redux";

const BookAppointmentModal = ({ openAppointmentModal, setOpenAppointmentModal, appointment = null, setRescheduleAppointment }) => {
  const modalRef = useRef();

  const handleClose = () => {
    if (appointment?.id) {
      setRescheduleAppointment(null);
    }
    setSearchTerm("");
    setOpenAppointmentModal(false);
  };

  useModalClose(modalRef, handleClose);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [formData, setFormData] = useState({
    reason: "",
    date: new Date().toISOString().split("T")[0] || "",
    process: "In-Person",
    appointmentTime: "",
    doctorId: "",
    doctorType: "",
  });

  const { searchTerm, setSearchTerm, debounceSearchTerm } = useSearch();
  const dropdownRef = useRef(null);
  const [patient, setPatient] = useState({});
  const [assignTo, setAssignTo] = useState("");
  const [slotId, setSlotId] = useState("");
  const processOptions = ["In-Person", "Phone Call"];
  const { subDoctor } = useAppointments();

  const [patients, setPatients] = useState([]);
  const [slots, setSlots] = useState([]);

  const dispatch = useDispatch();

  const handleInput = (e) => {
    const { name, value } = e.target;

    if (name === "appointmentTime") {
      const selectedSlotId = e.target.options[e.target.selectedIndex].dataset.slotid;
      setSlotId(selectedSlotId);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAssign = (e) => {
    const { value } = e.target;
    const [doctorId, doctorType] = value?.split("-");

    const updatedSlots = subDoctor.find(
      (item) => String(item.id) === String(doctorId)
    );

    setSlots(updatedSlots.slots);
    setAssignTo(value);

    setFormData((prev) => ({
      ...prev,
      doctorId: doctorId,
      doctorType: doctorType,
      appointmentTime: "",
    }));
  };

  const formatTime = (time) => {
    if (!time) return "";

    const [hours, minutes] = time.split(":");
    const h = parseInt(hours, 10);
    const m = minutes;
    const ampm = h >= 12 ? "PM" : "AM";
    const formattedHour = h % 12 || 12;

    return `${formattedHour}:${m} ${ampm}`;
  };

  const handleSubmit = async () => {
    const { date, doctorId } = formData;

    if (!patient?.id) {
      toast.error("Please select a patient");
      return;
    }

    if (date && role !== SUB_DOCTOR) {
      let newDate = new Date(date);
      const getDate = newDate.getDay();

      const doctorSlot = subDoctor
        .find((doc) => String(doc.id) === String(doctorId))
        ?.slots.find((slot) => String(slot.id) === String(slotId));

      if (!doctorSlot || !doctorSlot.availabilityIds?.length || !doctorSlot.availabilityIds.includes(getDate)) {
        return toast.error("Doctor is not available");
      }
    } else {
      let newDate = new Date(date);
      const getDate = newDate.getDay();

      const doctorSlot = slots.find(
        (slot) => String(slot.id) === String(slotId)
      );

      if (!doctorSlot || !doctorSlot.availabilityIds?.length || !doctorSlot.availabilityIds.includes(getDate)) {
        return toast.error("Doctor is not available");
      }
    }

    try {
      const response = await apiClient.post(
        `/api/patients/appointment/${patient.id}`,
        formData
      );

      if (response.status === 201) {
        toast.success("Appointment booked successfully");

        setFormData({
          reason: "",
          date: "",
          process: "",
          appointmentTime: "",
        });
        dispatch(refreshAppointments());

        setPatient({});
        setSearchTerm("");
        setOpenAppointmentModal(!openAppointmentModal);
      }
    } catch (error) {
      const errors = error?.response?.data?.errors;

      if (errors) {
        for (const error of errors) {
          toast.error(error.msg);
        }
      } else {
        toast.error(
          getApiErrorMessage(error, "Failed to book appointment")
        );
      }
    }
  };

  const handleReset = () => {
    setFormData({
      reason: "",
      date: "",
      process: "In-Person",
      appointmentTime: "",
    });

    setPatient({});
    setSearchTerm("");
  };

  const handleRescheduleAppointment = async () => {
    const id = appointment?.id;

    try {
      const response = await apiClient.patch(
        `/api/appointments/re-schedule/${id}`,
        formData
      );

      if (response?.status === 200) {
        toast.success(response?.data?.message);
        setRescheduleAppointment(null);
        setOpenAppointmentModal(false);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Failed to reschedule appointment"
      );
    }
  };

  const handleCancelAppointment = async () => {
    const id = appointment?.id;

    try {
      const response = await apiClient.patch(
        `/api/appointments/cancel/${id}`,
        {}
      );

      if (response?.status === 200) {
        toast.success(response?.data?.message);
        setRescheduleAppointment(null);
        setOpenAppointmentModal(false);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Failed to cancel appointment"
      );
    }
  };

  const { data: patientData } = useFetch(
    openAppointmentModal && "/api/patients/patients-for-appointment",
    {
      params: {
        searchTerm: debounceSearchTerm,
      },
    },
    [debounceSearchTerm, openAppointmentModal]
  );

  useEffect(() => {
    if (patientData?.patients) {
      setPatients(patientData?.patients);
    }
  }, [patientData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        event.target.type !== "search"
      ) {
        setPatients([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (openAppointmentModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openAppointmentModal]);

  useEffect(() => {
    if (appointment?.id) {
      const doctorId= appointment?.doctorType==="doctor" ? appointment.doctorId : appointment.subDoctorId;

      setAssignTo(`${doctorId}-${appointment.doctorType}`)

      // console.log("appointment",appointment);
      
      // console.log("subDoctor",subDoctor);
      

      const updatedSlots = subDoctor.find(
        (item) => String(item.id) === String(doctorId)
      );
        
      setSlots(updatedSlots?.slots || []);

      setFormData({
        appointmentTime: appointment.appointmentTime || "",
        reason: appointment.reason || "",
        process: appointment.process || "",
        date: appointment.date.split("T")[0] || "",
        // doctorId: appointment.doctorId,
        doctorId: appointment?.doctorType==="doctor" ? appointment.doctorId : appointment.subDoctorId,
        doctorType: appointment.doctorType,
      });

      setPatient(appointment?.patient);
      setAssignTo(`${doctorId}-${appointment.doctorType}`);
    }
  }, [appointment]);

  const { data: subdoc_slot } = useFetch(
    token && role === SUB_DOCTOR
      ? "/api/doctor_time_slots/subdoctor-slots"
      : null
  );

  useEffect(() => {
    if (subdoc_slot?.data) {
      setSlots(subdoc_slot?.data);
    }
  }, [subdoc_slot]);

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-2 sm:p-4">
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl bg-white shadow-2xl w-[96%] sm:w-[85%] md:w-[70%] lg:w-[45%] max-h-[95vh] relative flex flex-col items-center overflow-hidden"
      >
        {/* Header */}
        <div className="p-3 sm:p-2 rounded-t-2xl bg-[#521785] text-white flex w-full items-center justify-start mb-2 pl-4 sm:pl-[5%] shrink-0">
          <h1 className="font-medium text-base sm:text-lg xl:text-xl text-center">
            Book Patient Appointment
          </h1>

          <RxCross2
            size={20}
            onClick={handleClose}
            className="cursor-pointer absolute right-3 sm:right-4 text-white"
          />
        </div>

        {/* Scrollable Content */}
        <div className="w-full overflow-y-auto flex flex-col items-center min-h-0">
          {/* Patient Search */}
          <div className="relative w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] mb-4" ref={dropdownRef}>
            <div className="relative w-full">
              <input
                type="search"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                placeholder="search patient"
                disabled={!!appointment?.id}
                className="outline-none p-2 pl-7 w-full text-[#343c6a] placeholder:text-[#343c6a] rounded-md border focus:border-[#c4b2d3] bg-[#f2e2ff]"
              />

              <FaMagnifyingGlass
                size={16}
                color="#343c6a"
                className="absolute top-3 left-2"
              />
            </div>

            {searchTerm && patients && patients.length > 0 && (
              <div
                className="max-h-[200px] h-auto border absolute z-10 top-10 rounded-md w-full text-[14px] bg-white cursor-pointer overflow-y-auto shadow-md"
                style={{ scrollbarWidth: "none" }}
              >
                {patients.map((patient) => (
                  <p
                    key={patient.id}
                    onClick={() => {
                      setPatient(patient);
                      setSearchTerm("");
                      setPatients([]);
                    }}
                    className="p-2 px-2 hover:bg-[#f2e2ff]"
                  >
                    {patient.name}, {patient.mobileNumber}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Selected Patient */}
          {Object.keys(patient).length > 0 && (
            <div className="flex items-center justify-between gap-3 p-2 mb-4 border rounded-md bg-[#f0fdf4] w-[90%]">
              <div className="flex items-center gap-3 min-w-0">
                <span className="p-2 bg-[#dbfce7] h-10 w-10 shrink-0 flex justify-center items-center rounded-full">
                  <FiUser className="text-[#00a63e]" />
                </span>

                <div className="min-w-0">
                  <p className="text-[16px] font-semibold text-[#343c6a] truncate">
                    {patient.name}
                  </p>

                  <p className="text-[14px] text-gray-700">
                    {patient.mobileNumber}
                  </p>
                </div>
              </div>

              <button
                disabled={appointment?.id}
                onClick={() => setPatient({})}
                className="text-sm text-red-500 hover:underline shrink-0 disabled:cursor-not-allowed"
              >
                ✕
              </button>
            </div>
          )}

          {/* Form */}
          <div className="w-[90%] grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 sm:mb-10 text-[#343c6a]">
            {localStorage.getItem("role") !== SUB_DOCTOR && (
              <div className="flex flex-col w-full min-w-0">
                <label className="mb-1 font-semibold xl:text-base text-sm">
                  Assign To : <span className="text-red-500">*</span>
                </label>

                <select
                  name="assignTo"
                  onChange={handleAssign}
                  value={assignTo}
                  disabled={!!appointment?.id}
                  className="outline-none border p-2 rounded-md bg-[#F6F6F7] border-[#E7E1E1] w-full min-w-0"
                >
                  <option disabled value="">
                    Select doctor
                  </option>

                  {subDoctor?.length > 0 &&
                    subDoctor.map((item) => (
                      <option
                        key={item.id}
                        value={`${item.id}-${item.type}`}
                      >
                        {item.name}-{item.specialization}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div className="flex flex-col w-full min-w-0">
              <label className="font-semibold xl:text-base text-sm mb-1">
                Date of Booking : <span className="text-red-500">*</span>
              </label>

              <input
                type="date"
                className="outline-none border bg-[#F6F6F7] border-[#E7E1E1] p-2 rounded-lg w-full"
                name="date"
                value={formData.date}
                onClick={(e) => e.target.showPicker()}
                onChange={handleInput}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="flex flex-col w-full min-w-0">
              <label className="mb-1 font-semibold xl:text-base text-sm">
                Appointment Time : <span className="text-red-500">*</span>
              </label>

              <select
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleInput}
                className="outline-none border p-2 rounded-md bg-[#F6F6F7] border-[#E7E1E1] w-full min-w-0"
              >
                <option value="">Select appointment time</option>

                {slots.map((slot) => (
                  <option
                    key={slot.id}
                    value={`${slot.startTime} - ${slot.endTime}`}
                    data-slotid={slot.id}
                  >
                    {slot.slotName} - ({formatTime(slot.startTime)} –{" "}
                    {formatTime(slot.endTime)})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col w-full min-w-0">
              <label className="mb-1 font-semibold xl:text-base text-sm">
                Visit Reason : <span className="text-red-500">*</span>
              </label>

              <select
                name="reason"
                onChange={handleInput}
                value={formData.reason}
                disabled={!!appointment?.id}
                className="outline-none border p-2 rounded-md bg-[#F6F6F7] border-[#E7E1E1] w-full min-w-0"
              >
                <option value="">select visit reason</option>
                <option value="Checkup">Checkup</option>
                <option value="Followup">Followup</option>
                <option value="Vaccination">Vaccination</option>
                <option value="Investigation">Investigation</option>
                <option value="Prescription Refill">
                  Prescription Refill
                </option>
              </select>
            </div>

            <div className="flex flex-col w-full min-w-0">
              <label className="mb-1 font-semibold xl:text-base text-sm">
                Booking Via : <span className="text-red-500">*</span>
              </label>

              <select
                name="process"
                onChange={handleInput}
                value={formData.process}
                className="outline-none border p-2 rounded-md bg-[#F6F6F7] border-[#E7E1E1] w-full min-w-0"
              >
                {processOptions.map((booking) => (
                  <option key={booking} value={booking}>
                    {booking}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-2 sm:gap-4 w-[90%] pb-3 shrink-0">
          {appointment?.id ? (
            <>
              <Button
                onClick={handleCancelAppointment}
                variant="outlined"
                className="!border-none !capitalize !text-[#343c6a] !bg-gray-200 !w-full sm:!w-auto"
              >
                Cancel Appointment
              </Button>

              <Button
                variant="outlined"
                onClick={handleRescheduleAppointment}
                className="!btn_bg !border-none !capitalize !text-[14px] !font-semibold !p-2 !text-white !w-full sm:!w-auto"
              >
                Reschedule Appointment
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleReset}
                variant="outlined"
                className="!border-none !capitalize !text-[#343c6a] !bg-gray-200 !w-full sm:!w-[100px]"
              >
                Reset
              </Button>

              <Button
                variant="outlined"
                onClick={handleSubmit}
                className="!btn_bg !border-none !capitalize !text-[14px] !font-semibold !p-2 !text-white !w-full sm:!w-auto"
              >
                Book Appointment
              </Button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default BookAppointmentModal;
