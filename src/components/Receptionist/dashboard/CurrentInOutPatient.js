import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { capitalizeWords } from "../../../utils/capitalizeWords";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { IoMdPrint } from "react-icons/io";
import { TbActivityHeartbeat } from "react-icons/tb";
import { FiUser } from "react-icons/fi";

import { MdOutlineEmail } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoCallOutline } from "react-icons/io5";

import { Button } from "@mui/material";
import {
  updateAppointmentStatus,
  updatePaymentModeInAppointment,
} from "../../../store/slices/todayAppointmentSlice";
import { toast } from "react-toastify";
import { ParameterModal, PrintBill } from "../../../modal/ReceptionistModal";
import { DoorClosed, DoorOpen } from "lucide-react";

const CurrentInOutPatient = ({ appointmentId }) => {
  const todayAppointment = useSelector(
    (state) => state.todayAppointment.appointments
  );

  const dispatch = useDispatch();

  const [openParameter, setOpenParameter] = useState(false);
  const [parameters, setParameters] = useState({});
  const [openPaymentMode, setOpenPaymentMode] = useState(false);
  const [openBillModal, setOpenBillModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const paymentRef=useRef(null);

  // keep index in sync when appointmentId prop is given
  useEffect(() => {
    if (appointmentId && todayAppointment.length > 0) {
      const idx = todayAppointment.findIndex((a) => a.id === appointmentId);
      if (
        sessionStorage.getItem("CurrentAppointment") ===
        todayAppointment[idx]?.id
      ) {
        return;
      }
      if (idx !== -1) {
        setCurrentIndex(idx);
        sessionStorage.setItem("CurrentAppointment", todayAppointment[idx].id);
      }
    }
  }, [appointmentId, todayAppointment]);

  // derive appointment directly from Redux
  const appointment = todayAppointment[currentIndex] || null;

  const handlePaymentModeChange = (value) => {
    const appointmentId = appointment.id;
    dispatch(
      updatePaymentModeInAppointment({ appointmentId, paymentMode: value })
    );
  };

  const handleStatusChange = async (value) => {
    const appointmentId = appointment.id;
    dispatch(updateAppointmentStatus({ appointmentId, status: value }));
  };

  const getPreviousAppointment = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      toast.warn("No previous appointment found.");
    }
  };

  const getNextAppointment = () => {
    if (currentIndex < todayAppointment.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      toast.warn("No next appointment found.");
    }
  };

  useEffect(()=>{
    const handleClickOutside=(e)=>{
      if(paymentRef.current && !paymentRef.current.contains(e.target)){
        setOpenPaymentMode(false);
      }
    }

    if(openPaymentMode){
      document.addEventListener('mousedown',handleClickOutside);
    }
    return ()=>{
      document.addEventListener('mousedown',handleClickOutside);
    }
  },[openPaymentMode])

  return (
    <>
      {openBillModal && (
        <PrintBill
          setOpenBillModal={setOpenBillModal}
          appointment={appointment}
        />
      )}
      {openParameter && (
        <ParameterModal
          openParameter={openParameter}
          setOpenParameter={setOpenParameter}
          parameters={parameters}
          appointmentId={appointment.id}
        />
      )}
      <div className="w-full gap-2 mb-2">
        <div className=" w-[100%] bg-white rounded-lg px-4 h-full py-4  border-l-4 border-[#73449c] flex lg:flex-row flex-col justify-between gap-4">
          {appointment && (
            <>
              {/* left  */}
              <div className=" space-y-1">
                <div className="flex flex-row lg:flex-col lg:space-y-1 space-y-0 lg:space-x-0 space-x-1 lg:items-start items-center">
                  <h1 className="font-semibold text-lg">
                    {capitalizeWords(appointment?.patient?.name)}
                  </h1>
                  <h3 className="font-normal text-[15px] text-[#343C6A]">
                    {capitalizeWords(appointment?.patient?.gender)} /{" "}
                    {appointment?.patient?.age}
                  </h3>
                  <h3 className="font-normal text-[15px] text-[#FF7936]  italic">
                    {appointment?.reason}
                  </h3>
                </div>
                {
                  appointment?.patient?.referredBy && (
                  <h2 className="font-normal text-[15px] text-[#343C6A]">Referred By -{capitalizeWords(appointment?.patient?.referredBy)}</h2>
                  )
                }

                <div
                  className="flex gap-3 items-center text-[15px] flex-wrap "
                  style={{ wordBreak: "break-all" }}
                >
                  <p className="text-[#343c6a] flex gap-2 items-center font-medium ">
                    <FiUser className="text-[#73449c]" size={18} />{" "}
                    {appointment?.patient?.patientId}
                  </p>
                  <p className="flex gap-2 items-center">
                    <IoCallOutline size={18} />{" "}
                    {appointment?.patient?.mobileNumber}
                  </p>
                  <p className="flex gap-2 items-center">
                    <MdOutlineEmail size={18} /> {appointment?.patient?.email}
                  </p>
                  <p className="flex gap-2 items-center">
                    <HiOutlineLocationMarker size={18} />{" "}
                    {appointment?.patient?.address}
                  </p>
                </div>
              </div>

              {/* right */}
              <div className=" flex gap-3 items-start lg:justify-end justify-start">
                <div
                  className={`flex bg-[#f8f6fd] text-sm px-2 lg:h-10 h-8 rounded-md  items-center ${
                    appointment?.status === "out" ? "block" : "hidden"
                  }`}
                >
                  <span className="text-[#73449c] italic">Fees : </span>
                  <span className="text-[#73449c] font-medium ml-1">
                    {" "}
                    Rs.{" "}
                    {parseFloat(appointment?.fees) +
                      parseFloat(appointment?.extraFees)}
                  </span>
                </div>
                <div
                  className={`relative   ${
                    appointment?.status === "out" ? "block" : "hidden"
                  }`}
                >
                  <p
                    onClick={() => setOpenPaymentMode(!openPaymentMode)}
                    className={` w-full border flex justify-between cursor-pointer items-center border-[#9252C8]
                    px-2 lg:h-10 h-8 text-center rounded-md`}
                  >
                    <span className="font-semibold text-[14px] text-[#a08be0]">
                      {appointment?.paymentMode
                        ? appointment?.paymentMode
                        : "Payment Mode"}
                    </span>{" "}
                    {openPaymentMode ? (
                      <MdOutlineKeyboardArrowUp color="#a08be0" size={14} />
                    ) : (
                      <MdOutlineKeyboardArrowDown color="#a08be0" size={14} />
                    )}
                  </p>

                  {openPaymentMode && (
                    <div ref={paymentRef} className="h-14 z-10 absolute top-10 w-full cursor-pointer bg-white border border-[#a08be0] rounded-md">
                      <p
                        onClick={() => {
                          handlePaymentModeChange("Online");
                          setOpenPaymentMode(!openPaymentMode);
                        }}
                        className=" text-[14px] font-semibold h-7 border-b border-[#a08be0] text-center"
                      >
                        Online
                      </p>
                      <p
                        onClick={() => {
                          handlePaymentModeChange("Cash");
                          setOpenPaymentMode(!openPaymentMode);
                        }}
                        className=" text-[14px] font-semibold h-7 text-center"
                      >
                        Cash
                      </p>
                    </div>
                  )}
                </div>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setOpenParameter(true);
                    setParameters(appointment.parameters);
                  }}
                  className={`!flex lg:!h-10 !h-8 !gap-1 !items-center !capitalize !border-gray-600 !text-gray-600 ${
                    appointment?.status === "out" ? "!hidden" : "!block"
                  }`}
                >
                  <TbActivityHeartbeat className="text-[#73449c]" /> Vitals
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setOpenBillModal(!openBillModal)}
                  className="!flex !gap-1 !items-center lg:!h-10 !h-8  !capitalize !border-gray-600 !text-gray-600"
                >
                  <IoMdPrint className="text-[#73449c]" /> Bill
                </Button>

                <Button
                  disabled={appointment.status === "cancel"}
                  onClick={() =>
                    handleStatusChange(
                      appointment.status === null
                        ? "in"
                        : appointment.status === "in"
                        ? "out"
                        : "in"
                    )
                  }
                  variant="outlined"
                  className={`!flex !gap-2 lg:!h-10 !h-8 !items-center !capitalize ${
                    appointment?.status === "in"
                      ? "!border-orange-500 !text-orange-500 hover:!bg-orange-50" : appointment?.status === 'cancel' ? '!border-red-500 !text-red-500 hover:!bg-red-50'
                      : "!border-green-600 !text-green-600 hover:!bg-green-50"
                  } ${appointment?.status === "out" ? "!hidden" : "!block"}`}
                >
                  {appointment?.status === "in" ? (
                    <>
                      <DoorOpen size={16} /> Click to Out
                    </>
                  ) : appointment?.status === "out" ? (
                    <>
                      <DoorClosed size={16} /> Already Out
                    </>
                  ) : appointment?.status === "cancel" ? (
                    <>
                      <DoorClosed size={16} />Cancelled
                    </>
                  ) : (
                    <>
                      <DoorClosed size={16} /> Click To In
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
        {appointment && (
          <div className="mb-2 mt-3 flex items-center justify-end w-full gap-4 font-semibold">
            <Button
              variant="outlined"
              onClick={getPreviousAppointment}
              className="lg:!w-[100px] !w-[80px] lg:!text-[15px] !text-xs !flex !gap-2 !items-center lg:!h-8 !h-6 !font-medium !text-[#b986fb]  !border-[#b986fb] !capitalize"
            >
              <p className="">
                <MdOutlineKeyboardArrowLeft size={18} />
              </p>{" "}
              Previous
            </Button>
            <Button
              variant="outlined"
              onClick={getNextAppointment}
              className="lg:!w-[100px] !w-[80px] lg:!text-[15px] !text-xs !flex !gap-2 !items-center lg:!h-8 !h-6 !font-medium !text-[#b986fb] !border-[#b986fb] !capitalize"
            >
              Next{" "}
              <p>
                <MdOutlineKeyboardArrowRight size={18} />
              </p>
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default CurrentInOutPatient;
