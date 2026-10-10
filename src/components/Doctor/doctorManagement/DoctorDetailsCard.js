import React, { useState } from "react";
import { MdOutlineAccessAlarm } from "react-icons/md";
import { BsFillTelephoneFill } from "react-icons/bs";
import { HiMail } from "react-icons/hi";
import { FilePenLine, Star, Trash2, Users } from "lucide-react";
import { Button } from "@mui/material";
import apiClient from "../../../api/apiClient";
import { toast } from "react-toastify";

const formatTime = (time) => {
  if (!time) return "NA";

  const [hours, minutes] = time.split(":");

  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0);

  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(date);
};

const DoctorDetailsCard = ({ doctor, setSelectedId, handleChangeStatus,setRefreshKey }) => {
  const [loadingPrescriptionId, setLoadingPrescriptionId] = useState(null);
  
  const handlePrescriptionDisplay = async (subDoctorId) => {
      try {
        setLoadingPrescriptionId(subDoctorId);
        const response = await apiClient.patch(
          "/api/subdoctors/togglePrescriptionDisplay",
          {
            subDoctorId,
          }
        );
  
        toast.success(response.data.message);
        setRefreshKey((prev) => prev + 1);
  
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Something went wrong"
        );
      } finally {
        setLoadingPrescriptionId(null);
      }
  };
  return (
    <div
      className="bg-white rounded-xl  p-5 text-gray-600 relative"
      style={{
        boxShadow: `rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px`,
      }}
    >
      {/* Status Badge */}
      <span
        className={`absolute right-4 top-4 text-xs font-semibold px-3 py-1 rounded-full ${
          doctor.isActive
            ? "bg-green-100 text-green-700 "
            : "bg-red-100 text-red-700 "
        }`}
      >
        {doctor.isActive ? "Active" : "Inactive"}
      </span>

      {/* Doctor Info */}
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-[#343c6a] break-words">
          Dr. {doctor.name}
        </h1>
        <h2 className=" text-sm text-[#521785] font-bold break-words capitalize">
          {doctor?.department} || {doctor.specialization}
        </h2>
        <p className="text-sm text-gray-500 font-medium break-words capitalize">
          {doctor.qualification}
        </p>
      </div>

      {/* Contact & Schedule */}
      <div className="space-y-2 text-sm font-medium">
        <div className="flex items-center gap-2 ">
          <BsFillTelephoneFill className="text-gray-400" size={16} />
          <span className="break-words truncate">{doctor.mobileNumber}</span>
        </div>
        <div className="flex items-center gap-2">
          <HiMail className="text-gray-400" size={16} />
          <span className="break-words">{doctor.email}</span>
        </div>
        <div className="flex items-start gap-2">
          <MdOutlineAccessAlarm className="text-gray-400" size={16} />
          <div className="flex flex-col -mt-1">
            {doctor.slots?.length > 0 ? (
              doctor.slots.map((slot) => (
                <span key={slot.id} className="text-sm text-gray-700">
                  <span className="font-medium capitalize">{slot.slotName}</span>:{" "}
                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                </span>
              ))
            ) : (
              <span>NA</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Users className="text-gray-400" size={16} />
          <span>{doctor.appointments?.length || 0} patients today</span>
        </div>
      </div>

      {/* Actions */}
      <div
        className="grid md:grid-cols-2 gap-2 mt-5"
      >
        <Button
          variant="outlined"
          onClick={() => handleChangeStatus(doctor.id)}
          className={`
            !capitalize !font-medium !border !text-xs !md:text-sm
            ${
              doctor?.isActive
                ? "!bg-red-400 !border-red-400 !text-white hover:!bg-red-600"
                : "!bg-green-400 !border-green-400 !text-white hover:!bg-green-600"
            }
          `}
        >
         Click To {doctor?.isActive ? "Deactivate" : "Activate"}
        </Button>
        <div className="grid grid-cols-3 items-center gap-2 ">
        <button onClick={() => {
            setSelectedId({
              id: doctor.id,
              type: "edit_prev_doctor",
            });
          }} className="bg-white border border-gray-300 rounded-md flex justify-center items-center p-2 hover:bg-gray-50">
          <FilePenLine size={18} className="text-gray-500" />
        </button>
        <button
          onClick={() => {
            setSelectedId({
              id: doctor.id,
              type: "delete",
            });
          }}
          className="bg-white border border-gray-300 rounded-md flex justify-center items-center p-2 hover:bg-red-50"
        >
          <Trash2 size={18} className="text-red-500" />
        </button>

        <button
          type="button"
          onClick={() => handlePrescriptionDisplay(doctor.id)}
          className={`bg-white border border-gray-300 rounded-md flex justify-center items-center p-2 hover:bg-gray-50 transition-opacity 
          ${loadingPrescriptionId === doctor.id
            ? "opacity-50 cursor-not-allowed"
            : "opacity-100"
          }`}
        >
          {doctor.prescriptionDisplay > 0 ? doctor.prescriptionDisplay : ""} {" "}
          <Star
            size={18}
            className={
              doctor.prescriptionDisplay > 0
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-400"
            }
          /> 
        </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailsCard;
