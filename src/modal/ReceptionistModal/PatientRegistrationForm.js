import React, { useEffect, useRef, useState } from "react";
// import PatientInput from "../../commonComponent/PatientInput";

import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";

import useModalClose from "../../hooks/useModalClose";
import { Button } from "@mui/material";
import { motion } from "framer-motion";
import { useAppointments } from "../../context/AppointmentsContext";
import apiClient from "../../api/apiClient";
import { SUB_DOCTOR } from "../../Constants";
import { useFetch } from "../../hooks/useFetch";
import { refreshAppointments } from "../../store/slices/appointmentRefresh";
import { useDispatch } from "react-redux";

export const PatientInput = ({
  label,
  type = "",
  name,
  value,
  min,
  max,
  onChange,
  readOnly,
  required,
  placeholder,
  onKeyDown,
  error,
}) => {
  return (
    <div className={`flex flex-col w-full`}>
      <label className="font-medium xl:text-base text-sm md:mb-0 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
        onKeyDown={onKeyDown}
        className={`outline-none border p-2  rounded-md bg-[#F6F6F7] border-[#E7E1E1] focus:border focus:border-zinc-400 ${
          type === "number" && "appearance-none"
        }`}
      />
      {error && <span className="mt-1 text-sm text-red-500 ">{error}</span>}
    </div>
  );
};

