import React, { useState } from "react";

import {
  AgePieChart,
  GenderPieChart,
  HospitalBarChart,
  RevenueChart,
} from "../../components/Doctor/reports/index";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DoctorReports = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  return (
    <>
      <div
        className="w-full min-h-full xl:h-full gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 lg:grid-rows-[30%_40%_50%] xl:grid-rows-[40%_70%] grid-rows-auto overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="bg-white shadow-md rounded-lg flex flex-col gap-2 p-2 min-h-[300px] md:min-h-[320px] lg:min-h-0">
          <AgePieChart />
        </div>

        <div className="bg-white shadow-md rounded-lg p-2 min-h-[300px] md:min-h-[320px] lg:min-h-0">
          <GenderPieChart />
        </div>

        <div className="h-auto min-h-[300px] md:min-h-[320px] bg-white shadow-md p-2 rounded-lg col-span-1 lg:col-span-1 md:col-span-2 xl:col-span-1">
          <RevenueChart />
        </div>

        <div className="w-full min-h-[400px] md:min-h-[450px] col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-3 bg-white shadow-md rounded-lg flex flex-col items-start">
          <div className="w-full flex flex-col sm:flex-row justify-center sm:justify-between gap-2 sm:gap-0 mt-3 items-center px-3">
            <h1 className="text-[17px] sm:text-[18px] font-semibold text-center">
              Hospital Revenue
            </h1>

            <div className="sm:ml-auto">
              <DatePicker
                selected={new Date(selectedYear, 0)}
                onChange={(date) => setSelectedYear(date.getFullYear())}
                className="border border-gray-400 h-8 px-2 rounded-sm outline-none cursor-pointer bg-white text-gray-700 text-sm w-[80px]"
                calendarClassName="!text-sm"
                showYearPicker
                dateFormat="yyyy"
              />
            </div>
          </div>

          <h1 className="text-[#6B7280] text-center w-full text-[13px] sm:text-[14px] px-2 mt-1">
            Revenue per month per year (₹)
          </h1>

          <div className="w-full h-[350px] md:h-[400px] lg:h-[75%] mt-2">
            <HospitalBarChart year={selectedYear} />
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorReports;