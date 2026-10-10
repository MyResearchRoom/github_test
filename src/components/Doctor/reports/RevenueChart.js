// import React, { useEffect, useState } from "react";
// import ChartHeader from "../../../commonComponent/ChartHeader";
// import { BsCreditCardFill } from "react-icons/bs";
// import { FaRupeeSign } from "react-icons/fa";
// import { toast } from "react-toastify";
// import { FiDownload } from "react-icons/fi";
// import { myImg } from "../../../assets/Images";
// import { useFetch } from "../../../hooks/useFetch";
// import apiClient from "../../../api/apiClient";

// const RevenueChart = () => {
//   const [month, setMonth] = useState();
//   const [year, setYear] = useState();
//   const [counts, setCounts] = useState();
//   const [downloadYear, setDownloadYear] = useState(false);

//   const { data: revenueData } = useFetch(
//     `/api/doctors/revenue`,
//     {
//       params: {
//         month: month,
//         year: year,
//       },
//     },
//     [month, year]
//   );

//   useEffect(() => {
//     if (revenueData) {
//       setCounts(revenueData?.revenue);
//     }
//   }, [revenueData]);

//   const downloadExcel = async () => {
//     if (!month || !year) {
//       return toast.error("Please select month and year");
//     }
//     try {
//       const response = await apiClient.get(
//         `/api/doctors/revenue-sheet?month=${month}&year=${year}&all=${downloadYear}`,
//         {
//           headers: {
//             Accept:
//               "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//           responseType: "blob",
//         }
//       );

//       if (response.status === 200) {
//         const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
//         const fileName = `revenue-${year}-${month}-${timestamp}.xlsx`;

//         const blob = response.data;
//         const url = window.URL.createObjectURL(blob);
//         const link = document.createElement("a");
//         link.href = url;
//         link.setAttribute("download", fileName);
//         document.body.appendChild(link);
//         link.click();
//         link.remove();
//         window.URL.revokeObjectURL(url);
//       }
//     } catch (error) {
//       // console.log(JSON.parse(error))
//       let errorMessage = "Failed to download Excel";
//       if (error.response) {
//         if (error.response.status === 404) {
//           try {
//             // Convert the Blob into JSON
//             const text = await error.response.data.text();
//             const json = JSON.parse(text);
//             errorMessage = json.message || errorMessage;
//           } catch {
//             errorMessage = "Data not found!";
//           }
//         } else {
//           errorMessage = error.response?.data?.message || errorMessage;
//         }
//       }

//       toast.error(errorMessage);
//     }
//   };

//   return (
//     <div className="lg:w-[100%] md:w-[60%] w-[60%]  mx-auto h-full">
//       <ChartHeader
//         title="Revenue Overview"
//         setMonth={setMonth}
//         year={year}
//         setYear={setYear}
//         month={month}
//       />

//       <div className="flex justify-between items-center">
//         <h1 className="text-[#6B7280] text-[14px] px-2">
//           Revenue Amount per month
//         </h1>
//         {/* <button
//           onClick={downloadExcel}
//           className="flex items-center gap-2 px-4 py-2 mr-2 bg-[#521289] text-white text-sm font-medium rounded-lg shadow hover:bg-[#3b0d66] transition"
//         >
//           <FiDownload size={16} />
//           <img  src={myImg.excelIcon} className="h-6 w-6"/>
//         </button> */}

//         <div className="flex items-center gap-4">
//           {/* Checkbox */}
//           <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
//             <input
//               type="checkbox"
//               checked={downloadYear}
//               onChange={(e) => setDownloadYear(e.target.checked)}
//               className="cursor-pointer"
//             />
//             Whole Year
//           </label>

//           {/* Single Download Button */}
//           <button
//             onClick={downloadExcel}
//             className="flex items-center gap-2 px-4 py-2 mr-2 bg-[#521289] text-white text-sm font-medium rounded-lg shadow hover:bg-[#3b0d66] transition"
//           >
//             <FiDownload size={16} />
//             <img src={myImg.excelIcon} className="h-6 w-6" />
//           </button>
//         </div>
//       </div>
//       <div className="h-[75%] flex justify-center ">
//         <div
//           className="lg:w-[70%] w-full h-[70%] rounded-lg p-2 mt-4 relative  overflow-hidden group cursor-pointer"
//           style={{
//             background: "linear-gradient(180deg, #F0E7FF 36.1%, #D2BEFF 100%)",
//           }}
//         >
//           <BsCreditCardFill color="#521289" size={20} />
//           <h1 className="text-[#521289] flex justify-center items-center text-center h-[60%] gap-2 text-[24px] font-semibold">
//             <FaRupeeSign color="#521289" size={20} /> {counts}
//           </h1>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RevenueChart;