const PatientRegistrationForm = ({ isPatientForm, setIsPatientForm }) => {
  const modalRef = useRef();
  
  const handleClose = () => {
    setIsPatientForm(false);
  };

  const [date, setDate] = useState(() => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0"); // Ensure two-digit month
      const day = String(today.getDate()).padStart(2, "0"); // Ensure two-digit day
      return `${year}-${month}-${day}`;
  });
  useModalClose(modalRef, handleClose);
  const token=localStorage.getItem('token');
  const role=localStorage.getItem('role');

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    mobileNumber: "",
    gender: "",
    address: "",
    date: new Date().toISOString().split("T")[0] || "",
    email: "",
    reason: "",
    process: "",
    // process: "In-Person",
    dateOfBirth: "",
    bloodGroup: "",
    referredBy: "",
    appointmentTime: "",
    doctorId: "",
    doctorType: "",
  });

  const [assignTo, setAssignTo] = useState("");
  const [slots,setSlots]=useState([])
  const [slotId,setSlotId]=useState('');
  const { subDoctor } = useAppointments();

  const bloodGroup = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours, 10);
    const m = minutes;
    const ampm = h >= 12 ? "PM" : "AM";
    const formattedHour = h % 12 || 12;
    return `${formattedHour}:${m} ${ampm}`;
  };

  // Calculate age based on date of birth
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months -= 1;
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Format result
    if (years > 0 && months > 0) {
      return `${years} ${years > 1 ? "years" : "year"} ${months} ${
        months > 1 ? "months" : "month"
      }`;
    } else if (years > 0) {
      return `${years} ${years > 1 ? "years" : "year"}`;
    } else {
      return `${months} ${months > 1 ? "months" : "month"}`;
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name === "mobileNumber") {
      if (!/^\d*$/.test(value)) {
        return toast.error("Invalid Input");
      }
      if (value.length > 10) {
        return toast.error("mobile Number  cannot be more than 10 digits");
      }
    }

    if (name === "dateOfBirth") {
      const age = calculateAge(value);
      setFormData((prevData) => ({
        ...prevData,
        dateOfBirth: value,
        age: age.toString(), // Update age automatically based on DOB
      }));
      return;
    }
    if (name === "age") {
      const numericValue = value.replace(/[^0-9]/g, "");
      if (numericValue < 0) {
        return toast.error("Please select valid age");
      }
    }
     if (name === "appointmentTime") {
      const selectedSlotId =
        e.target.options[e.target.selectedIndex].dataset.slotid;
      setSlotId(selectedSlotId);
    }

    if (name === "address") {
      // Check if address exceeds 50 characters
      if (value.length <= 50) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      } else {
        return toast.error("Address cannot be more than 50 characters");
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAssign = (e) => {
    const { value } = e.target;
    const [doctorId, doctorType] = value?.split("-");
     const updatedSlots=subDoctor.find((item)=>String(item.id) === String(doctorId));
    setSlots(updatedSlots.slots);
    setAssignTo(value);
    setFormData((prev) => ({
      ...prev,
      doctorId: doctorId,
      doctorType: doctorType,
      appointmentTime:"",
    }));
  };

  const handleSubmit = async () => {
    const { name, date, doctorId,mobileNumber,dateOfBirth ,gender,reason,process,appointmentTime,address} = formData;
    if ( name === "") {
      return toast.error("Enter patient name");
    }
    if (mobileNumber === "") {
      return toast.error("Enter mobile Number");
    }
    if (mobileNumber.length < 10) {
      return toast.error("mobile Number cannot be less than 10 digits");
    }
     if(!gender){
      return toast.error("Please select gender");
    }
    if(!dateOfBirth){
      return toast.error("Please select date of birth to get age");
    }
    if(!address){
      return toast.error("Please provide address");
    }
    
    if(!date){
      return toast.error("Appointmenmt date is required");
    }
    if(role !== SUB_DOCTOR){
      if(!doctorId){
        return toast.error("Please select doctor");
      }
    }
    if(!appointmentTime){
      return toast.error("Appointmenmt date is required");
    }

    if(!reason){
      return toast.error("Please select reason");
    }
    if(!process){
      return toast.error("Please select booking via option");
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
    }else{
      let newDate = new Date(date);
      const getDate = newDate.getDay();
      const doctorSlot=slots.find((slot) => String(slot.id) === String(slotId));
      if (!doctorSlot || !doctorSlot.availabilityIds?.length || !doctorSlot.availabilityIds.includes(getDate)) {
        return toast.error("Doctor is not available");
      }
    }
    

    try {
      const response = await apiClient.post(`/api/patients/register`, formData);

      if (response.status === 201) {
        toast.success("Patient Registered Successfully");
        setFormData({
          name: "",
          age: "",
          mobileNumber: "",
          gender: "",
          address: "",
          date: "",
          email: "",
          reason: "",
          process: "",
          dateOfBirth: "",
          bloodGroup: "",
          appointmentTime: "",
          referredBy: "",
        });
        setAssignTo("");
        // dispatch(refreshAppointments());
      }
    } catch (error) {
      const errors = error?.response?.data?.errors;
      if (errors) {
        for (const error of errors) {
          toast.error(error.msg);
        }
      } else {
        toast.error(
          error.response?.data?.error || "Failed to register patients"
        );
      }
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      age: "",
      mobileNumber: "",
      gender: "",
      address: "",
      date: "",
      email: "",
      reason: "",
      // process: "",
      // process: "In-Person",
      dateOfBirth: "",
      bloodGroup: "",
      referredBy: "",
      appointmentTime: "",
    });
  };

  useEffect(() => {
    if (isPatientForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // Cleanup when modal unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isPatientForm]);

  const { data:subdoc_slot }=useFetch((token && role === SUB_DOCTOR) && '/api/doctor_time_slots/subdoctor-slots')
 
  useEffect(()=>{
    if(subdoc_slot?.data){
      setSlots(subdoc_slot?.data)
    }
  },[subdoc_slot])

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl shadow-2xl bg-white w-[80%] max-h-[90%]  relative flex flex-col items-center object-cover"
      >
        <div className="p-2 rounded-t-2xl bg-[#521785]  text-white flex w-full items-center justify-start pl-[5%] mb-2 ">
          <h1 className="font-semibold text-base xl:text-xl text-center">
            Patient Registration Form
          </h1>
          <RxCross2
            size={20}
            // color="#343c6a"
            onClick={() => setIsPatientForm(!isPatientForm)}
            className="cursor-pointer absolute right-2 text-white"
          />
        </div>

        <div
          className=" grid grid-cols-2 lg:grid-cols-3 w-[90%] gap-3 mb-4 overflow-y-auto"
          style={{ scrollbarWidth: "none" }}
        >
          <h1 className="col-span-2 lg:col-span-3 font-semibold text-base xl:text-xl border-b pb-2 text-zinc-800  border-zinc-400">
            Basic Details: -
          </h1>
          <PatientInput
            onChange={handleInput}
            name="name"
            value={formData.name}
            placeholder="Enter full name"
            label="Patient Name "
            required={true}
          />
          <PatientInput
            onChange={handleInput}
            name="mobileNumber"
            value={formData.mobileNumber}
            placeholder="Enter Mobile Number"
            label="Mobile Number "
            required={true}
          />
          <div className={`flex  flex-col  gap-1 `}>
            <label className="  font-medium xl:text-base text-sm md:mb-0 mb-1">
              Gender
              {<span className="text-red-500">*</span>}
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInput}
              required={true}
              className="outline-none border p-2  rounded-md bg-[#F6F6F7] border-[#E7E1E1] focus:border focus:border-zinc-400"
              style={{ width: "100%" }}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <PatientInput
            onChange={handleInput}
            name="dateOfBirth"
            required={true}
            value={formData.dateOfBirth}
            type="date"
            label="Date Of Birth "
            onClick={(e) => e.target.showPicker()}
            max={new Date().toISOString().split("T")[0]}
          />

          <PatientInput
            onChange={handleInput}
            name="age"
            value={formData.age}
            placeholder="Enter Age (0 years 0 months)"
            label="Age "
            required={true}
          />

          <PatientInput
            onChange={handleInput}
            name="address"
            value={formData.address}
            placeholder="Enter Address"
            label="Address :"
            required={true}
          />

          <h1 className="col-span-2 lg:col-span-3 font-semibold text-base xl:text-xl border-b pb-2 mt-3 text-zinc-800  border-zinc-400">
            Appointment Details : -
          </h1>
          <PatientInput
            type="date"
            onChange={handleInput}
            name="date"
            value={formData.date}
            onClick={(e) => e.target.showPicker()}
            label="Date of Appointment :"
            required={true}
            min={new Date().toISOString().split("T")[0]}
          />
            {localStorage.getItem("role") !== SUB_DOCTOR && (
            <div className="flex flex-col w-[100%]">
              <label className="mb-1  font-semibold xl:text-base text-sm">
                Assign To : <span className="text-red-500">*</span>
              </label>
              <select
                name="assignTo"
                onChange={handleAssign}
                value={assignTo}
                className="outline-none border p-2 rounded-md bg-[#F6F6F7] border-[#E7E1E1]"
              >
                <option disabled value="">Select doctor</option>
                {subDoctor?.length > 0 &&
                  subDoctor.map((item) => (
                    <option value={`${item.id}-${item.type}`}>
                      {item.name}-{item.specialization}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div className="flex flex-col justify-start gap-1 ">
            <label className="w-[100%] font-medium xl:text-base text-sm">
              Appointment Time : <span className="text-red-500">*</span>
            </label>
            <select
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleInput}
              className="outline-none border p-2 w-[100%] rounded-md bg-[#F6F6F7] border-[#E7E1E1]"
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

          <div className="flex  justify-start  flex-col  gap-1">
            <label className="w-[100%] md:mb-0 mb-1 font-medium xl:text-base text-sm">
              Primary Reason : <span className="text-red-500">*</span>
            </label>
            <select
              name="reason"
              onChange={handleInput}
              value={formData.reason}
              className="outline-none border p-2 w-[100%] rounded-md bg-[#F6F6F7] border-[#E7E1E1] focus:border focus:border-zinc-400"
            >
              <option value="">select primary reason</option>
              <option value="Checkup">Checkup</option>
              <option value="Followup">Followup</option>
              <option value="Vaccination">Vaccination</option>
              <option value="Investigation">Investigation</option>
              <option value="Prescription Refill">Prescription Refill</option>
            </select>
          </div>

          <div className="flex justify-start flex-col gap-1">
            <label className="w-full font-medium xl:text-base text-sm">
              Booking Via : <span className="text-red-500">*</span>
            </label>

            <div className="flex flex-wrap gap-4 ">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="process"
                  value={"In-Person"}
                  checked={formData.process === "In-Person"}
                  onChange={handleInput}
                  className="accent-[#9252C8] cursor-pointer"
                />
                <span className="lg:text-base text-[14px]">{"In-Person"}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="process"
                  value={"Phone Call"}
                  checked={formData.process === "Phone Call"}
                  onChange={handleInput}
                  className="accent-[#9252C8] cursor-pointer"
                />
                <span className=" lg:text-base text-[14px]">
                  {"Phone Call"}
                </span>
              </label>
            </div>
          </div>



          <h1 className="col-span-2 lg:col-span-3 font-semibold text-base xl:text-xl border-b pb-2 mt-3 text-zinc-800  border-zinc-400">
            Additional Details : -
          </h1>

          <PatientInput
            onChange={handleInput}
            name="email"
            value={formData.email}
            placeholder="Enter Email"
            label="Email Id :"
          />
          <div className="flex  md:justify-between md:items-center flex-col gap-1 ">
            <label className="w-[100%] md:mb-0 mb-1 font-medium xl:text-base text-sm">
              Blood Group :
            </label>
            <select
              name="bloodGroup"
              onChange={handleInput}
              className="outline-none border p-2 w-[100%] rounded-md bg-[#F6F6F7] border-[#E7E1E1] focus:border focus:border-zinc-400"
            >
              <option value="">select blood group</option>
              {bloodGroup.map((blood) => (
                <option value={blood}>{blood}</option>
              ))}
            </select>
          </div>

          <PatientInput
            onChange={handleInput}
            name="referredBy"
            value={formData.referredBy}
            placeholder="Referred By"
            label="Referred By :"
          />
        </div>

        <div className="   flex justify-end items-center gap-3 mb-2 w-[90%]">
          <Button
            onClick={handleReset}
            variant="outlined"
            className="!border-none !capitalize  !text-[#343c6a] !bg-gray-200  !w-[100px]"
          >
            Reset
          </Button>
          <Button
            variant="outlined"
            onClick={handleSubmit}
            className=" !btn_bg !border-none !capitalize  !text-white "
          >
            Register Patient
          </Button>
        </div>
        
      </motion.div>
    </div>
  );
};

export default PatientRegistrationForm;
