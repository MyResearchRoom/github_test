import React, { useState, useMemo } from "react";
import { 
  Search, 
  FileSpreadsheet, 
  FileText, 
  Printer, 
  Calendar, 
  User, 
  Layers,
  ChevronDown,
  Info,
  SlidersHorizontal,
  CheckCircle2
} from "lucide-react";

// Categorized ICU report types for structured information architecture
const reportCategories = [
  {
    id: "census",
    name: "Administrative & Census",
    reports: [
      { id: "rep-01", name: "ICU Patient Register", code: "IPR", description: "Complete roster of all ICU admissions, demographic distributions, and clinical statuses.", type: "Administrative" },
      { id: "rep-02", name: "ICU Bed Occupancy", code: "IBO", description: "Daily bed occupancy matrix, availability run-rates, and department turnover intervals.", type: "Administrative" },
      { id: "rep-03", name: "Daily ICU Census", code: "DIC", description: "Census summaries, midnight patient counts, total bed days, and acuity breakdowns.", type: "Administrative" }
    ]
  },
  {
    id: "clinical",
    name: "Clinical & Progress Notes",
    reports: [
      { id: "rep-04", name: "Vitals Report", code: "VIT", description: "Aggregated physiological parameter streams, trend profiles, and threshold violation logs.", type: "Clinical Data" },
      { id: "rep-06", name: "Nursing Notes Report", code: "NNR", description: "Chronological documentation logs mapped against standard shift progression parameters.", type: "Clinical Documentation" },
      { id: "rep-07", name: "Doctor Notes Report", code: "DNR", description: "Consultation logs, direct physician directives, progress trackers, and formal diagnostic entries.", type: "Clinical Documentation" }
    ]
  },
  {
    id: "interventions",
    name: "Interventions & Care Tracking",
    reports: [
      { id: "rep-05", name: "Medication Report", code: "MAR", description: "Comprehensive Medication Administration Record audits, deviations, and delivery histories.", type: "Interventions" },
      { id: "rep-08", name: "Intake & Output Report", code: "IOR", description: "Precision metrics tracking shift fluid balances, volume profiles, and aggregate metrics.", type: "Interventions" },
      { id: "rep-09", name: "Procedure Report", code: "PRR", description: "Detailed record of all clinical bedside procedures performed including validation attributes.", type: "Interventions" },
      { id: "rep-10", name: "Investigation Report", code: "INR", description: "Consolidated diagnostic laboratory and radiological imaging dispatch matrices.", type: "Diagnostics" }
    ]
  }
];

