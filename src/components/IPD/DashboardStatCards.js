import React, { useMemo } from "react";
import { BedDouble, UserRound, Bed as BedIcon, ActivitySquare } from "lucide-react";


const DashboardStatCards = ({ admissions, bedStats }) => {
const currentlyAdmitted = admissions.length;
const underTreatmentCount = admissions.filter((p) => p.status === "Under Treatment").length;
const criticalCount = admissions.filter((p) => p.status === "Critical").length;
const totalBeds = bedStats.totalBeds || 0;
const occupiedBeds = bedStats.occupiedBeds || 0;

const statCards = useMemo(
() => [
  {
    icon: BedDouble,
    bg: "#F3E8FF",
    color: "#9333EA",
    heading: "Total Admitted",
    value: currentlyAdmitted ,
    sub: "Patients",
    // trend: "12% from yesterday",
  },
  {
    icon: UserRound,
    bg: "#DCFCE7",
    color: "#16A34A",
    heading: "Currently Admitted",
    value: currentlyAdmitted,
    sub: "Patients",
    // trend: "8% from yesterday",
  },
  {
    icon: BedIcon,
    bg: "#E0F2FE",
    color: "#2563EB",
    heading: "Total Beds",
    value: totalBeds,
    sub: "Beds",
    trend: null,
  },
  {
    icon: BedIcon,
    bg: "#FEF3C7",
    color: "#D97706",
    heading: "Occupied Beds",
    value: occupiedBeds,
    sub: "Beds",
    trend: totalBeds ? `${Math.round((occupiedBeds / totalBeds) * 100)}% Occupancy` : "0% Occupancy",
    trendColor: "text-[#D97706]",
  },
  {
    icon: ActivitySquare,
    bg: "#FEE2E2",
    color: "#EF4444",
    heading: "Under Treatment",
    value: underTreatmentCount,
    sub: "Patients",
    trend: `${criticalCount} Critical`,
    trendColor: "text-[#EF4444]",
  },
],
[currentlyAdmitted, underTreatmentCount, criticalCount, totalBeds, occupiedBeds]
);

return (
  <>
          <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
          {statCards.map((s, i) => {
          const Icon = s.icon;
    
    return (
          <div key={i} className="min-w-0 bg-white border border-[#e5e5e5] rounded-lg p-3 sm:p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
        <div
        className="w-9 h-9 sm sm rounded-full flex items-center justify-center shrink-0"
        style={{ background: s.bg }}
        >
        <Icon size={19} color={s.color} />
        </div>
        <span className="text-[12px] sm:text-[13px] font-medium text-[#343C6A] truncate">
        {s.heading}
        </span>
</div>
<p className="text-[22px] sm:text-[26px] font-bold text-[#343C6A] leading-none">
{s.value}
</p>
<p className="text-[11px] text-[#8BA3CB]">{s.sub}</p>
{s.trend && (
<p className={`text-[11px] font-medium ${s.trendColor || "text-[#16A34A]"}`}>
{s.trend}
</p>
)}
</div>
);
})}

</div>
      
</>
);
};

export default DashboardStatCards;


// import React, { useMemo } from "react";
// import { BedDouble, UserRound, Bed as BedIcon, ActivitySquare } from "lucide-react";

// const DashboardStatCards = ({ admissions, bedStats }) => {
//   const currentlyAdmitted = admissions.length;
//   const underTreatmentCount = admissions.filter((p) => p.status === "Under Treatment").length;
//   const criticalCount = admissions.filter((p) => p.status === "Critical").length;
//   const totalBeds = bedStats.totalBeds || 0;
//   const occupiedBeds = bedStats.occupiedBeds || 0;

//   const statCards = useMemo(
//     () => [
//       {
//         icon: BedDouble,
//         bg: "#F3E8FF",
//         color: "#9333EA",
//         heading: "Total Admitted",
//         value: currentlyAdmitted + 150,
//         sub: "Patients",
//         trend: "12% from yesterday",
//       },
//       {
//         icon: UserRound,
//         bg: "#DCFCE7",
//         color: "#16A34A",
//         heading: "Currently Admitted",
//         value: currentlyAdmitted,
//         sub: "Patients",
//         trend: "8% from yesterday",
//       },
//       {
//         icon: BedIcon,
//         bg: "#E0F2FE",
//         color: "#2563EB",
//         heading: "Total Beds",
//         value: totalBeds,
//         sub: "Beds",
//         trend: null,
//       },
//       {
//         icon: BedIcon,
//         bg: "#FEF3C7",
//         color: "#D97706",
//         heading: "Occupied Beds",
//         value: occupiedBeds,
//         sub: "Beds",
//         trend: totalBeds ? `${Math.round((occupiedBeds / totalBeds) * 100)}% Occupancy` : "0% Occupancy",
//         trendColor: "text-[#D97706]",
//       },
//       {
//         icon: ActivitySquare,
//         bg: "#FEE2E2",
//         color: "#EF4444",
//         heading: "Under Treatment",
//         value: underTreatmentCount,
//         sub: "Patients",
//         trend: `${criticalCount} Critical`,
//         trendColor: "text-[#EF4444]",
//       },
//     ],
//     [currentlyAdmitted, underTreatmentCount, criticalCount, totalBeds, occupiedBeds]
//   );

//   return (
//     <div className="flex w-full justify-between gap-3">
//       {statCards.map((s, i) => {
//         const Icon = s.icon;
//         return (
//           <div key={i} className="flex-1 bg-white border border-[#e5e5e5] rounded-lg p-4 flex flex-col gap-2">
//             <div className="flex items-center gap-3">
//               <div
//                 className="w-10 h-10 rounded-full flex items-center justify-center"
//                 style={{ background: s.bg }}
//               >
//                 <Icon size={19} color={s.color} />
//               </div>
//               <span className="text-[13px] font-medium text-[#343C6A]">{s.heading}</span>
//             </div>
//             <p className="text-[26px] font-bold text-[#343C6A] leading-none">{s.value}</p>
//             <p className="text-[11px] text-[#8BA3CB]">{s.sub}</p>
//             {s.trend && (
//               <p className={`text-[11px] font-medium ${s.trendColor || "text-[#16A34A]"}`}>{s.trend}</p>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default DashboardStatCards;
