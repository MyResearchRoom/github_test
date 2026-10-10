import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRightLeft,
  UserPlus,
  ClipboardCheck,
  LayoutGrid,
  ChevronDown,
} from "lucide-react";

const quickActions = [
  {
    icon: UserPlus,
    bg: "#F3E8FF",
    color: "#9333EA",
    title: "Admit Patient",
    sub: "Add new IPD admission",
    path: "/ipd/admit-patient",
  },
  {
    icon: ArrowRightLeft,
    bg: "#E0F2FE",
    color: "#2563EB",
    title: "Transfer Patient",
    sub: "Move patient to another bed",
    path: "/ipd/bed-transfer",
  },
  {
    icon: ClipboardCheck,
    bg: "#DCFCE7",
    color: "#16A34A",
    title: "Discharge Patient",
    sub: "Discharge admitted patient",
    path: "/ipd/discharge",
  },
  {
    icon: LayoutGrid,
    bg: "#FEF3C7",
    color: "#D97706",
    title: "Bed Management",
    sub: "Manage beds and availability",
    path: "/ipd/beds",
  },
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-[#e5e5e5] rounded-lg p-3 sm:p-4 md:p-5">
      <h2 className="text-[15px] sm:text-[16px] font-semibold text-[#343C6A] mb-3 sm:mb-4">
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3">
        {quickActions.map((q, i) => {
          const Icon = q.icon;

          return (
            <button
              key={i}
              onClick={() => navigate(q.path)}
              className="
                flex
                items-center
                gap-3
                border
                border-[#e5e5e5]
                rounded-lg
                p-3
                sm:p-3.5
                text-left
                hover:bg-gray-50
                transition-colors
                min-h-[72px]
              "
            >
              <div
                className="
                  w-9
                  h-9
                  sm:w-10
                  sm:h-10
                  rounded-lg
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
                style={{
                  background: q.bg,
                }}
              >
                <Icon size={17} color={q.color} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#343C6A]">
                  {q.title}
                </p>

                <p className="text-[11px] text-[#8BA3CB] mt-0.5 truncate">
                  {q.sub}
                </p>
              </div>

              <ChevronDown
                size={15}
                className="rotate-[-90deg] text-[#8BA3CB] shrink-0"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;