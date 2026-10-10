import React, { useEffect, useState } from "react";
import ShowCard from "../../../commonComponent/ShowCard";
import { useFetch } from "../../../hooks/useFetch";

const DoctorCount = () => {
  const [doctorStats, setDoctorStats] = useState(null);
  const { data: stats } = useFetch(`/api/subdoctors/stats`);

  useEffect(() => {
    if (stats?.data) {
      setDoctorStats(stats?.data);
    }
  }, [stats]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full mt-3 sm:mt-0">
      <ShowCard
        heading={"Total Doctors"}
        value={doctorStats?.totalDoctorsCount}
        className={
          "w-full bg-white border border-gray-200 font-semibold text-[#343c6a] shadow-sm"
        }
        valueClassName={"text-blue-600"}
        headerClassName={"text-[#343c6a] font-normal"}
      />

      <ShowCard
        heading={"Active Doctors"}
        value={doctorStats?.activeDoctorsCount}
        className={
          "w-full bg-white border border-gray-200 font-semibold text-[#343c6a] shadow-sm"
        }
        valueClassName={"text-green-700"}
        headerClassName={"text-[#343c6a] font-normal"}
      />

      <ShowCard
        heading={"Patients Today"}
        value={doctorStats?.patientCount}
        className={
          "w-full bg-white border border-gray-200 font-semibold text-[#343c6a] shadow-sm"
        }
        valueClassName={"text-purple-600"}
        headerClassName={"text-[#343c6a] font-normal"}
      />

      <ShowCard
        heading={"Specializations"}
        value={doctorStats?.specializationCount}
        className={
          "w-full bg-white border border-gray-200 font-semibold text-[#343c6a] shadow-sm"
        }
        valueClassName={"text-red-500"}
        headerClassName={"text-[#343c6a] font-normal"}
      />
    </div>
  );
};

export default DoctorCount;