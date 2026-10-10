import { useEffect } from "react";

const ChartHeader = ({  title, setMonth, setYear, year,month }) => {
    const handleChange = (e) => {
    const value = e.target.value; // format: "2025-08"
    if (value) {
      const [y, m] = value.split("-");
      setYear(y);
      setMonth(m);
    }
  };

    // Set default to current month-year
  useEffect(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0"); // 01-12
    setYear(y);
    setMonth(m);
  }, []);

  return (
    <div className="flex justify-between items-center p-1 h-[18%] px-2">
      <h1 className="text-[15px] font-semibold">{title}</h1>
      <input type="month"  value={`${year}-${month}`} onChange={handleChange} className="border border-zinc-400 h-8 px-2 rounded-sm w-28 xl:w-44 xl:text-[15px] text-sm outline-none"/>
    </div>
  );
};

export default ChartHeader;
