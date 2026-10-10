// import React, { useEffect, useState } from "react";
// import { Pie } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import ChartDataLabels from "chartjs-plugin-datalabels";
// import ChartHeader from "../../../commonComponent/ChartHeader.js";

// import { useFetch } from "../../../hooks/useFetch.js";
// // Register necessary components with Chart.js
// ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

// const options = {
//   responsive: true,
//   plugins: {
//     // Hide the labels in the chart
//     legend: {
//       display: false, // This hides the default legend
//     },
//     datalabels: {
//       color: "#ffffff", // Text color
//       font: {
//         size: 14,
//         weight: "bold",
//       },
//       // formatter: (value) => `${value}%`,
//       formatter: (value) => {
//         return value === 0 ? "" : `${value}%`;
//       },
//     },
//   },

//   cutout: "60%", // This creates the "donut" effect by making the inner part of the pie chart empty
// };

// const AgePieChart = () => {
//   const [month, setMonth] = useState();
//   const [year, setYear] = useState();
//   const [counts, setCounts] = useState({});


//   const {data:ageData}=useFetch(`/api/doctors/age-group-counts`,{
//     params:{
//       month:month,
//       year:year
//     }
//   },[month,year])

//   useEffect(()=>{
//     if(ageData?.data){
//        setCounts(ageData?.data);
//     }
//   },[ageData])

  

//   const data = {
//     labels: ["Young (0-17 yrs)", "Adults (18-49 yrs)", "Seniors (50 & above)"], // This is the label data (but will be hidden)
//     datasets: [
//       {
//         data: [counts.youngCount, counts.adultCount, counts.seniorCount],
//         backgroundColor: ["#7987FF", "#F765A3", "#A155B9"],
//         borderWidth: 1,
//       },
//     ],
//   };

//   return (
//     <>
//       <ChartHeader
//         title="Age Overview"
//         setMonth={setMonth}
//         year={year}
//         setYear={setYear}
//         month={month}
//       />

//       {!counts.youngCount && !counts.adultCount && !counts.seniorCount ? (
//        <div className="flex flex-col items-center justify-center h-[78%] w-full text-center text-gray-500">
//       <div className="flex items-center justify-center w-16 h-16 mb-3 rounded-full bg-gray-100">
//         📊
//       </div>
//       <p className="text-lg font-semibold">No Data Found</p>
//       <p className="text-sm text-gray-400">Try selecting a different month/year</p>
//     </div>
//       ) : (
//         <div
//           className="flex gap-2 justify-between px-2"
//           style={{ width: "100%", height: "78%" }}
//         >
//           <Pie data={data} options={options} />
//           <div className="flex flex-col justify-center">
//             <p className="flex items-center gap-2 text-[14px]">
//               <span className="h-[10px] w-[10px] rounded-full bg-[#7987FF]"></span>
//               Young (0-17 yrs)
//             </p>
//             <p className="flex items-center gap-2 text-[14px]">
//               <span className="h-[10px] w-[10px] rounded-full bg-[#F765A3]"></span>
//               Adults (18-49 yrs)
//             </p>
//             <p className="flex items-center gap-2 text-[14px]">
//               <span className="h-[10px] w-[10px] rounded-full bg-[#A155B9]"></span>
//               Seniors (50 & above)
//             </p>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default AgePieChart;


import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import ChartHeader from "../../../commonComponent/ChartHeader.js";
import { useFetch } from "../../../hooks/useFetch.js";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    datalabels: {
      color: "#ffffff",
      font: {
        size: 14,
        weight: "bold",
      },
      formatter: (value) => {
        return value === 0 ? "" : `${value}%`;
      },
    },
  },
  cutout: "60%",
};

const AgePieChart = () => {
  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const [counts, setCounts] = useState({});

  const { data: ageData } = useFetch(
    `/api/doctors/age-group-counts`,
    {
      params: {
        month: month,
        year: year,
      },
    },
    [month, year]
  );

  useEffect(() => {
    if (ageData?.data) {
      setCounts(ageData.data);
    }
  }, [ageData]);

  const data = {
    labels: ["Young (0-17 yrs)", "Adults (18-49 yrs)", "Seniors (50 & above)"],
    datasets: [
      {
        data: [counts.youngCount, counts.adultCount, counts.seniorCount],
        backgroundColor: ["#7987FF", "#F765A3", "#A155B9"],
        borderWidth: 1,
      },
    ],
  };

  const hasData =
    counts.youngCount || counts.adultCount || counts.seniorCount;

  return (
    <>
      <ChartHeader title="Age Overview" setMonth={setMonth} year={year} setYear={setYear} month={month} />

      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-[78%] w-full text-center text-gray-500">
          <div className="flex items-center justify-center w-16 h-16 mb-3 rounded-full bg-gray-100">📊</div>
          <p className="text-lg font-semibold">No Data Found</p>
          <p className="text-sm text-gray-400">Try selecting a different month/year</p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-between items-center px-2 w-full h-[78%]">
          <div className="w-full sm:w-[60%] lg:w-[65%] h-[190px] sm:h-full flex items-center justify-center">
            <Pie data={data} options={options} />
          </div>

          <div className="w-full sm:w-[40%] lg:w-[35%] flex flex-col justify-center items-start gap-2">
            <p className="flex items-center gap-2 text-[12px] sm:text-[14px]">
              <span className="h-[10px] w-[10px] shrink-0 rounded-full bg-[#7987FF]"></span>
              Young (0-17 yrs)
            </p>
            <p className="flex items-center gap-2 text-[12px] sm:text-[14px]">
              <span className="h-[10px] w-[10px] shrink-0 rounded-full bg-[#F765A3]"></span>
              Adults (18-49 yrs)
            </p>
            <p className="flex items-center gap-2 text-[12px] sm:text-[14px]">
              <span className="h-[10px] w-[10px] shrink-0 rounded-full bg-[#A155B9]"></span>
              Seniors (50 & above)
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AgePieChart;
