import { BsFillTelephoneFill } from "react-icons/bs";
import { HiLocationMarker, HiMail } from "react-icons/hi";
import { useState } from "react";
import ViewDetailsModal from "../../../modal/DoctorModal/ViewDetailsModal";
import { todayDate } from "../../../utils/todayDate";
import { FaCalendarDays } from "react-icons/fa6";
import { GiBodyHeight, GiWeightScale } from "react-icons/gi";
import { TbHeartRateMonitor } from "react-icons/tb";
import { FaTemperatureQuarter } from "react-icons/fa6";
import { RiMedicineBottleLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { updateToxicityInAppointment } from "../../../store/slices/todayAppointmentSlice";
import { Button } from "@mui/material";
import { ParameterModal, PrintBill } from "../../../modal/ReceptionistModal";
import { IoMdPrint } from "react-icons/io";
import { capitalizeWords } from "../../../utils/capitalizeWords";

const CurrentPatient = ({ appointmentId }) => {
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [openParameter, setOpenParameter] = useState(false);
  const [parameters, setParameters] = useState(null);
  const [openBillModal, setOpenBillModal] = useState(false);

  const todayAppointment = useSelector(
    (state) => state.todayAppointment.appointments
  );
  let appointment = todayAppointment.find((item) => item.id === appointmentId);
  const dispatch = useDispatch();

  const handleParameter = () => {
    setOpenParameter(true);
    setParameters(appointment.parameters);
  };

  const handleToxicity = () => {
    dispatch(
      updateToxicityInAppointment({
        appointmentId: appointment?.id,
        patientId: appointment?.patient?.id,
      })
    );
  };
  return (
    <>
      <div className="bg-[#F6F6F7] p-2 rounded-lg shadow-sm  border border-zinc-200">
        {isViewDetailsOpen && (
          <ViewDetailsModal
            isOpen={isViewDetailsOpen}
            onClose={() => setIsViewDetailsOpen(false)}
            patient={appointment?.patient}
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
        {openBillModal && (
          <PrintBill
            setOpenBillModal={setOpenBillModal}
            appointment={appointment}
          />
        )}

        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
          {/* Patient id + name/gender/age */}
          <div className="flex items-start gap-3 min-w-0">
            <p className="text-[#0CADCD] font-bold text-[14px] lg:text-[18px] p-2 bg-[#f7f7f7] rounded-md shrink-0">
              {appointment?.patient?.patientId}
            </p>
            <p className="text-[16px] lg:text-[22px] font-bold flex flex-col min-w-0">
              <span className="text-[#521785] truncate">
                {capitalizeWords(appointment?.patient?.name)}
              </span>
              <span className="font-medium text-[14px] text-gray-700">
                {capitalizeWords(appointment?.patient?.gender)}{" "}
                {appointment?.patient?.age && `/ ${appointment?.patient?.age}`}
              </span>
            </p>
          </div>

          {/* Toxicity toggle + reason + history button */}
          <div className="flex flex-wrap items-center gap-2 sm:justify-end sm:flex-1">
            <input
              type="checkbox"
              checked={appointment?.patient?.toxicity} // `true` means toxic, `false` means nonToxic
              onChange={handleToxicity} // Toggle onChange
              className="hidden" // Hide the default checkbox
              id="toxic"
            />
            <label
              htmlFor="toxic"
              className={`relative group w-5 h-5 md:w-6 md:h-6 rounded-full flex cursor-pointer justify-center items-center border-2 shrink-0 ${
                appointment?.patient?.toxicity
                  ? "border-red-500"
                  : "border-[#9252C8]"
              }`}
            >
              <label
                htmlFor="toxic"
                className={`absolute inset-0 cursor-pointer  w-3 h-3 md:w-4 md:h-4 m-auto rounded-full ${
                  appointment?.patient?.toxicity ? "bg-red-500" : ""
                }`}
              ></label>
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded-md shadow-lg">
                {appointment?.patient?.toxicity
                  ? "Remove Patient From Special Category"
                  : "Add Patient to Special Category"}
              </span>
            </label>

            <p className="text-gray-700 font-medium text-[13px] sm:text-[14px] lg:text-[16px] p-[6px] px-2 text-center rounded-md italic truncate max-w-[140px] sm:max-w-[180px]">
              {appointment?.reason}
            </p>
            <Button
              variant="outlined"
              onClick={() => {
                if (appointment !== null && appointment !== undefined) {
                  setIsViewDetailsOpen(true);
                }
              }}
              className="!bg-[#521785] hover:!bg-[#3e1066] !text-white !capitalize !font-semibold !rounded-lg !px-3 sm:!px-5 !py-1 sm:!py-1.5 !text-xs sm:!text-sm !shadow-lg hover:!shadow-xl !transition-all !duration-300 !whitespace-nowrap"
            >
              Patient History
            </Button>
          </div>
        </div>

        {/* Contact info */}
        <div className="flex flex-wrap text-[14px] rounded-md w-full items-start gap-1 md:gap-2 mt-1 sm:mt-0">
          <h1 className="flex gap-2 items-center font-normal p-2 rounded-md shrink-0">
            <span className="p-1 bg-[#D9D9D9]  text-gray-700  rounded-full">
              <BsFillTelephoneFill size={12} />
            </span>
            {appointment?.patient?.mobileNumber}
          </h1>
          <h1 className="flex gap-2 items-center font-normal p-2 rounded-md min-w-0">
            <span className="p-1 bg-[#D9D9D9]  text-gray-700  rounded-full shrink-0">
              <HiMail size={14} />
            </span>
            <span className="truncate max-w-[160px] sm:max-w-[220px] lg:max-w-none">
              {appointment?.patient?.email}
            </span>
          </h1>
          <h1 className="flex gap-2 items-center font-normal  p-2 rounded-md min-w-0">
            <span className="p-1 bg-[#D9D9D9]  text-gray-700  rounded-full shrink-0">
              <HiLocationMarker size={14} />
            </span>
            <span className="truncate max-w-[160px] sm:max-w-[220px] lg:max-w-none">
              {appointment?.patient?.address}
            </span>
          </h1>
        </div>

        {appointment?.patient?.referredBy && (
          <h2 className="px-2  text-[14px] font-medium  text-gray-700">
            Referred By -{capitalizeWords(appointment?.patient?.referredBy)}
          </h2>
        )}
      </div>

      <div className="p-2 flex flex-col md:flex-row gap-3 justify-between items-start md:items-center mt-2 ">
        <h1 className=" text-[#521785] flex items-center gap-2 font-medium text-sm sm:text-base">
          <FaCalendarDays className="" /> {todayDate()}
        </h1>
        <div className="flex items-center gap-3 sm:gap-4 justify-end ml-auto">
          <Button
            variant="outlined"
            onClick={handleParameter}
            className="!bg-[#F2E2FF]   !capitalize  !text-[#343c6a] !border-[#dac0f0] !text-xs sm:!text-sm !whitespace-nowrap"
          >
            Add Vitals
          </Button>

          <span className="relative group p-1 bg-[#521785] rounded-full">
            <IoMdPrint
              color="#ffffff"
              onClick={() => setOpenBillModal(!openBillModal)}
              className="cursor-pointer text-[22px] sm:text-[20px] lg:text-[24px]"
            />
            {/* Tooltip */}
            <span className="absolute bottom-full left-1/4 -translate-x-1/2 z-10 mb-2 hidden group-hover:block whitespace-nowrap bg-black text-white text-xs rounded px-2 py-1">
              Generate Bill
            </span>
          </span>
        </div>
      </div>

      <div className="bg-[#F6F6F7] p-2 rounded-lg shadow-sm flex flex-col sm:flex-row gap-2 ">
        <h1 className="font-semibold py-2">Vitals</h1>
        <div className="flex gap-2 items-start text-[13px] sm:text-[15px] py-2 flex-wrap sm:ml-4">
          <p
            className="font-medium p-2 rounded-md flex gap-2 items-center "
            style={{
              background: `linear-gradient(180deg, rgba(252, 171, 171, 0.3) 0%, rgba(255, 153, 102, 0.42) 100%)`,
            }}
          >
            <GiBodyHeight />
            Height :{" "}
            <span className="">{appointment?.parameters?.height} cm</span>
          </p>
          <p
            className="font-medium p-2 rounded-md flex gap-2 items-center"
            style={{
              background: `linear-gradient(180deg, rgba(252, 171, 171, 0.3) 0%, rgba(255, 153, 102, 0.42) 100%)`,
            }}
          >
            <GiWeightScale />
            Weight :{" "}
            <span className="">{appointment?.parameters?.weight} Kg</span>
          </p>

          <p
            className="font-medium p-2 rounded-md flex gap-2 items-center"
            style={{
              background: `linear-gradient(180deg, rgba(252, 171, 171, 0.3) 0%, rgba(255, 153, 102, 0.42) 100%)`,
            }}
          >
            <FaTemperatureQuarter />
            Temperature :{" "}
            <span className="">{appointment?.parameters?.temprature} F</span>
          </p>

          <p
            className="font-medium p-2 rounded-md flex gap-2 items-center"
            style={{
              background: `linear-gradient(180deg, rgba(252, 171, 171, 0.3) 0%, rgba(255, 153, 102, 0.42) 100%)`,
            }}
          >
            <TbHeartRateMonitor />
            BP :{" "}
            <span className="">
              {appointment?.parameters?.bloodPressure} mmHg
            </span>
          </p>

          <p
            className="font-medium p-2 rounded-md flex gap-2 items-center"
            style={{
              background: `linear-gradient(180deg, rgba(252, 171, 171, 0.3) 0%, rgba(255, 153, 102, 0.42) 100%)`,
            }}
          >
            <RiMedicineBottleLine />
            Sugar Level :{" "}
            <span className="">{appointment?.parameters?.sugar} mg/dL</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default CurrentPatient;