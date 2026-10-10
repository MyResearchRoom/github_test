import React, { useEffect, useMemo, useState } from "react";
import { Calendar, Clock, CreditCard } from "lucide-react";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { financeService } from "../../services/financeService";
import { FinanceHeader, formatMoney } from "./FinanceShared";

const formatDate = (date) =>
  date?.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

const addMonths = (date, months) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

const FinanceExtendPlan = () => {
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [plan, setPlan] = useState(null);
  const [billing, setBilling] = useState(null);
  const [autoRenew, setAutoRenew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const overviewRes = await financeService.getOverview();
        if (overviewRes?.success) {
          setOverview(overviewRes.data);
          if (overviewRes.data?.planId) {
            const planRes = await financeService.getPlanById(overviewRes.data.planId);
            if (planRes?.success) setPlan(planRes.data);
          }
        }
      } catch (error) {
        toast.error(error?.message || "Failed to load subscription details");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const currentEndDate = useMemo(() => {
    if (!overview?.planExpiryDate || overview.planExpiryDate === "NA") return null;
    return new Date(overview.planExpiryDate);
  }, [overview]);

  const billingCycles = useMemo(() => plan?.billingCycle || [], [plan]);
  const monthlyPrice = Number(overview?.baseMonthlyPrice || plan?.baseMonthlyPrice || 0);
  const subtotal = billing ? monthlyPrice * Number(billing.month || 1) : 0;
  const total = billing ? subtotal * (1 - Number(billing.discount || 0) / 100) : 0;
  const extensionBase = currentEndDate && currentEndDate.getTime() > Date.now() ? currentEndDate : new Date();
  const newEndDate = billing ? addMonths(extensionBase, Number(billing.month || 1)) : null;

  const submit = async () => {
    if (!billing) return toast.error("Please select extension period.");
    setSubmitting(true);
    try {
      const response = await financeService.extendPlan({
        billingCycle: billing.billingCycle,
        autoRenew,
        planId: overview?.planId,
      });
      if (response?.success) {
        toast.success(response.message || "Subscription extended successfully");
        navigate("/finance");
      }
    } catch (error) {
      toast.error(error?.message || "Failed to extend subscription");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <section className="min-h-full flex items-center justify-center text-sm text-[#6a7282]">Loading subscription details...</section>;
  }

  if (!overview?.planId) {
    return (
      <section className="min-h-full flex flex-col">
        <FinanceHeader title="Extend Subscription" subTitle="No active subscription found" backPath="/finance" />
        <div className="rounded-lg bg-white p-4 shadow-md">
          <p className="mb-4 text-sm text-[#6a7282]">
            You do not have a subscription plan yet. Please purchase a plan to continue the service.
          </p>
          <Button onClick={() => navigate("/finance/change-plan")} className="!btn_bg !capitalize !text-white !border-none">
            Purchase Subscription
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-full flex flex-col">
      <FinanceHeader title="Extend Subscription" subTitle="Extend your hospital subscription" backPath="/finance" />

      <div className="mb-6 flex gap-4 rounded-lg border border-[#521785] bg-[#f7edf8] p-4">
        <span className="inline-block rounded-md bg-[#521785] p-2">
          <Calendar size={22} className="text-white" />
        </span>
        <div className="w-full">
          <h1 className="mb-2 flex gap-4">
            Current Subscription
            <span className="rounded-lg border border-gray-500 p-1 text-xs capitalize">{overview?.status || "NA"}</span>
          </h1>
          <div className="mb-4 grid grid-cols-2 text-sm text-[#364153]">
            <div className="flex flex-col gap-2">
              <span>Plan</span>
              <span className="text-[15px] text-black">{overview?.planName}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span>Monthly Price</span>
              <span className="text-[15px] text-black">{formatMoney(monthlyPrice)}/month</span>
            </div>
          </div>
          <div className="grid grid-cols-2 text-sm text-[#364153]">
            <div className="flex flex-col gap-2">
              <span>Current End Date</span>
              <span className="text-[15px] text-black">{currentEndDate ? formatDate(currentEndDate) : "NA"}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span>Days Remaining</span>
              <span className="text-[15px] text-black">{overview?.remainingDays != null ? `${overview.remainingDays} days` : "NA"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_0.5fr]">
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-300 bg-white p-4">
            <h2 className="mb-4">Select Extension Period</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {billingCycles.map((item) => {
                const selected = billing?.billingCycle === item.billingCycle;
                const months = Number(item.month || 1);
                const itemTotal = monthlyPrice * months * (1 - Number(item.discount || 0) / 100);
                return (
                  <button
                    key={item.billingCycle}
                    type="button"
                    onClick={() => setBilling(item)}
                    className={`rounded-lg border p-4 text-left ${selected ? "border-[#521785] ring-2 ring-[#521785]/20" : "border-gray-200"}`}
                  >
                    <p className="font-medium capitalize">{item.billingCycle}</p>
                    <p className="text-sm text-[#364153]">{months} month(s)</p>
                    <p className="mt-2 font-semibold text-[#521785]">{formatMoney(itemTotal)}</p>
                    {Number(item.discount || 0) > 0 && <p className="text-xs text-green-600">{item.discount}% discount</p>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-4 rounded-lg border border-gray-300 bg-white p-4">
            <span className="inline-block rounded-md bg-[#ececf0] p-2">
              <Clock size={20} className="text-gray-500" />
            </span>
            <div className="flex w-full justify-between gap-4">
              <div>
                <h2>Enable Auto-Renewal</h2>
                <p className="text-sm text-[#364153]">Automatically renew subscription when it expires.</p>
              </div>
              <input type="checkbox" checked={autoRenew} onChange={() => setAutoRenew((prev) => !prev)} className="h-5 w-5 accent-purple-700" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-300 bg-white p-4">
          <h2 className="mb-4">Extension Summary</h2>
          {billing ? (
            <div className="space-y-3 text-sm text-[#364153]">
              <p className="flex flex-col gap-1"><span>Extension Period</span><span className="font-medium text-black">{billing.month} months ({billing.billingCycle})</span></p>
              <p className="flex flex-col gap-1"><span>Current End Date</span><span className="font-medium text-black">{currentEndDate ? formatDate(currentEndDate) : "NA"}</span></p>
              <p className="flex flex-col gap-1"><span>New End Date</span><span className="font-medium text-blue-500">{newEndDate ? formatDate(newEndDate) : "NA"}</span></p>
              <p className="flex justify-between border-t pt-2"><span>Subtotal:</span><span>{formatMoney(subtotal)}</span></p>
              {Number(billing.discount || 0) > 0 && <p className="flex justify-between"><span>Discount:</span><span className="text-green-600">{billing.discount}%</span></p>}
              <p className="flex justify-between border-t pt-2 font-semibold text-black"><span>Total Price:</span><span>{formatMoney(total)}</span></p>
              {autoRenew && <p className="rounded-md border border-[#b78df3] bg-[#f7edf8] p-2 text-[#7e3fd3]">Auto-renewal enabled.</p>}
              <Button disabled={submitting} onClick={submit} className="!btn_bg !mt-4 !w-full !capitalize !text-white !border-none">
                <CreditCard size={18} className="mr-2" /> {submitting ? "Saving..." : "Extend Subscription"}
              </Button>
            </div>
          ) : (
            <p className="text-sm italic text-gray-500">Select a billing cycle to view summary.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default FinanceExtendPlan;
