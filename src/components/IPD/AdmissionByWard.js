import React, { useMemo } from "react";
import { PieChart, Pie, Cell } from "recharts";

const wardColors = [
  "#521785",
  "#22C55E",
  "#F59E0B",
  "#3B82F6",
  "#EC4899",
];

const AdmissionByWard = ({ wards }) => {
  const admissionByWard = useMemo(() => {
    const total = wards.reduce(
      (sum, w) => sum + (w.occupiedBeds || 0),
      0
    );

    return wards.map((w, i) => ({
      name: w.wardName,
      value: w.occupiedBeds || 0,
      percent: total
        ? Math.round(
            ((w.occupiedBeds || 0) / total) * 100
          )
        : 0,
      color: wardColors[i % wardColors.length],
    }));
  }, [wards]);

  const totalAdmitted = admissionByWard.reduce(
    (s, w) => s + w.value,
    0
  );

  return (
    <div
      className="
        w-full
        xl:w-[28%]
        bg-white
        border
        border-[#e5e5e5]
        rounded-lg
        p-3
        sm:p-4
        xl:p-5
      "
    >
      <h2 className="text-[15px] sm:text-[16px] xl:text-[16px] font-semibold text-[#343C6A] mb-3 sm:mb-4 xl:mb-4">
        Admission by Ward
      </h2>

      <div className="flex flex-col items-center gap-3 sm:gap-4 xl:gap-4">
        {/* Donut Chart */}
        <div className="relative">
          <PieChart width={150} height={150}>
            <Pie
              data={admissionByWard}
              dataKey="value"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={2}
            >
              {admissionByWard.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>
          </PieChart>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[18px] font-bold text-[#343C6A]">
              {totalAdmitted}
            </span>

            <span className="text-[11px] text-[#8BA3CB]">
              Total
            </span>
          </div>
        </div>

        {/* Ward Legend */}
        <div className="w-full flex flex-col gap-1.5 sm:gap-2 xl:gap-1.5">
          {admissionByWard.map((d, i) => (
            <div
              key={i}
              className="
                flex
                justify-between
                items-center
                gap-3
                text-[12px]
                sm:text-[13px]
                xl:text-[13px]
              "
            >
              <span className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: d.color }}
                />

                <span className="text-[#343C6A] truncate">
                  {d.name}
                </span>
              </span>

              <span className="text-[#8BA3CB] whitespace-nowrap shrink-0">
                {d.value} ({d.percent}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdmissionByWard;