import React, { useEffect, useMemo, useState } from "react";
import { Package } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { financeService } from "../../services/financeService";
import { FinanceButton, FinanceHeader, billingCycleOptions, formatMoney } from "./FinanceShared";

const FinanceChangePlan = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [current, setCurrent] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [billingCycle, setBillingCycle] = useState("");
  const [billingOption, setBillingOption] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [overviewRes, plansRes] = await Promise.all([
          financeService.getOverview(),
          financeService.getPlans(),
        ]);
        if (overviewRes?.success) setCurrent(overviewRes.data);
        if (plansRes?.success) setPlans(plansRes.data || []);
      } catch (error) {
        toast.error(error?.message || "Failed to load plans");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const selected = useMemo(
    () => plans.find((plan) => String(plan.id) === String(selectedPlan)),
    [plans, selectedPlan]
  );

  const currentInList = useMemo(
    () => plans.find((plan) => String(plan.id) === String(current?.planId)),
    [plans, current]
  );

  const changeAmount = useMemo(() => {
    if (!selected) return 0;
    const currentPrice = Number(currentInList?.baseMonthlyPrice || current?.baseMonthlyPrice || 0);
    const newPrice = Number(selected.baseMonthlyPrice || 0);
    return billingOption === "immediate" ? newPrice - currentPrice : newPrice;
  }, [billingOption, current, currentInList, selected]);

  const submit = async () => {
    if (!selectedPlan) return toast.error("Please select a new subscription plan.");
    if (!billingCycle) return toast.error("Please select a billing cycle.");
    if (!billingOption) return toast.error("Please select when the plan change should take effect.");

    setSubmitting(true);
    try {
      const response = await financeService.changePlan({
        planVersionId: selectedPlan,
        billingCycle,
        billingOption,
      });
      if (response?.success) {
        toast.success(response.message || "Plan changed successfully");
        navigate("/finance");
      }
    } catch (error) {
      if (Array.isArray(error)) error.forEach((item) => toast.error(item.msg));
      else toast.error(error?.message || "Failed to change plan");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <section className="min-h-full flex items-center justify-center text-sm text-[#6a7282]">Loading plans...</section>;
  }

  return (
    <section className="min-h-full flex flex-col">
      <FinanceHeader title="Change Subscription Plan" subTitle="Select a new plan for your hospital" backPath="/finance" />

      <div className="mb-6 flex gap-4 rounded-lg border border-[#521785] bg-[#f7edf8] p-4">
        <span className="inline-block rounded-md bg-[#521785] p-2">
          <Package size={22} className="text-white" />
        </span>
        <div>
          <h1 className="mb-2 flex gap-4">
            Current plan: {current?.planName || "NA"}
            <span className="rounded-lg border border-gray-500 p-1 text-xs capitalize">{current?.status}</span>
          </h1>
          <p className="text-sm text-[#364153]">{formatMoney(current?.baseMonthlyPrice)}/Month</p>
        </div>
      </div>

      <h2 className="mb-4">Select New Plan</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = String(plan.id) === String(current?.planId);
          const isSelected = String(plan.id) === String(selectedPlan);
          return (
            <button
              key={plan.id}
              type="button"
              disabled={isCurrent}
              onClick={() => setSelectedPlan(plan.id)}
              className={`rounded-lg border bg-white p-4 text-left shadow-sm transition ${isSelected ? "border-[#521785] ring-2 ring-[#521785]/20" : "border-gray-200"} ${isCurrent ? "cursor-not-allowed opacity-70" : "hover:border-[#521785]"}`}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="font-semibold">{plan.planName}</h3>
                {isCurrent && <span className="rounded-md bg-[#dbfce7] px-2 py-1 text-xs text-green-700">Current</span>}
              </div>
              <p className="mb-3 text-lg font-semibold text-[#521785]">{formatMoney(plan.baseMonthlyPrice)}/mo</p>
              <div className="space-y-1 text-sm text-[#364153]">
                <p>{plan.doctorLimit} Doctors</p>
                <p>{plan.patientLimit} Patients</p>
                <p>{plan.staffLimit} Staff</p>
                <p>{plan.dailyAppointmentLimit} Appointments</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg border border-gray-300 bg-white p-4">
        <h2 className="mb-4">Billing Cycle</h2>
        <select value={billingCycle} onChange={(e) => setBillingCycle(e.target.value)} className="w-full rounded-md border border-gray-200 bg-white p-2 text-sm outline-none">
          <option value="">Select Billing Cycle</option>
          {billingCycleOptions.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
      </div>

      <div className="mt-6 rounded-lg border border-gray-300 bg-white p-4">
        <h2 className="mb-4">When should this change take effect?</h2>
        <div className="space-y-4">
          <label className="flex cursor-pointer gap-4 rounded-lg border border-gray-300 p-4 hover:bg-purple-50/30">
            <input type="radio" name="billingOption" checked={billingOption === "nextCycle"} onChange={() => setBillingOption("nextCycle")} className="mt-1 accent-purple-600" />
            <div>
              <h3 className="font-medium">At Next Billing Cycle</h3>
              <p className="text-sm text-[#364153]">Change will take effect after the current plan expires.</p>
            </div>
          </label>
          <label className="flex cursor-pointer gap-4 rounded-lg border border-gray-300 p-4 hover:bg-purple-50/30">
            <input type="radio" name="billingOption" checked={billingOption === "immediate"} onChange={() => setBillingOption("immediate")} className="mt-1 accent-purple-600" />
            <div>
              <h3 className="font-medium">Immediately</h3>
              <p className="text-sm text-[#364153]">Start the selected plan now.</p>
            </div>
          </label>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-gray-300 bg-[#f5f6f7] p-4">
        <h2 className="mb-4">Change Summary</h2>
        <p className="mb-2 flex justify-between text-sm"><span>Current Plan:</span><span>{current?.planName} - {formatMoney(current?.baseMonthlyPrice)}/month</span></p>
        <p className="flex justify-between text-sm"><span>New Plan:</span><span>{selected ? `${selected.planName} - ${formatMoney(selected.baseMonthlyPrice)}/month` : "Select a plan"}</span></p>
        <hr className="my-3 border-gray-300" />
        <p className="flex justify-between text-sm"><span>Change:</span><span className="font-medium text-green-600">{formatMoney(changeAmount)}/month</span></p>
      </div>

      <div className="mt-6 flex justify-end">
        <FinanceButton variant="primary" disabled={submitting} onClick={submit}>
          {submitting ? "Saving..." : "Confirm Plan Change"}
        </FinanceButton>
      </div>
    </section>
  );
};

export default FinanceChangePlan;
