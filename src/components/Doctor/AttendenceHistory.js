import React, { useEffect, useState } from "react";
import "../../index.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useFetch } from "../../hooks/useFetch";

const AttendenceHistory = ({ receptionistId }) => {
  const [filter, setFilter] = useState("");
  const [month, setMonth] = useState(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  });
  const [attendanceHistory, setAttendanceHistory] = useState([]);

  const [selectedYear, selectedMonth] = month.split("-");

  const { data } = useFetch(
    localStorage.getItem("role") === "doctor"
      ? `api/receptionists/attendance-history/${receptionistId}`
      : `api/receptionists/attendance/history`,
    {
      params: {
        status: filter,
        month: selectedMonth,
        year: selectedYear,
      },
    },
    [receptionistId, filter, month]
  );

  useEffect(() => {
    if (data?.attendanceHistory) {
      setAttendanceHistory(data.attendanceHistory);
    }
  }, [data]);

  const getDateFromMonth = (monthValue) => {
    const [year, month] = monthValue.split("-");
    const today = new Date();
    const day = today.getDate();
    return new Date(year, month - 1, day);
  };

  const getMonthFromDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  const handleCalendarChange = (date) => {
    setMonth(getMonthFromDate(date));
  };

  const getTileClassName = ({ date }) => {
    const attendance = attendanceHistory.find(
      (item) => new Date(item.date).toDateString() === date.toDateString()
    );

    if (attendance) {
      if (attendance.status === "On Time") return "on-time";
      if (attendance.status === "Late") return "late";
      if (attendance.status === "Leave") return "leave";
    }

    return "";
  };

  useEffect(() => {
    const calendarTiles = document.querySelectorAll(".react-calendar__tile abbr");

    calendarTiles.forEach((tile) => {
      const dayNumber = tile.innerText;

      if (dayNumber && dayNumber.length === 1) {
        tile.innerText = `0${dayNumber}`;
      }
    });
  }, []);

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-3 sm:px-4 py-2 min-h-[12%] bg-white rounded-t-lg">
        <h1 className="text-base sm:text-lg font-semibold text-[#343C6A]">Attendance History</h1>

        <div className="flex flex-col xs:flex-row sm:flex-row items-stretch xs:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <input type="month" name="month" value={month} onChange={(e) => setMonth(e.target.value)} className="h-9 text-sm px-2 sm:px-3 border border-gray-300 rounded-md outline-none focus:ring-purple-400 focus:border-purple-400 transition w-full xs:w-auto" />

          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="h-9 text-sm px-2 sm:px-3 border border-gray-300 rounded-md outline-none focus:ring-purple-400 focus:border-purple-400 transition w-full xs:w-auto">
            <option value="">All</option>
            <option value="On Time">On Time</option>
            <option value="Late">Late</option>
            <option value="Leave">Leave</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between gap-3 lg:gap-4 h-[88%] overflow-y-auto lg:overflow-hidden">
        <div className="w-full lg:w-[65%] h-auto lg:h-full p-2 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <div className="hidden lg:block">
            <table className="w-full bg-white rounded-lg shadow-md">
              <thead className="bg-[#f9fafb] sticky top-0 z-10">
                <tr className="text-[#343c6a] text-sm border-b">
                  <th className="font-semibold w-[20%] text-left px-3 py-2">Date</th>
                  <th className="font-semibold w-[20%] text-center px-3 py-2">Status</th>
                  <th className="font-semibold w-[20%] text-center px-3 py-2">Check In</th>
                  <th className="font-semibold w-[20%] text-center px-3 py-2">Check Out</th>
                  <th className="font-semibold w-[20%] text-center px-3 py-2">Total Hrs</th>
                </tr>
              </thead>

              <tbody>
                {attendanceHistory.length > 0 ? (
                  attendanceHistory.map((item, index) => {
                    const statusClass =
                      item.status === "On Time"
                        ? "bg-green-100 text-green-700"
                        : item.status === "Late"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700";

                    return (
                      <tr key={item.date} className={`text-sm font-medium text-[#343c6a] ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                        <td className="px-3 py-2">{item.date}</td>
                        <td className="px-3 py-2 text-center">
                          <span className={`px-2 py-1 inline-block w-[100px] text-center rounded-full text-xs font-medium ${statusClass}`}>{item.status}</span>
                        </td>
                        <td className="px-3 py-2 text-center">{item.checkInTime}</td>
                        <td className="px-3 py-2 text-center">{item.checkOutTime}</td>
                        <td className="px-3 py-2 text-center">{item.totalHours}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-400">No attendance records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden flex flex-col gap-3">
            {attendanceHistory.length > 0 ? (
              attendanceHistory.map((item) => {
                const statusClass =
                  item.status === "On Time"
                    ? "bg-green-100 text-green-700"
                    : item.status === "Late"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700";

                return (
                  <div key={item.date} className="bg-white border border-gray-200 rounded-xl shadow-sm p-3 sm:p-4">
                    <div className="flex justify-between items-center gap-2 pb-3 mb-3 border-b border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Date</p>
                        <p className="text-sm sm:text-base font-semibold text-[#343c6a]">{item.date}</p>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusClass}`}>{item.status}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="bg-gray-50 rounded-lg p-2.5">
                        <p className="text-xs text-gray-500 mb-1">Check In</p>
                        <p className="text-sm font-semibold text-[#343c6a]">{item.checkInTime || "-"}</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-2.5">
                        <p className="text-xs text-gray-500 mb-1">Check Out</p>
                        <p className="text-sm font-semibold text-[#343c6a]">{item.checkOutTime || "-"}</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-2.5 col-span-2 sm:col-span-1">
                        <p className="text-xs text-gray-500 mb-1">Total Hours</p>
                        <p className="text-sm font-semibold text-[#343c6a]">{item.totalHours || "-"}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex justify-center items-center py-10 text-gray-400">
                <p className="text-sm sm:text-base">No attendance records found.</p>
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-[30%] h-auto lg:h-full p-2 pb-4">
          <div className="bg-white rounded-xl flex justify-center lg:justify-end w-full">
            <Calendar
              onChange={handleCalendarChange}
              value={getDateFromMonth(month)}
              activeStartDate={getDateFromMonth(month)}
              onActiveStartDateChange={({ activeStartDate }) => {
                setMonth(getMonthFromDate(activeStartDate));
              }}
              tileClassName={getTileClassName}
              className="w-full max-w-[420px] rounded-lg [&_.react-calendar__tile]:rounded-lg [&_.react-calendar__tile]:transition [&_.react-calendar__tile:hover]:bg-purple-100 [&_.react-calendar__tile--active]:bg-purple-500 [&_.react-calendar__tile--active]:text-white [&_.react-calendar__navigation__label]:font-semibold [&_.react-calendar__navigation__arrow]:text-purple-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendenceHistory;