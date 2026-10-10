import React, { useMemo } from "react";
import { myImg } from "../../../assets/ICUimages/images";

const StatCard = ({ label, value, subtext, image, color = "text-zinc-900" }) => (
  <div className="relative overflow-hidden bg-white rounded-2xl border border-zinc-200/80 p-4 xl:p-5 2xl:p-4 shadow-sm hover:shadow-md transition duration-200 min-h-[108px] sm:min-h-[112px] xl:min-h-[120px] flex items-center">
    {image && (
      <img
        src={image}
        alt={label}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none select-none z-0"
      />
    )}

    <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-white z-10" />

    {image && (
      <>
        <div className="absolute left-[40%] top-0 bottom-0 w-[25%] bg-gradient-to-r from-white via-white/90 to-transparent pointer-events-none z-10" />
        <div className="absolute left-[42%] top-0 bottom-0 w-[20%] backdrop-blur-[8px] pointer-events-none z-20 [mask-image:linear-gradient(to_right,rgba(0,0,0,1)_20%,rgba(0,0,0,0))]" />
      </>
    )}

    <div className="relative z-30 flex flex-col justify-between h-full w-1/2 pr-2">
      <div>
        <p className="text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider leading-relaxed">
          {label}
        </p>
        <p className={`text-3xl sm:text-4xl xl:text-5xl font-bold mt-1 tracking-tight ${color}`}>
          {value}
        </p>
      </div>

      {subtext && (
        <p className="text-[10px] sm:text-xs text-zinc-400 mt-2 font-medium truncate">
          {subtext}
        </p>
      )}
    </div>
  </div>
);

const ICUAdminPanelOverview = ({ users, beds, admissions }) => {
  const metrics = useMemo(() => {
    const totalBeds = beds.length;

    const occupiedBedNumbers = new Set(
      admissions.map((patient) => patient.bed).filter(Boolean)
    );

    const occupiedBeds = beds.filter((bed) =>
      occupiedBedNumbers.has(bed.bedNumber)
    ).length;

    const availableBeds = beds.filter(
      (bed) => bed.status === "Available" && !occupiedBedNumbers.has(bed.bedNumber)
    ).length;

    const maintenanceBeds = beds.filter((bed) => bed.status === "Maintenance").length;

    const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

    const criticalCount = admissions.filter((p) => p.condition === "Critical").length;

    const activeDocs = users.filter((u) => u.role === "Doctor" && u.status === "Active").length;

    const activeNurses = users.filter((u) => u.role === "Nurse" && u.status === "Active").length;

    return {
      totalBeds,
      occupiedBeds,
      availableBeds,
      maintenanceBeds,
      occupancyRate,
      criticalCount,
      activeDocs,
      activeNurses,
      totalUsers: users.length,
    };
  }, [beds, admissions, users]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4">
      <StatCard label="Total Beds" value={metrics.totalBeds} subtext="ICU capacity" image={myImg.total_beds} color="text-zinc-800" />
      <StatCard label="Occupied Beds" value={metrics.occupiedBeds} subtext={`${metrics.occupancyRate}% occupancy`} image={myImg.beds_occupied} color="text-purple-600" />
      <StatCard label="Available Beds" value={metrics.availableBeds} subtext="Ready for admission" image={myImg.available_beds} color="text-pink-600" />
      <StatCard label="Critical Patients" value={metrics.criticalCount} subtext="Require close watch" image={myImg.icu_critical} color="text-red-600" />
      <StatCard label="Active Doctors" value={metrics.activeDocs} subtext="On-duty consulting" image={myImg.vitals_due} color="text-orange-600" />
      <StatCard label="Active Nurses" value={metrics.activeNurses} subtext="Assigned shift staff" image={myImg.medication_due} color="text-emerald-600" />
      <StatCard label="Total Users" value={metrics.totalUsers} subtext="System access accounts" image={myImg.total_beds} color="text-zinc-800" />
      <StatCard label="Maintenance" value={metrics.maintenanceBeds} subtext="Beds unavailable" image={myImg.available_beds} color="text-amber-600" />
    </div>
  );
};

export default ICUAdminPanelOverview;