import React, { useEffect, useState } from "react";
import { Building, Calendar, CalendarDays, Clock5, ReceiptIndianRupee, TrendingUp, UserRoundCheck, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { financeService } from "../../services/financeService";
import { FinanceButton, FinanceHeader, UsageLine, formatMoney } from "./FinanceShared";

const tabs = ["General Info", "Subscription", "Usage Details", "Billing History"];

const StatusBadge = ({ children }) => (
  <span className="rounded-md bg-[#dbfce7] px-2 py-1 text-xs capitalize text-green-700">
    {children}
  </span>
);

const BillingHistoryTab = ({ hospital }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await financeService.getPlanHistory();
        if (response?.success) setHistory(response.plans || []);
      } catch (error) {
        toast.error(error?.message || "Failed to load billing history");
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  if (loading) return <p className="text-sm text-[#6a7282]">Loading billing history...</p>;
  if (history.length === 0) return <p className="text-sm text-[#6a7282]">No billing history found.</p>;

  return (
    <div className="space-y-3 text-[#364153]">
      <h2 className="text-[15px]">Billing History</h2>
      {history.map((item) => (
        <div key={item.id} className="flex justify-between rounded-md border border-gray-100 p-4 shadow-sm">
          <div>
            <p className="font-medium text-black">{item?.planVersion?.plan?.planName || hospital?.planName}</p>
            <p className="text-xs">{new Date(item?.planExpiryDate).toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-black">{formatMoney(item?.amountPaid)}</p>
            <StatusBadge>{item?.status}</StatusBadge>
          </div>
        </div>
      ))}
    </div>
  );
};

const renderTab = (activeTab, hospital) => {
  switch (activeTab) {
    case "General Info":
      return (
        <div className="grid grid-cols-2 gap-4 text-[#364153]">
          <div className="flex flex-col gap-2 text-lg">
            <span className="text-sm">Hospital Name</span>
            <span>{hospital?.clinicName}</span>
          </div>
          <div className="flex flex-col gap-2 text-lg">
            <span className="text-sm">Hospital Id</span>
            <span>{hospital?.id}</span>
          </div>
        </div>
      );
    case "Subscription":
      return (
        <div className="grid grid-cols-2 gap-4 text-[#364153]">
          <div className="flex flex-col gap-2 text-lg">
            <span className="text-sm">Current Plan</span>
            <span>{hospital?.planName}</span>
          </div>
          <div className="flex flex-col gap-2 text-lg">
            <span className="text-sm">Monthly Cost</span>
            <span>{formatMoney(hospital?.baseMonthlyPrice)}</span>
          </div>
          <div className="flex flex-col gap-2 text-lg">
            <span className="text-sm">Renewal Date</span>
            <span>{hospital?.renewalDate}</span>
          </div>
          <div className="flex flex-col gap-2 text-lg">
            <span className="text-sm">Days Remaining</span>
            <span>{hospital?.remainingDays != null ? `${hospital.remainingDays} days` : "NA"}</span>
          </div>
        </div>
      );
    case "Usage Details":
      return (
        <div className="space-y-6">
          <UsageLine detailed label="Doctors" used={hospital?.doctorUsedLimit} limit={hospital?.doctorLimit} />
          <UsageLine detailed label="Patients" used={hospital?.patientUsedLimit} limit={hospital?.patientLimit} />
          <UsageLine detailed label="Staff" used={hospital?.staffUsedLimit} limit={hospital?.staffLimit} />
          <UsageLine detailed label="Appointments" used={hospital?.appointmentUsedLimit} limit={hospital?.dailyAppointmentLimit} />
        </div>
      );
    case "Billing History":
      return <BillingHistoryTab hospital={hospital} />;
    default:
      return null;
  }
};

const Finance = () => {
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("General Info");

  useEffect(() => {
    const loadFinance = async () => {
      try {
        const response = await financeService.getOverview();
        if (response?.success) setHospital(response.data);
      } catch (error) {
        toast.error(error?.message || "Failed to load finance details");
      } finally {
        setLoading(false);
      }
    };
    loadFinance();
  }, []);

  if (loading) {
    return <section className="min-h-full flex items-center justify-center text-sm text-[#6a7282]">Loading finance details...</section>;
  }

  if (!hospital) {
    return <section className="min-h-full flex items-center justify-center text-sm text-[#6a7282]">Finance details not found.</section>;
  }

  const hasPlan = Boolean(hospital?.planId);

  return (
    <section className="min-h-full flex flex-col">
      <FinanceHeader title={hospital?.clinicName || "Finance"} subTitle="Hospital management and subscription details">
        <FinanceButton onClick={() => navigate("/finance/billing-history")}>
          <ReceiptIndianRupee size={20} /> Billing History
        </FinanceButton>
        <FinanceButton onClick={() => navigate("/finance/change-plan")}>
          <TrendingUp size={20} /> {hasPlan ? "Change Plan" : "Purchase Subscription"}
        </FinanceButton>
        {hasPlan && (
          <FinanceButton variant="primary" onClick={() => navigate("/finance/extend-plan")}>
            <Clock5 size={20} /> Extend Subscription
          </FinanceButton>
        )}
      </FinanceHeader>

      {!hasPlan && (
        <div className="mb-4 rounded-lg border border-[#f0b100] bg-[#fef9c2] p-4 text-sm text-[#8d5300]">
          You can use each service once without a subscription. To continue adding doctors, patients, staff, and appointments, purchase a subscription plan.
        </div>
      )}

      <div className="mb-4 flex gap-4 rounded-lg bg-white p-4 shadow-md">
        <span className="flex items-center justify-center rounded-lg bg-[#f2d7f5] p-2">
          <Building size={32} className="text-[#521785]" />
        </span>
        <div className="space-y-1">
          <h1 className="text-lg">{hospital?.clinicName}</h1>
          <span className="rounded-lg bg-[#f2d7f5] px-2 py-1 text-xs">{hasPlan ? hospital?.planName : "No Plan"}</span>
          <span className="ml-2 rounded-lg bg-[#dbfce7] px-2 py-1 text-xs capitalize text-green-700">{hasPlan ? hospital?.status : "starter"}</span>
        </div>
      </div>

      <div className="mb-4 rounded-lg bg-white p-4 shadow-md">
        <span className="flex items-center gap-2">
          <Calendar size={22} className="text-[#521785]" /> Subscription Information
        </span>
        <div className="mt-3 flex flex-wrap gap-14">
          <div className="flex flex-col">
            <span className="text-sm text-[#364153]">Plan Name</span>
            <span className="text-lg">{hospital?.planName}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-[#364153]">Start Date</span>
            <span className="text-lg">{hospital?.startDate}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-[#364153]">Expiry Date</span>
            <span className="text-lg">{hospital?.planExpiryDate}</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-4 shadow-md">
        <h1>Usage Overview</h1>
        <h3 className="mb-4 mt-1 text-sm text-[#364153]">Current usage against plan limits</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <UsageLine label="Doctors" icon={<Users size={18} className="text-[#521785]" />} used={hospital?.doctorUsedLimit} limit={hospital?.doctorLimit} />
          <UsageLine label="Patients" icon={<Users size={18} className="text-[#521785]" />} used={hospital?.patientUsedLimit} limit={hospital?.patientLimit} />
          <UsageLine label="Staff" icon={<UserRoundCheck size={18} className="text-green-600" />} used={hospital?.staffUsedLimit} limit={hospital?.staffLimit} />
          <UsageLine label="Appointments" icon={<CalendarDays size={18} className="text-orange-500" />} used={hospital?.appointmentUsedLimit} limit={hospital?.dailyAppointmentLimit} />
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? "border-b-2 border-[#521785] text-[#521785]" : "text-[#6a7282]"}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-lg bg-white p-4 shadow-md">{renderTab(activeTab, hospital)}</div>
    </section>
  );
};

export default Finance;
