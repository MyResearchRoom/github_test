import { capitalizeWords } from "../../../utils/capitalizeWords";
import { MdOutlineEmail } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoCallOutline } from "react-icons/io5";
import { Button } from "@mui/material";
import { IoMdPrint } from "react-icons/io";
import { MdOutlineAccessAlarm } from "react-icons/md";
import convertTimeRange from "../../../utils/combineDateTime";

const AppointmentCard = ({ patient,idx, onBillClick,appointmentId,setAppointmentId }) => {
  return (
    <>
      <div onClick={()=>setAppointmentId(patient.id)} className={`h-auto w-full grid grid-cols-1 lg:grid-cols-[0.5fr_1fr_0.5fr] gap-3 p-2 rounded-md border border-gray-100 shadow-sm hover:bg-[#f9f5fd] cursor-pointer ${appointmentId === patient.id ? 'bg-[#f4ecfa]' : ''}`}
    //   style={{boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px'}}
      >
        <div className="lg:space-y-1 lg:space-x-0 space-y-0 space-x-2 flex lg:flex-col flex-row lg:items-start items-center">
          <h1 className="font-semibold text-lg">
           <span className="mr-1">{idx+1}{']'}</span>
            {capitalizeWords(patient?.patient?.name)}
          </h1>
          <h3 className="font-normal text-[15px] text-[#343C6A]">
            {capitalizeWords(patient?.patient?.gender)} /{" "}
            {patient?.patient?.age}
          </h3>
          <h3 className="font-notmal inline-block px-2 text-[15px] text-[#FF7936] italic bg-[#faebec] p-1 rounded-md">
            {patient?.reason}
          </h3>
        </div>

        <div className="flex gap-2 justify-between">
          <div className="text-[#343c6a] space-y-1">
            <p className="flex gap-2 items-center">
              <IoCallOutline size={18} className="text-[#73449c]" />
              {patient?.patient?.mobileNumber}
            </p>
            <p className="flex gap-2 items-center">
              <MdOutlineEmail size={18} className="text-[#73449c]" />
              {patient?.patient?.email}
            </p>
            <p
              className="flex gap-2 items-center"
              style={{ wordBreak: "break-all" }}
            >
              <HiOutlineLocationMarker
                size={18}
                className="text-[#73449c] truncate"
              />
              {patient?.patient?.address}
            </p>
          </div>
          <div
            className={`flex gap-3 ${
              patient.status === "out" ? "block" : "hidden"
            }`}
          >
            <div
              className={`flex bg-[#f8f6fd] text-sm px-2 h-10 rounded-md  items-center`}
            >
              <span className="text-[#73449c] italic">Fees : </span>
              <span className="text-[#73449c] font-medium ml-1">
                {" "}
                Rs.
                {parseFloat(patient?.fees)+ parseFloat(patient.extraFees)}
              </span>
            </div>

              {
                patient?.paymentMode && (
<div className="text-sm px-2 h-10 border rounded-md flex justify-center items-center border-gray-600 text-gray-600">
              {patient?.paymentMode}
            </div>
                )
              }
            
            <Button
              variant="outlined"
              onClick={() => onBillClick(patient)}
              className="!flex !gap-1 !items-center !h-10 !capitalize !border-gray-600 !text-gray-600"
            >
              <IoMdPrint className="text-[#73449c]" /> Bill
            </Button>
          </div>
        </div>

        <div className=" flex lg:flex-col flex-row items-end justify-start gap-2 text-[#343c6a]">
          <span
            className={`${
              patient.status === "out"
                ? "bg-[#c3ffd1] text-[#5c9d6a]" : patient.status === 'cancel' ? 'bg-[#ffe1e1] text-[#E50F0F]' 
                : "bg-[#fcffcc] text-[#464A05]"
            }  p-1 px-2 rounded-full inline font-medium text-sm`}
          >
            {patient?.status === "out" ? "Completed" : patient?.status ==='cancel'? 'Cancelled' : "Pending"}
          </span>
          <p className="flex items-center gap-2">
            <MdOutlineAccessAlarm />  {convertTimeRange(patient?.appointmentTime)}
          </p>
        </div>
      </div>
    </>
  );
};

export default AppointmentCard;
