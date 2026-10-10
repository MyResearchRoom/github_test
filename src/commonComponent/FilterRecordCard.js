import { IoIosSearch } from "react-icons/io";
import { formatTime } from "../utils/formatTime";

const FilterRecordCard = ({ children }) => {
  return (
    <div className="p-2 sm:p-3 flex flex-col lg:flex-row justify-between lg:items-center items-stretch lg:gap-4 gap-3">
      {children}
    </div>
  );
};

export default FilterRecordCard;

FilterRecordCard.Search = function ({ placeholder = "Search...", onChange }) {
  return (
    <div className="relative w-full sm:w-[60%] md:w-[50%] lg:w-[40%] lg:h-10 h-9">
      <input
        type="search"
        placeholder={placeholder}
        onChange={onChange}
        className="w-full h-full border outline-none border-gray-300 focus:border-gray-500 bg-gray-100 pl-8 pr-2 rounded-lg"
      />
      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
        <IoIosSearch size={18} />
      </span>
    </div>
  );
};

FilterRecordCard.DoctorSelect=function({value,onChange,data}){
  return(
    <select value={value} onChange={onChange} className="h-9 lg:h-10 w-full sm:w-full lg:w-44 min-w-0
     truncate rounded-lg border border-gray-300 focus:border-gray-500 bg-white text-gray-700 text-sm 
     lg:text-sm px-3 pr-3 outline-none">
      <option disabled value=''>Select Doctor</option>
      {
        data.length>0 && data.map((item)=>(
          <option key={item.id} value={`${item.id}-${item.type}`}>{item.name}- {item.specialization}</option>
        ))
      }
    </select>
  )
}

FilterRecordCard.Select = function ({ value, slots, onChange }) {
  return (
    <select
      className=" h-9 lg:h-10  w-full sm:w-full lg:w-44 min-w-0 rounded-lg border border-gray-300 
      focus:border-gray-500 bg-white text-gray-700 px-3 pr-3 truncate outline-none"
      value={value}
      onChange={onChange}
    >
      <option value="" className="  text-sm lg:text-sm">Choose slot</option>
      {slots?.map((slot) => (
        <option
          key={slot.id}
          className=" text-sm lg:text-sm"
          value={`${slot.startTime} - ${slot.endTime}`}
        >
          {slot.slotName} - {formatTime(slot.startTime)} –{" "}
          {formatTime(slot.endTime)}
        </option>
      ))}
    </select>
  );
};

FilterRecordCard.Date = function ({ value, onChange }) {
  return (
    <input
      type="date"
      value={value}
      onChange={onChange}
      onClick={(e) => e.target.showPicker()}
      className=" h-9 lg:h-10  w-full sm:w-full lg:w-auto min-w-0 rounded-lg border border-gray-300 focus:border-gray-500
       bg-white text-gray-700 text-sm lg:text-sm px-3 outline-none"
    />
  );
};

FilterRecordCard.Filters = function ({ children }) {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:flex-row lg:flex gap-3 justify-start lg:justify-end items-stretch lg:items-center">
      {children}
    </div>
  );
};
