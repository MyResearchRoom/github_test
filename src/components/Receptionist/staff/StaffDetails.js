import React, { useEffect, useState } from "react";
import { myImg } from "../../../assets/Images";
import { useFetch } from "../../../hooks/useFetch";

const StaffDetails = ({ receptionistId }) => {
  const [stats, setStats] = useState({});
  const [month, setMonth] = useState(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  });

  const [selectedYear, selectedMonth] = month.split("-");

  const { data } = useFetch(`/api/receptionists/stats/${receptionistId}`, {
    params: {
      month: selectedMonth,
      year: selectedYear,
    },
  }, [receptionistId, month]);

  useEffect(() => {
    if (data) {
      setStats(data);
    }
  }, [data]);

  return (
    <div className="w-full h-full text-[#343c6a]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white text-[#343C6A] px-3 sm:px-4 py-2 mb-3 rounded-lg">
        <h1 className="text-base lg:text-lg font-semibold">Staff Details</h1>

        <div className="flex flex-col xs:flex-row sm:flex-row gap-2 sm:gap-3 items-stretch xs:items-center w-full sm:w-auto">
          <input type="month" name="month" value={month} onChange={(e) => setMonth(e.target.value)} className="h-9 text-sm px-2 sm:px-3 border border-gray-300 rounded-md outline-none focus:ring-purple-400 focus:border-purple-400 transition w-full xs:w-auto" />

          <div className="h-9 flex items-center justify-between xs:justify-center gap-2 bg-purple-50 border border-purple-200 text-purple-700 px-3 py-1 rounded-md text-sm font-medium w-full xs:w-auto">
            <span>Staff ID:</span>
            <span className="font-semibold text-purple-900">{stats?.receptionist?.receptionistId || "-"}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 lg:gap-6 px-2 pb-3">
        <div className="w-full lg:w-[45%] flex items-center gap-3 sm:gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
            <img src={stats?.receptionist?.profile || myImg.userIcon} alt="Staff profile" className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full border-4 border-gray-100" />
          </div>

          <div className="min-w-0 text-sm sm:text-[15px] space-y-1.5 sm:space-y-2">
            <p className="text-[#343C6A] font-bold capitalize break-words">
              Name: <span className="font-semibold">{stats?.receptionist?.name || "-"}</span>
            </p>

            <p className="font-bold text-[#343C6A] break-words">
              Contact No: <span className="font-semibold">{stats?.receptionist?.mobileNumber || "-"}</span>
            </p>

            <p className="font-bold text-[#343C6A] break-all">
              Email: <span className="font-semibold">{stats?.receptionist?.email || "-"}</span>
            </p>
          </div>
        </div>

        <div className="w-full lg:w-[55%] grid grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-3">
          <div className="min-h-20 sm:h-24 rounded-lg flex justify-center items-center flex-col px-2 py-2 text-center bg-[#F2E2FF]">
            <p className="text-[#343C6A] text-xs sm:text-[15px] font-semibold">Total Attendance</p>
            <p className="text-[#343C6A] text-base sm:text-[18px] font-bold">{stats?.totalAttendance || 0}</p>
          </div>

          <div className="min-h-20 sm:h-24 rounded-lg flex justify-center items-center flex-col px-2 py-2 text-center bg-[#F2E2FF]">
            <p className="text-[#343C6A] text-xs sm:text-[15px] font-semibold">Total Leave</p>
            <p className="text-[#343C6A] text-base sm:text-[18px] font-bold">{stats?.leaveCount || 0}</p>
          </div>

          <div className="min-h-20 sm:h-24 rounded-lg flex justify-center items-center flex-col px-2 py-2 text-center bg-[#F2E2FF]">
            <p className="text-[#343C6A] text-xs sm:text-[15px] font-semibold">Avg. Check In</p>
            <p className="text-[#343C6A] text-base sm:text-[18px] font-bold">{stats?.avgCheckInTime || "-"}</p>
          </div>

          <div className="min-h-20 sm:h-24 rounded-lg flex justify-center items-center flex-col px-2 py-2 text-center bg-[#F2E2FF]">
            <p className="text-[#343C6A] text-xs sm:text-[15px] font-semibold">Avg. Check Out</p>
            <p className={`text-center text-[#343C6A] font-bold ${stats?.avgCheckOutTime?.includes(":") ? "text-base sm:text-[18px]" : "text-xs sm:text-[14px]"}`}>
              {stats?.avgCheckOutTime || "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDetails;