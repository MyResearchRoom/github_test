import React, { useMemo } from "react";
import { PieChart, Pie, Cell } from "recharts";

const PRIMARY = "#521785";

const OccupancyOverview = ({ bedStats }) => {
const totalBeds = bedStats.totalBeds || 0;
const occupiedBeds = bedStats.occupiedBeds || 0;
const availableBeds = bedStats.availableBeds || 0;
const maintenanceBeds = bedStats.maintenanceBeds || 0;

const occupancyData = useMemo(
() => [
{ name: "Occupied", value: occupiedBeds, color: PRIMARY },
{ name: "Available", value: availableBeds, color: "#22C55E" },
{ name: "Under Maintenance", value: maintenanceBeds, color: "#F59E0B" },
],
[occupiedBeds, availableBeds, maintenanceBeds]
);

return ( <div className="w-full lg:w-[32%] bg-white border border-[#e5e5e5] rounded-lg p-3 sm:p-4 lg:p-5"> <h2 className="text-[15px] sm:text-[16px] font-semibold text-[#343C6A] mb-3 sm:mb-4">
Occupancy Overview </h2>


  <div className="flex flex-col items-center justify-center">
    <div className="relative shrink-0">
      <PieChart width={160} height={160}>
        <Pie
          data={occupancyData}
          dataKey="value"
          innerRadius={50}
          outerRadius={75}
          paddingAngle={2}
        >
          {occupancyData.map((d, i) => (
            <Cell key={i} fill={d.color} />
          ))}
        </Pie>
      </PieChart>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[20px] font-bold text-[#343C6A]">
          {totalBeds}
        </span>
        <span className="text-[11px] text-[#8BA3CB]">
          Total Beds
        </span>
      </div>
    </div>

    <div className="w-full mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
      {occupancyData.map((d, i) => (
        <div
          key={i}
          className="flex items-center gap-2 text-[12px] sm:text-[13px] whitespace-nowrap"
        >
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ background: d.color }}
          />
          <span className="text-[#343C6A]">
            {d.name}
          </span>

          <span className="text-[#8BA3CB]">
            {d.value} (
            {totalBeds
              ? Math.round((d.value / totalBeds) * 100)
              : 0}
            %)
          </span>
        </div>
      ))}
    </div>
  </div>
</div>


);
};

export default OccupancyOverview;











// import React, { useMemo } from "react";
// import { PieChart, Pie, Cell } from "recharts";

// const PRIMARY = "#521785";

// const OccupancyOverview = ({ bedStats }) => {
//   const totalBeds = bedStats.totalBeds || 0;
//   const occupiedBeds = bedStats.occupiedBeds || 0;
//   const availableBeds = bedStats.availableBeds || 0;
//   const maintenanceBeds = bedStats.maintenanceBeds || 0;

//   const occupancyData = useMemo(
//     () => [
//       { name: "Occupied", value: occupiedBeds, color: PRIMARY },
//       { name: "Available", value: availableBeds, color: "#22C55E" },
//       { name: "Under Maintenance", value: maintenanceBeds, color: "#F59E0B" },
//     ],
//     [occupiedBeds, availableBeds, maintenanceBeds]
//   );

//   return (
//     <div className="w-[32%] bg-white border border-[#e5e5e5] rounded-lg p-5">
//       <h2 className="text-[16px] font-semibold text-[#343C6A] mb-4">Occupancy Overview</h2>
//       <div className="flex items-center gap-4">
//         <div className="relative">
//           <PieChart width={160} height={160}>
//             <Pie data={occupancyData} dataKey="value" innerRadius={50} outerRadius={75} paddingAngle={2}>
//               {occupancyData.map((d, i) => (
//                 <Cell key={i} fill={d.color} />
//               ))}
//             </Pie>
//           </PieChart>
//           <div className="absolute inset-0 flex flex-col items-center justify-center">
//             <span className="text-[20px] font-bold text-[#343C6A]">{totalBeds}</span>
//             <span className="text-[11px] text-[#8BA3CB]">Total Beds</span>
//           </div>
//         </div>
//         <div className="flex flex-col gap-2">
//           {occupancyData.map((d, i) => (
//             <div key={i} className="flex items-center gap-2 text-[13px]">
//               <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
//               <span className="text-[#343C6A]">{d.name}</span>
//               <span className="text-[#8BA3CB]">
//                 {d.value} ({totalBeds ? Math.round((d.value / totalBeds) * 100) : 0}%)
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OccupancyOverview;
