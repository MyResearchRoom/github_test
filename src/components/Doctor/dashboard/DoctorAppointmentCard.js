import convertTimeRange from "../../../utils/combineDateTime";
import { capitalizeWords } from "../../../utils/capitalizeWords";

const DoctorAppointmentCard = ({
  handleStatusChange,
  appointment,
  item,
  idx,
}) => {
  return (
    <div
      //   key={item.id}
      onClick={() => handleStatusChange(item)}
      className={` cursor-pointer p-4 rounded-lg  hover:shadow-md transition-all border border-gray-100 ${
        appointment.id === item.id
          ? "bg-[#f4ecfa] border border-gray-300"
          : "bg-white shadow-sm"
      }`}
    >
      <span className=""></span>
      {/* Patient Name & Status */}
      <div className="flex justify-between items-center">
        <p className="font-semibold text-gray-800 text-sm sm:text-base">
          <span className="mr-1">
            {idx + 1}
            {"]"}
          </span>
          {capitalizeWords(item?.patient?.name)}
        </p>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.status === "out"
              ? "bg-green-100 text-green-700"
              : item.status === "cancel"
              ? "bg-[#ffe1e1] text-[#E50F0F]"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {item.status === "out"
            ? "Completed"
            : item.status === "cancel"
            ? "Cancelled"
            : "Pending"}
        </span>
      </div>

      {/* Patient ID */}
      <p className="text-sm text-gray-500 mt-1">
        ID: {item?.patient?.patientId}
      </p>

      {/* Appointment Time */}
      <p className="text-xs text-gray-400 mt-1">
        {item?.date &&
          item.appointmentTime &&
          `${convertTimeRange(item.appointmentTime)}`}
      </p>
    </div>
  );
};

export default DoctorAppointmentCard;
