import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { calculateUsage } from "../../utils/calculateUsage";

export const FinanceHeader = ({ title, subTitle, backPath = null, children }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        {backPath && (
          <button
            type="button"
            onClick={() => navigate(backPath)}
            className="rounded-md border border-gray-200 bg-white p-2 text-[#364153]"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <div>
          <h1 className="text-xl font-semibold text-[#1e2939]">{title}</h1>
          {subTitle && <p className="text-sm text-[#6a7282]">{subTitle}</p>}
        </div>
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
};

export const FinanceButton = ({ children, onClick, variant = "soft", disabled = false }) => (
  <Button
    type="button"
    disabled={disabled}
    onClick={onClick}
    variant="outlined"
    className={
      variant === "primary"
        ? "!btn_bg !capitalize !text-white !border-none !flex !gap-2 !items-center"
        : "!bg-[#f2d7f5] !capitalize !text-[#364153] !border-none !flex !gap-2 !items-center"
    }
  >
    {children}
  </Button>
);

export const FinanceProgressBar = ({ progress, className = "h-2" }) => (
  <div className={`w-full overflow-hidden rounded-full bg-gray-200 ${className}`}>
    <div
      className="h-full rounded-full bg-[#521785] transition-all"
      style={{ width: `${Math.min(Number(progress) || 0, 100)}%` }}
    />
  </div>
);

export const UsageLine = ({ label, used, limit, icon, detailed = false }) => {
  const usage = calculateUsage(used, limit);

  return (
    <div className="text-sm">
      <div className="mb-2 flex items-center justify-between text-[#364153]">
        <span className="flex items-center gap-2 font-medium">{icon} {label}</span>
        <span className="font-semibold text-green-600">
          {usage.usage}{detailed ? ` (${usage.percent}%)` : ""}
        </span>
      </div>
      <FinanceProgressBar progress={usage.percent} className={detailed ? "h-3" : "h-2"} />
    </div>
  );
};

export const billingCycleOptions = [
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Half-Yearly", value: "halfYearly" },
  { label: "Yearly", value: "yearly" },
];

export const formatMoney = (value) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
