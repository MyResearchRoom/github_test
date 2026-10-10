import React, { useEffect, useState } from "react";
import TableComponent from "../../../commonComponent/TableComponent";
import { AuditLogColumn } from "../tableColumn/AuditLogColumn";
import Pagination from "../../../commonComponent/Pagination";
import { usePagination } from "../../../hooks/usePagination";
import { useFetch } from "../../../hooks/useFetch";

const AuditLogs = () => {
  const { currentPage, totalPages, goToPage, setTotalPages } = usePagination();
  const [audits, setAudits] = useState([]);
  const [date,setDate]=useState('');
  const { data, loading } = useFetch(
    `/api/audit-logs/login/logs`,
    {
      params: {
        date:date,
        page: currentPage,
        limit: 20,
      },
    },
    [currentPage,date]
  );

  useEffect(() => {
    if (data) {
      setAudits(data.data);
      setTotalPages(data.totalPages);
    }
  }, [data]);

  return (
    <div className="min-h-[100%] h-auto bg-white rounded-lg shadow-md w-[100%]">
      <div className="flex justify-between items-center w-full mb-4 px-3 py-2 ">
        <h1 className="font-semibold text-[#343c6a] text-lg md:text-xl">
          Login Logs
        </h1>
        <input
          type="date"
          value={date}
          onChange={(e)=>setDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-500 transition"
        />
      </div>

      <div
        className="w-full h-[90%] px-4 text-sm md:text-[15px]  text-[#343C6A]  rounded-lg overflow-y-auto  "
        style={{ scrollbarWidth: "none" }}
      >
        <TableComponent
          headerBg={"bg-gray-100"}
          columns={AuditLogColumn()}
          data={audits}
          loading={loading}
        />
      </div>
      <div className="px-4 w-full">
        {audits.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            goToPage={goToPage}
          />
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
