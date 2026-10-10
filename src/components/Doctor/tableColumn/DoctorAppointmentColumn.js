import { Button } from "@mui/material";
import { capitalizeWords } from "../../../utils/capitalizeWords";
import convertTimeRange from "../../../utils/combineDateTime";
import { IoMdPrint } from "react-icons/io";
import { myImg } from "../../../assets/Images";

export const DoctorAppointmentColumn = ({
  handleOpenModal,
  setOpenBillModal,
  setBillData,
  openBillModal,
  handleRescheduleAppointment
}) => {
  return [
    {
      label: "Sr No.",
      field: "",
      render: (_, idx) => idx + 1,
      headerClassName:
        "text-left pl-1 ",
      className: "text-sm text-left pl-1 ",
    },
    {
      label: "Patient Name",
      field: "",
      render: (item) => (
        <p className="text-sm pl-1">
          {capitalizeWords(item?.patient?.name)} <br />
          <span
            className={`${item?.patient?.mobileNumber ? "block" : "hidden"}`}
          >
            ({item?.patient?.mobileNumber})
          </span>
        </p>
      ),
      headerClassName: "text-left pl-1 ",
      className: "text-left text-sm",
    },
    {
      label: "PID",
      field: "",
      render: (item) => (
        <>
          <p className="pl-1">{item?.patient?.patientId}</p>
        </>
      ),
      headerClassName: "text-left pl-1 ",
      className: "text-left text-sm pl-1",
    },
    {
      label: "Time",
      field: "",
      render: (item) => (
        <p className="pl-1">
          {item?.date &&
            item.appointmentTime &&
            `${convertTimeRange(item.appointmentTime)}`}
        </p>
      ),
      headerClassName: "text-left pl-1 ",
      className: "text-left text-sm pl-1",
    },
    {
      label: "Visit Reason",
      field: "reason",
      headerClassName: "text-left pl-2 min-w-0 max-w-xs",
      className: "text-left text-sm pl-2 min-w-0 max-w-[50px] whitespace-normal break-all",
    },
    {
      label: "Fees",
      field: "fees",
      render: (item) => (
        <p className="text-[#10972E] pl-1">
          {" "}
          Rs. {Number(item.fees || 0) + Number(item.extraFees || 0)}
        </p>
      ),
      headerClassName: "text-left pl-1 ",
      className: "text-left text-sm pl-1",
    },
    {
      label: "Process",
      field: "process",
      render: (item) => (
        <p
          className={`!capitalize   ${
            item.process === "In-Person"
              ? " !text-[#b76df3]"
              : "!text-[#58b3f8]"
          }`}
        >
          {item.process}
        </p>
      ),
      headerClassName: "text-center ",
      className: "text-center text-sm",
    },
    {
      label: "Status",
      field: "status",
      render: (item) => (
        <button
          className={`w-20 h-6 md:w-24 md:h-8  rounded-md ${
            item.status === "out"
              ? " bg-[#B4FFC5] text-[#085B1B]"
              : item.status === "cancel"
              ? "bg-[#ffe1e1] text-[#E50F0F]"
              : " bg-[#FBFFBF] text-[#464A05]"
          }`}
        >
          {item.status === "out"
            ? "Completed"
            : item.status === "cancel"
            ? "Cancelled"
            : "Pending"}
        </button>
      ),
      headerClassName: "text-center ",
      className: "text-center text-sm",
    },
    {
      label: "Payment Mode",
      field: "paymentMode",
      render: (item) => (
        <button
          className={`w-20 h-6 md:w-24 md:h-8 ${
            !item.paymentMode ? "" : "bg-[#B4FFC5] text-[#085B1B]"
          }  rounded-lg`}
        >
          {item.paymentMode ?? "-"}
        </button>
      ),
      headerClassName: "text-center ",
      className: "text-center text-sm",
    },
    {
      label: "Vitals",
      field: "",
      render: (item) => (
        <Button
          variant="outlined"
          className=" !capitalize !bg-[#F2E2FF] !border-none !text-[#343C6A] rounded-lg"
          onClick={() => handleOpenModal(item?.id, item?.parameters)}
        >
          Vitals
        </Button>
      ),
      headerClassName: "text-center ",
      className: "text-center text-sm",
    },
    {
          label: "Action",
          field: "",
          render: (item) => (
            <div
              onClick={() => handleRescheduleAppointment(item)}
              className="relative group flex items-center justify-center cursor-pointer"
            >
              {/* Icon */}
              <img
                src={myImg.schedule}
                className="h-6 w-6 object-cover"
                alt="Reschedule"
              />
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg z-20">
                Reschedule Appointment
              </div>
            </div>
          ),
          headerClassName: "text-center ",
          className: "text-center text-sm ",
        },
    {
      label: "Bill",
      field: "",
      render: (item) => (
        <p className="flex items-center justify-center">
          <IoMdPrint
            size={24}
            onClick={() => {
              setBillData(item);
              setOpenBillModal(!openBillModal);
            }}
            color="#343c6a"
            className="cursor-pointer"
          />
        </p>
      ),
      className: "text-center text-sm",
      headerClassName:
        "text-center ",
    },
  ];
};
