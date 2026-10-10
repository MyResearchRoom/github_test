import React, { useEffect, useState } from "react";
import { ChevronDown, Calendar, Loader2 } from "lucide-react";
import { ipdService } from "../../services/ipdService";

import DashboardStatCards from "../../components/IPD/DashboardStatCards";
import OccupancyOverview from "../../components/IPD/OccupancyOverview";
import AdmissionsTrend from "../../components/IPD/AdmissionsTrend";
import AdmissionByWard from "../../components/IPD/AdmissionByWard";
import RecentAdmissionsPanel from "../../components/IPD/RecentAdmissionsPanel";
import QuickActions from "../../components/IPD/QuickActions";

const IPDDashboard = () => {
  const [admissions, setAdmissions] = useState([]);

  const [bedStats, setBedStats] = useState({
    totalBeds: 0,
    occupiedBeds: 0,
    availableBeds: 0,
    maintenanceBeds: 0,
  });

  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");

      try {
        const [admissionsRes, bedStatsRes, wardsRes] =
          await Promise.all([
            ipdService.getAdmissions(),
            ipdService.getBedStats(),
            ipdService.getWards(),
          ]);

        setAdmissions(admissionsRes?.admissions || []);
        setBedStats(bedStatsRes?.stats || {});
        setWards(wardsRes?.wards || []);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div
        className="
          min-h-full
          bg-transparent
          px-4
          py-6
          sm:px-5
          sm:py-8
          lg:p-6
          flex
          items-center
          justify-center
        "
      >
        <div className="flex items-center justify-center gap-2 text-[#8BA3CB] text-[13px] sm:text-[14px]">
          <Loader2
            size={18}
            className="animate-spin shrink-0"
          />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        min-h-full
        w-full
        bg-transparent
        p-1
        flex
        flex-col
        gap-4
        sm:gap-5
      "
    >
      {/* ================= DASHBOARD HEADER ================= */}

      <div
        className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-start
          sm:justify-between
          sm:gap-5
        "
      >
        {/* Title Section */}
        <div className="min-w-0">
          <h1 className="text-[21px] sm:text-[23px] md:text-2xl font-semibold text-[#343C6A]">
            IPD Dashboard
          </h1>

          <p className="text-[#8BA3CB] text-[12px] sm:text-[13px] md:text-sm mt-1 max-w-2xl">
            Overview of inpatient department operations and patient status.
          </p>
        </div>

        {/* Date Button */}
        <button
          className="
            w-full
            sm:w-auto
            sm:shrink-0
            flex
            items-center
            justify-center
            gap-2
            border
            border-[#d3cccc]
            rounded-md
            px-3
            sm:px-4
            py-2
            text-[13px]
            sm:text-[14px]
            text-[#343C6A]
            bg-white
            min-h-[40px]
          "
        >
          <Calendar size={15} className="shrink-0" />

          <span>
            {new Date().toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>

          <ChevronDown size={14} className="shrink-0" />
        </button>
      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <div
          className="
            bg-white
            rounded-lg
            border
            border-[#fbd5d5]
            text-[#EF4444]
            text-[12px]
            sm:text-[13px]
            p-3
            sm:p-4
          "
        >
          {error}
        </div>
      )}

      {/* ================= STATS + QUICK ACTIONS ================= */}

      <div
        className="
          grid
          grid-cols-1
          gap-4
          lg:gap-5
          xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]
          xl:items-start
        "
      >
        {/* Statistics Cards */}
        <div className="min-w-0">
          <DashboardStatCards
            admissions={admissions}
            bedStats={bedStats}
          />
        </div>

        {/* Quick Actions */}
        <div className="min-w-0">
          <QuickActions />
        </div>
      </div>
    
       <div className="flex flex-col lg:flex-row gap-4">
       <OccupancyOverview bedStats={bedStats} />
         <AdmissionsTrend admissions={admissions} />
         <AdmissionByWard wards={wards} />
       </div>

      {/* ================= RECENT ADMISSIONS ================= */}

      <div className="min-w-0">
        <RecentAdmissionsPanel admissions={admissions} />
      </div>
    </div>
  );
};

export default IPDDashboard;