const ICUReports = () => {
  // Master tracking states for parameters
  const [filters, setFilters] = useState({
    dateFrom: "2026-09-01",
    dateTo: "2026-09-03",
    icuBlock: "Medical ICU - Block B",
    doctor: "All Doctors"
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [tooltipText, setTooltipText] = useState("");
  const [activeTooltipId, setActiveTooltipId] = useState(null);

  // Input controller triggers
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Perform multi-layered search matching across category boundaries
  const filteredData = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    
    return reportCategories.map((category) => {
      const matchedReports = category.reports.filter((report) => {
        const matchesSearch = 
          report.name.toLowerCase().includes(query) ||
          report.description.toLowerCase().includes(query) ||
          report.code.toLowerCase().includes(query);
          
        return matchesSearch;
      });

      return {
        ...category,
        reports: matchedReports
      };
    }).filter(cat => cat.reports.length > 0);
  }, [searchTerm]);

  // Compute metric aggregations
  const totalReportsCount = useMemo(() => {
    return reportCategories.reduce((acc, cat) => acc + cat.reports.length, 0);
  }, []);

  const matchedReportsCount = useMemo(() => {
    return filteredData.reduce((acc, cat) => acc + cat.reports.length, 0);
  }, [filteredData]);

  const triggerExport = (format, reportName) => {
    alert(`Initiating standard administrative pipeline:\nExporting [${reportName}] in [${format}] format.\nContext: ${filters.icuBlock} | ${filters.dateFrom} to ${filters.dateTo}`);
  };

  return (
    <div className="w-full mx-auto p-3 sm:p-4 md:p-6 lg:p-4 xl:px-6 xl:py-0 flex flex-col gap-6 max-w-[1440px] 2xl:max-w-[1920px] font-sans antialiased text-zinc-800">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-b border-zinc-100 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
            ICU Reports Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Generate, cross-reference, and export regulatory and diagnostic metrics clinical reports
          </p>
        </div>
        
        <div className="flex items-center gap-2 self-start sm:self-center bg-zinc-100 p-1 rounded-lg border border-zinc-200">
          <button 
            type="button"
            onClick={() => setActiveTab("all")} 
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${activeTab === "all" ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-500 hover:text-zinc-800"}`}
          >
            Matrix View
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab("favorites")} 
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${activeTab === "favorites" ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-500 hover:text-zinc-800"}`}
          >
            Audit Log
          </button>
        </div>
      </div>

      {/* PARAMETRIC REPORT FILTERS BLOCK */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-4 sm:p-5 transition hover:shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal size={14} className="text-[#521785]" />
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Operational Audit Filters</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide flex items-center gap-1">
              <Calendar size={12} /> Date From
            </label>
            <input 
              type="date" 
              name="dateFrom" 
              value={filters.dateFrom} 
              onChange={handleFilterChange} 
              className="w-full h-9 px-3 rounded-lg border border-zinc-200 outline-none focus:border-zinc-400 text-sm text-zinc-800"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide flex items-center gap-1">
              <Calendar size={12} /> Date To
            </label>
            <input 
              type="date" 
              name="dateTo" 
              value={filters.dateTo} 
              onChange={handleFilterChange} 
              className="w-full h-9 px-3 rounded-lg border border-zinc-200 outline-none focus:border-zinc-400 text-sm text-zinc-800"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide flex items-center gap-1">
              <Layers size={12} /> ICU Unit/Block
            </label>
            <div className="relative">
              <select 
                name="icuBlock" 
                value={filters.icuBlock} 
                onChange={handleFilterChange} 
                className="w-full h-9 pl-3 pr-8 rounded-lg border border-zinc-200 bg-white outline-none focus:border-zinc-400 text-sm text-zinc-800 appearance-none cursor-pointer"
              >
                <option value="Medical ICU - Block B">Medical ICU - Block B</option>
                <option value="Surgical ICU - Block A">Surgical ICU - Block A</option>
                <option value="Neuro ICU - Block C">Neuro ICU - Block C</option>
                <option value="Cardiac Care Unit (CCU)">Cardiac Care Unit (CCU)</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide flex items-center gap-1">
              <User size={12} /> Attending Doctor
            </label>
            <div className="relative">
              <select 
                name="doctor" 
                value={filters.doctor} 
                onChange={handleFilterChange} 
                className="w-full h-9 pl-3 pr-8 rounded-lg border border-zinc-200 bg-white outline-none focus:border-zinc-400 text-sm text-zinc-800 appearance-none cursor-pointer"
              >
                <option value="All Doctors">All Attending Doctors</option>
                <option value="Dr. Mehta">Dr. Mehta</option>
                <option value="Dr. Sharma">Dr. Sharma</option>
                <option value="Dr. Patil">Dr. Patil</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* CORE REPORTS CONTAINER TABLE */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden mt-2">
        
        {/* UPPER CONTROLS AND SEARCH LAYERS */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-5 py-4 border-b border-zinc-100 bg-zinc-50/50">
          <div>
            <p className="text-xs sm:text-sm font-bold text-zinc-500 uppercase tracking-wider">Report Selection Matrix</p>
            <p className="text-xs text-zinc-400 mt-1">
              Showing {matchedReportsCount} of {totalReportsCount} metrics profiles
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <input 
              type="text" 
              placeholder="Search reports matrix profile..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full h-9 pl-9 pr-8 rounded-lg border border-zinc-200 outline-none focus:border-zinc-400 transition text-sm bg-white placeholder-zinc-400 shadow-inner" 
            />
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            {searchTerm && (
              <button 
                type="button"
                onClick={() => setSearchTerm("")} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600 font-semibold"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* RESTRUCTURED SCANNABLE DATA GRID LAYER */}
        <div className="p-2 sm:p-4">
          {matchedReportsCount > 0 ? (
            <>
              {/* MOBILE AND COMPACT BREAKPOINT LAYOUT CARD MODULES */}
              <div className="flex flex-col gap-4 md:hidden px-1">
                {filteredData.map((category) => (
                  <div key={category.id} className="space-y-3">
                    <div className="border-b border-zinc-100 pb-1 mt-2">
                      <span className="text-xs font-bold text-[#521785] tracking-wide uppercase px-1 bg-purple-50 rounded">
                        {category.name}
                      </span>
                    </div>
                    
                    {category.reports.map((report) => (
                      <div 
                        key={report.id} 
                        className="border border-zinc-200 rounded-xl bg-white shadow-sm overflow-hidden border-l-4 border-l-zinc-400 hover:border-l-[#521785] transition-all"
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] bg-zinc-100 font-mono font-bold text-zinc-600 px-1.5 py-0.5 rounded border border-zinc-200">
                                  {report.code}
                                </span>
                                <h3 className="text-sm font-bold text-zinc-900">{report.name}</h3>
                              </div>
                              <span className="inline-block text-[10px] text-zinc-400 font-semibold mt-1">
                                Scope: {report.type}
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-xs text-zinc-500 leading-relaxed mb-4 bg-zinc-50 p-2 rounded-lg border border-zinc-100">
                            {report.description}
                          </p>
                          
                          {/* FLEX ICON SHORTCUT BAR FOR MOBILE ACCESSIBILITY */}
                          <div className="flex items-center justify-between border-t border-zinc-100 pt-3 bg-white">
                            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Export Targets</span>
                            <div className="flex items-center gap-1.5">
                              <button 
                                type="button"
                                onClick={() => triggerExport("Excel", report.name)} 
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition border border-emerald-100 shadow-sm"
                                title="Export Excel Format"
                              >
                                <FileSpreadsheet size={16} />
                              </button>
                              <button 
                                type="button"
                                onClick={() => triggerExport("PDF", report.name)} 
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition border border-rose-100 shadow-sm"
                                title="Export PDF Document"
                              >
                                <FileText size={16} />
                              </button>
                              <button 
                                type="button"
                                onClick={() => triggerExport("Print", report.name)} 
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-50 text-zinc-700 hover:bg-zinc-100 transition border border-zinc-200 shadow-sm"
                                title="Print Document Form"
                              >
                                <Printer size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* HIGHLY OPTIMIZED PROFESSIONAL DESKTOP DATA TABLE MATRIX */}
              <div className="hidden md:block overflow-x-auto rounded-xl border border-zinc-200 bg-white">
                <table className="w-full min-w-[900px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-400 text-[11px] font-bold uppercase tracking-wider">
                      <th className="px-5 py-3 w-16 text-center font-mono">Index</th>
                      <th className="px-4 py-3 w-64">Report Parameters Profile</th>
                      <th className="px-4 py-3">Functional Description</th>
                      <th className="px-4 py-3 w-36">Classification</th>
                      <th className="px-5 py-3 w-48 text-right">Interactive Pipeline Options</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-sm">
                    {filteredData.map((category) => (
                      <React.Fragment key={category.id}>
                        {/* CATEGORY BLOCK ANCHOR ROW */}
                        <tr className="bg-zinc-50/70 border-y border-zinc-200/60 select-none">
                          <td colSpan={5} className="px-4 py-2 text-xs font-extrabold text-[#521785] tracking-wider uppercase bg-gradient-to-r from-purple-50/50 to-transparent">
                            {category.name}
                          </td>
                        </tr>
                        
                        {category.reports.map((report) => (
                          <tr 
                            key={report.id} 
                            className="group hover:bg-zinc-50/40 transition duration-150 align-middle"
                          >
                            <td className="px-5 py-3.5 text-center font-mono text-xs font-bold text-zinc-400 group-hover:text-zinc-600">
                              {report.code}
                            </td>
                            
                            <td className="px-4 py-3.5">
                              <div className="font-semibold text-zinc-900 group-hover:text-[#521785] transition-colors">
                                {report.name}
                              </div>
                            </td>
                            
                            <td className="px-4 py-3.5 text-xs text-zinc-500 leading-normal max-w-sm xl:max-w-xl">
                              <div className="flex items-center gap-1.5">
                                <span className="line-clamp-2">{report.description}</span>
                                <div className="relative inline-block shrink-0">
                                  <button 
                                    type="button"
                                    onMouseEnter={() => {
                                      setActiveTooltipId(report.id);
                                      setTooltipText(`System metadata configuration compiled for target: ${report.name}`);
                                    }}
                                    onMouseLeave={() => setActiveTooltipId(null)}
                                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 transition p-0.5 rounded cursor-help"
                                  >
                                    <Info size={12} />
                                  </button>
                                  {activeTooltipId === report.id && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-zinc-900 text-white text-[10px] p-2 rounded shadow-xl z-20 font-sans pointer-events-none normal-case leading-normal font-normal">
                                      {tooltipText}
                                      <div className="w-2 h-2 bg-zinc-900 rotate-45 absolute top-full left-1/2 -translate-x-1/2 -mt-1"></div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            
                            <td className="px-4 py-3.5 whitespace-nowrap">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-zinc-100 text-zinc-600 border border-zinc-200">
                                {report.type}
                              </span>
                            </td>
                            
                            <td className="px-5 py-3.5 whitespace-nowrap text-right">
                              {/* TRANSFORMED SEPARATED ICON BUTTON SETS WITH MICRO-DYNAMICS */}
                              <div className="inline-flex items-center gap-1 bg-zinc-100/80 p-1 rounded-lg border border-zinc-200 group-hover:bg-white transition duration-150 shadow-inner group-hover:shadow-none">
                                <button
                                  type="button"
                                  onClick={() => triggerExport("Excel", report.name)}
                                  className="flex items-center justify-center w-7 h-7 rounded-md text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition border border-transparent hover:border-emerald-200"
                                  title="Export to Excel Spreadsheet (.xlsx)"
                                >
                                  <FileSpreadsheet size={15} />
                                </button>
                                
                                <span className="w-px h-4 bg-zinc-200"></span>
                                
                                <button
                                  type="button"
                                  onClick={() => triggerExport("PDF", report.name)}
                                  className="flex items-center justify-center w-7 h-7 rounded-md text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition border border-transparent hover:border-rose-200"
                                  title="Export to PDF Format Document"
                                >
                                  <FileText size={15} />
                                </button>
                                
                                <span className="w-px h-4 bg-zinc-200"></span>
                                
                                <button
                                  type="button"
                                  onClick={() => triggerExport("Print", report.name)}
                                  className="flex items-center justify-center w-7 h-7 rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-800 transition border border-transparent hover:border-zinc-300"
                                  title="Direct Print Processing Layout"
                                >
                                  <Printer size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="py-16 text-center bg-zinc-50/50 rounded-xl border border-dashed border-zinc-200 m-2">
              <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center mx-auto text-zinc-400 mb-3 border border-zinc-200">
                <Search size={18} />
              </div>
              <p className="text-sm font-bold text-zinc-700">No report matrix profiles matched search criteria</p>
              <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
                Try modifying your query parameters or reset search tracking fields to query active blocks.
              </p>
              <button 
                type="button"
                onClick={() => setSearchTerm("")} 
                className="mt-4 px-3 py-1.5 text-xs font-semibold text-[#521785] bg-purple-50 hover:bg-purple-100 rounded-lg transition border border-purple-200"
              >
                Reset Search Filter
              </button>
            </div>
          )}
        </div>
        
        {/* COMPLIANCE META INFO FOOTER BLOCK */}
        <div className="bg-zinc-50 border-t border-zinc-100 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-zinc-400 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-emerald-500" />
            <span>HL7 Compliance Standards Validated Reporting Pipeline</span>
          </div>
          <div>
            <span>Data Matrix Pipeline Version: 2.4.0-stable</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ICUReports;
