import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown } from "lucide-react";

const PRIMARY = "#521785";

const AdmissionsTrend = ({ admissions }) => {
  const admissionsTrend = useMemo(() => {
    const counts = {};

    admissions.forEach((p) => {
      counts[p.admissionDate] =
        (counts[p.admissionDate] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([date, count]) => ({
        date,
        count,
      }))
      .sort(
        (a, b) =>
          new Date(a.date) -
          new Date(b.date)
      );
  }, [admissions]);

  return (
    <div
      className="
        flex-1
        min-w-0
        bg-white
        border
        border-[#e5e5e5]
        rounded-lg
        p-3
        sm:p-4
        md:p-5
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-[15px] sm:text-[16px] font-semibold text-[#343C6A]">
          Admissions Trend
        </h2>

        <button
          className="
            flex
            items-center
            gap-1
            shrink-0
            text-[11px]
            sm:text-[12px]
            border
            border-[#d3cccc]
            rounded-md
            px-2
            sm:px-2.5
            py-1
            text-[#343C6A]
            whitespace-nowrap
          "
        >
          Last 7 Days
          <ChevronDown
            size={12}
            className="shrink-0"
          />
        </button>
      </div>

      {/* Chart */}
      <div
        className="
          w-full
          h-[190px]
          sm:h-[200px]
          md:h-[210px]
        "
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={admissionsTrend}
            margin={{
              top: 5,
              right: 5,
              left: -18,
              bottom: 0,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              tick={{
                fontSize: 10,
              }}
              interval="preserveStartEnd"
              minTickGap={15}
            />

            <YAxis
              tick={{
                fontSize: 10,
              }}
              width={35}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="count"
              stroke={PRIMARY}
              strokeWidth={2}
              dot={{
                r: 4,
                fill: PRIMARY,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdmissionsTrend;