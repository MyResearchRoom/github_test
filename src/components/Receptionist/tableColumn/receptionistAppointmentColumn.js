import { IoMdPrint } from "react-icons/io";
import CustomSelect from "../../../commonComponent/CustomSelect";
import convertTimeRange from "../../../utils/combineDateTime";
import { Button } from "@mui/material";
import { myImg } from "../../../assets/Images";

export const receptionistAppointmentColumn = ({
  date,
  handleStatusChange,
  handlePaymentModeChange,
  openBillModal,
  setOpenBillModal,
  setBillData,
  handleParameter,
  handleRescheduleAppointment,
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
      render: (patient) => (
        <p className="pl-1">
          {patient?.patient?.name} <br />
          <span
            className={`${patient?.patient?.mobileNumber ? "block" : "hidden"}`}
          >
            ({patient?.patient?.mobileNumber})
          </span>
        </p>
      ),
      headerClassName: "text-left pl-1 ",
      className: "text-left text-sm",
    },
    {
      label: "Patient Id",
      feild: "",
      render: (patient) => (
        <p className="pl-1">{patient?.patient?.patientId}</p>
      ),
      headerClassName: "text-left pl-1 ",
      className: "text-left text-sm pl-1",
    },
    {
      label: "Time",
      field: "",
      render: (patient) => (
        <p className="pl-1">
          {patient?.date &&
            patient.appointmentTime &&
            `${convertTimeRange(patient.appointmentTime)}`}
        </p>
      ),
      headerClassName: "text-left pl-1 ",
      className: "text-left text-sm pl-1",
    },
    {
      label: "Visit Reason",
      field: "reason",
      headerClassName: "text-left pl-1 ",
      className: "text-left text-sm pl-1",
    },
    {
      label: "Fees",
      field: "",
      render: (patient) => (
        <p className="text-[#10972E] pl-1">
          {" "}
          Rs. {Number(patient?.fees || 0) + Number(patient?.extraFees || 0)}
        </p>
      ),
      headerClassName: "text-left pl-1 ",
      className: "text-left text-sm pl-1",
    },
    {
      label: "Process",
      field: "",
      render: (patient) => (
        <div
          className={`  !capitalize ${
            patient.process === "In-Person"
              ? " !text-[#b76df3]"
              : "!text-[#58b3f8]"
          }`}
        >
          {patient.process}
        </div>
      ),
      headerClassName: "text-center ",
      className: "text-center text-sm ",
    },
    {
      label: "Status",
      field: "",
      render: (patient) => (
        <CustomSelect
          value={patient.status}
          onChange={(selectedOption) =>
            handleStatusChange(selectedOption, patient.id)
          }
          options={["in", "out"]}
          selectedDate={date}
        />
      ),
      headerClassName: "text-center ",
      className: "text-center text-sm w-[10%] px-2",
    },
    {
      label: "Payment Mode",
      field: "",
      render: (patient) => (
        <CustomSelect
          onChange={(selectedOption) =>
            handlePaymentModeChange(selectedOption, patient.id)
          }
          value={patient.paymentMode}
          options={["Online", "Cash"]}
          selectedDate={date}
        />
      ),
      headerClassName: "text-center ",
      className: "text-center text-sm w-[10%] px-2",
    },
    {
      label: "Action",
      field: "",
      render: (patient) => (
        <div
          onClick={() => handleRescheduleAppointment(patient)}
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
      label: "Vitals",
      field: "",
      render: (patient) => (
        <Button
          variant="outlined"
          onClick={() => handleParameter(patient.id, patient.parameters)}
          className="!bg-[#F2E2FF] !border-none !capitalize !text-[#343c6a]"
        >
          {patient.parameters ? "Added" : "Add"}
        </Button>
      ),
      headerClassName: "text-center ",
      className: "text-center text-sm ",
    },
    {
      label: "Bill",
      field: "",
      render: (patient) => (
        <p className="flex items-center justify-center">
          <IoMdPrint
            size={24}
            onClick={() => {
              setBillData(patient);
              setOpenBillModal(!openBillModal);
            }}
            color="#343c6a"
            className="cursor-pointer"
          />
        </p>
      ),
      headerClassName:
        "text-center ",
      className: "text-center text-sm ",
    },
  ];
};
