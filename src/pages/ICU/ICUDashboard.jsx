import React, { useMemo, useState } from "react";
import { Eye, Plus, Search } from "lucide-react";
import { criticalPatientsData, icuBedData, statCards, todaysTasksData } from "../../data/ICU/dashboardData/dashboardData";
import TableComponent from "../../commonComponent/TableComponent";

const taskStatusBadge = (status) =>
  status === "Overdue" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700";

const ICUDashboard = () => {

  const handleViewCritical = (row) => {
    console.log("View critical patient", row);
  };

  const criticalColumns = [
    {
      label: "Patient",
      headerClassName: "text-left px-5",
      className: "px-5",
      render: (row) => (
        <div>
          <p className="font-semibold text-zinc-900">{row.patient}</p>
          <p className="text-xs text-zinc-400">{row.age}/{row.gender}</p>
        </div>
      ),
    },
    {
      label: "Bed",
      field: "bed",
      headerClassName: "text-left px-5",
      className: "px-5 font-semibold text-zinc-800",
    },
    {
      label: "Last Vitals",
      field: "lastVitals",
      headerClassName: "text-left px-5",
      className: "px-5 text-zinc-600",
    },
  ];

  const criticalActions = (row) => (
    <div className="flex items-center justify-center gap-2 text-sm font-medium px-5">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleViewCritical(row);
        }}
        className="text-sm font-medium text-blue-600 hover:text-blue-700 transition"
      >
        <Eye size={14} />
      </button>
    </div>
  );

  const taskColumns = [
    {
      label: "Patient",
      headerClassName: "text-left px-5",
      className: "px-5",
      render: (row) => (
        <div>
          <p className="font-semibold text-zinc-900">{row.patient}</p>
          <p className="text-xs text-zinc-400">{row.bed}</p>
        </div>
      ),
    },
    {
      label: "Task",
      field: "task",
      headerClassName: "text-left px-5",
      className: "px-5 text-zinc-700",
    },
    {
      label: "Due Time",
      field: "dueTime",
      headerClassName: "text-left px-5",
      className: "px-5 text-zinc-600",
    },
    {
      label: "Status",
      headerClassName: "text-left px-5",
      className: "px-5",
      render: (row) => (
        <span className={`text-xs font-medium px-2 py-1 rounded-md ${taskStatusBadge(row.status)}`}>
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="w-full mx-auto p-1 py-2 flex flex-col gap-4 sm:gap-6 lg:gap-8 max-w-[1440px] 2xl:max-w-[1920px]">
     
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 xl:gap-6">
        {statCards.map((card) => (
          <div key={card.label} className="relative overflow-hidden bg-white rounded-2xl border border-zinc-200/80 p-4 xl:p-5 2xl:p-4 shadow-sm hover:shadow-md transition duration-200 min-h-[108px] sm:min-h-[112px] xl:min-h-[120px] flex items-center">
            {card.image && (
              <img src={card.image} alt={card.label} aria-hidden="true" className="absolute inset-0 h-full w-full object-cover pointer-events-none select-none z-0" />
            )}

            <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-white z-10" />

            {card.image && (
              <>
                <div className="absolute left-[40%] top-0 bottom-0 w-[25%] bg-gradient-to-r from-white via-white/90 to-transparent pointer-events-none z-10" />
                <div className="absolute left-[42%] top-0 bottom-0 w-[20%] backdrop-blur-[8px] pointer-events-none z-20 [mask-image:linear-gradient(to_right,rgba(0,0,0,1)_20%,rgba(0,0,0,0))]" />
              </>
            )}

            <div className="relative z-30 flex flex-col justify-between h-full w-1/2 pr-2">
              <p className="text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider leading-relaxed">{card.label}</p>
              <p className={`text-3xl sm:text-4xl xl:text-5xl font-bold mt-1 tracking-tight ${card.color || "text-zinc-900"}`}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

    

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 xl:gap-8">
        {/* Critical Patients */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-5 py-4 border-b border-zinc-100">
            <p className="text-xs sm:text-sm font-bold text-zinc-500 uppercase tracking-wider">
              Critical / Important Patients
            </p>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <TableComponent columns={criticalColumns} data={criticalPatientsData} actions={criticalActions} actionLabel="Action" />
          </div>

          {/* Mobile/Tablet Cards */}
          <div className="md:hidden flex flex-col divide-y divide-zinc-100">
            {criticalPatientsData.map((row, idx) => (
              <div key={row.id || idx} className="p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-zinc-900">{row.patient}</p>
                  <p className="text-xs text-zinc-400">{row.age}/{row.gender}</p>
                  <p className="text-xs text-zinc-600 mt-1">
                    Bed <span className="font-semibold text-zinc-800">{row.bed}</span> · {row.lastVitals}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleViewCritical(row)}
                  className="text-blue-600 hover:text-blue-700 transition shrink-0"
                >
                  <Eye size={16} />
                </button>
              </div>
            ))}
            {criticalPatientsData.length === 0 && (
              <div className="p-6 text-center text-sm text-zinc-400">No critical patients.</div>
            )}
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-5 py-4 border-b border-zinc-100">
            <p className="text-xs sm:text-sm font-bold text-zinc-500 uppercase tracking-wider">
              Today's Tasks
            </p>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <TableComponent columns={taskColumns} data={todaysTasksData} actionLabel={null} />
          </div>

          {/* Mobile/Tablet Cards */}
          <div className="md:hidden flex flex-col divide-y divide-zinc-100">
            {todaysTasksData.map((row, idx) => (
              <div key={row.id || idx} className="p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-zinc-900">{row.patient}</p>
                  <p className="text-xs text-zinc-400">{row.bed}</p>
                  <p className="text-sm text-zinc-700 mt-1">{row.task}</p>
                  <p className="text-xs text-zinc-500">Due {row.dueTime}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-md shrink-0 ${taskStatusBadge(row.status)}`}>
                  {row.status}
                </span>
              </div>
            ))}
            {todaysTasksData.length === 0 && (
              <div className="p-6 text-center text-sm text-zinc-400">No tasks for today.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ICUDashboard;