import React, { useEffect, useState } from "react";
import ChartHeader from "../../../commonComponent/ChartHeader";
import { BsCreditCardFill } from "react-icons/bs";
import { FaRupeeSign } from "react-icons/fa";
import { toast } from "react-toastify";
import { FiDownload } from "react-icons/fi";
import { myImg } from "../../../assets/Images";
import { useFetch } from "../../../hooks/useFetch";
import apiClient from "../../../api/apiClient";

const RevenueChart = () => {
  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const [counts, setCounts] = useState();
  const [downloadYear, setDownloadYear] = useState(false);

  const { data: revenueData } = useFetch(
    `/api/doctors/revenue`,
    {
      params: {
        month: month,
        year: year,
      },
    },
    [month, year]
  );

  useEffect(() => {
    if (revenueData) {
      setCounts(revenueData?.revenue);
    }
  }, [revenueData]);

  const downloadExcel = async () => {
    if (!month || !year) {
      return toast.error("Please select month and year");
    }

    try {
      const response = await apiClient.get(
        `/api/doctors/revenue-sheet?month=${month}&year=${year}&all=${downloadYear}`,
        {
          headers: {
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          responseType: "blob",
        }
      );

      if (response.status === 200) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const fileName = `revenue-${year}-${month}-${timestamp}.xlsx`;

        const blob = response.data;
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);

        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      let errorMessage = "Failed to download Excel";

      if (error.response) {
        if (error.response.status === 404) {
          try {
            const text = await error.response.data.text();
            const json = JSON.parse(text);
            errorMessage = json.message || errorMessage;
          } catch {
            errorMessage = "Data not found!";
          }
        } else {
          errorMessage =
            error.response?.data?.message || errorMessage;
        }
      }

      toast.error(errorMessage);
    }
  };

  return (
    <div
      className="
        lg:w-[100%]
        md:w-[100%]
        w-full
        mx-auto
        h-full
        px-1
        sm:px-2
      "
    >
      {/* Header */}
      <ChartHeader
        title="Revenue Overview"
        setMonth={setMonth}
        year={year}
        setYear={setYear}
        month={month}
      />

      {/* Revenue subtitle + download controls */}
      <div
        className="
          flex
          justify-between
          items-center
          gap-2
          px-1
          sm:px-2
          mt-1
        "
      >
        <h1
          className="
            text-[#6B7280]
            text-[12px]
            sm:text-[14px]
            leading-tight
          "
        >
          Revenue Amount per month
        </h1>

        <div
          className="
            flex
            items-center
            gap-2
            sm:gap-4
            shrink-0
          "
        >
          {/* Checkbox */}
          <label
            className="
              flex
              items-center
              gap-1
              sm:gap-2
              text-[10px]
              sm:text-xs
              text-gray-700
              cursor-pointer
              whitespace-nowrap
            "
          >
            <input
              type="checkbox"
              checked={downloadYear}
              onChange={(e) => setDownloadYear(e.target.checked)}
              className="cursor-pointer"
            />

            <span>Whole Year</span>
          </label>

          {/* Download */}
          <button
            onClick={downloadExcel}
            className="
              flex
              items-center
              justify-center
              gap-1
              sm:gap-2
              px-2
              sm:px-4
              py-1.5
              sm:py-2
              mr-0
              bg-[#521289]
              text-white
              text-xs
              sm:text-sm
              font-medium
              rounded-lg
              shadow
              hover:bg-[#3b0d66]
              transition
              shrink-0
            "
          >
            <FiDownload
              size={14}
              className="sm:w-4 sm:h-4"
            />

            <img
              src={myImg.excelIcon}
              className="h-5 w-5 sm:h-6 sm:w-6"
              alt="Excel"
            />
          </button>
        </div>
      </div>

      {/* Revenue Card */}
      <div
        className="
          h-[75%]
          flex
          justify-center
          items-start
          px-1
          sm:px-2
        "
      >
        <div
          className="
            w-full
            md:w-[75%]
            lg:w-[70%]
            h-[65%]
            md:h-[70%]
            lg:h-[70%]
            rounded-lg
            p-2
            mt-3
            sm:mt-4
            relative
            overflow-hidden
            group
            cursor-pointer
          "
          style={{
            background:
              "linear-gradient(180deg, #F0E7FF 36.1%, #D2BEFF 100%)",
          }}
        >
          <BsCreditCardFill
            color="#521289"
            size={20}
          />

          <h1
            className="
              text-[#521289]
              flex
              justify-center
              items-center
              text-center
              h-[60%]
              gap-1
              sm:gap-2
              text-[20px]
              sm:text-[24px]
              font-semibold
              break-all
            "
          >
            <FaRupeeSign
              color="#521289"
              size={18}
              className="sm:w-5 sm:h-5 shrink-0"
            />

            {counts ?? 0}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;

