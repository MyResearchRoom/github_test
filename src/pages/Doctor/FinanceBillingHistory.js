import React, { useEffect, useMemo, useState } from "react";
import { Calendar, Search } from "lucide-react";
import { toast } from "react-toastify";
import { financeService } from "../../services/financeService";
import { FinanceHeader, formatMoney } from "./FinanceShared";

const badgeClasses = {
  active: "bg-[#dbfce7] text-green-700",
  expiringSoon: "bg-[#ffedd4] text-[#be3907]",
  expired: "bg-[#ffe2e2] text-[#b42619]",
  upcoming: "bg-[#dbeafe] text-[#1d4ed8]",
  stopped: "bg-[#f3f4f6] text-[#364153]",
};

const FinanceBillingHistory = () => {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
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

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return history;
    return history.filter((item) =>
      item?.planVersion?.plan?.planName?.toLowerCase().includes(term)
    );
  }, [history, search]);

  return (
    <section className="min-h-full flex flex-col">
      <FinanceHeader title="Billing History" subTitle="Subscription payment and plan records" backPath="/finance" />

      <div className="rounded-md bg-white p-4 shadow-lg">
        <div className="relative mb-4">
          <input
            type="search"
            placeholder="Search plan name ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-72 rounded-md bg-[#f3f3f5] p-2 pl-7 text-sm outline-none focus:border focus:border-gray-500"
          />
          <Search className="absolute left-2 top-1/2 -translate-y-1/2" color="#364153" size={16} />
        </div>

        {loading ? (
          <p className="text-sm text-[#6a7282]">Loading billing history...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-[#6a7282]">No billing history found.</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-gray-100 p-4 shadow-sm">
                <div className="flex items-start gap-4">
                  <span className="rounded-md bg-[#dbfce7] p-2">
                    <Calendar size={18} className="text-green-600" />
                  </span>
                  <div>
                    <p className="font-medium text-black">{item?.planVersion?.plan?.planName || "NA"}</p>
                    <p className="text-xs text-[#6a7282]">
                      {new Date(item?.startDate).toLocaleDateString()} - {new Date(item?.planExpiryDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-black">{formatMoney(item?.amountPaid)}</p>
                  <span className={`rounded-md px-2 py-1 text-xs capitalize ${badgeClasses[item?.status] || "bg-[#f3f4f6] text-[#364153]"}`}>
                    {item?.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FinanceBillingHistory;
