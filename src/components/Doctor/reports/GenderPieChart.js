// import React, { useEffect, useState } from "react";
// import { Pie } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import ChartDataLabels from "chartjs-plugin-datalabels";
// import ChartHeader from "../../../commonComponent/ChartHeader";

// import { useFetch } from "../../../hooks/useFetch";
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
// };

// const GenderPieChart = () => {
//   const [month, setMonth] = useState();
//   const [year, setYear] = useState();
//   const [counts, setCounts] = useState({});

//     const {data:genderData}=useFetch(`/api/doctors/gender-percentage`,{
//       params:{
//         month:month,
//         year:year
//       }
//     },[month,year])
  
//     useEffect(()=>{
//       if(genderData?.data){
//          setCounts(genderData?.data);
//       }
//     },[genderData])
  

//   const data = {
//     labels: ["Male", "Female", "Others"], // This is the label data (but will be hidden)
//     datasets: [
//       {
//         data: [
//           counts.malePercentage,
//           counts.femalePercentage,
//           counts.otherPercentage,
//         ],
//         backgroundColor: ["#F49E88", "#BAB2EA", "#BDDDDD"],
//         borderWidth: 1,
//       },
//     ],
//   };

//   return (
//     <>
//       <ChartHeader
//         title="Gender Overview"
//         setMonth={setMonth}
//         year={year}
//         setYear={setYear}
//         month={month}
//       />
//       {!counts.malePercentage &&
//       !counts.femalePercentage &&
//       !counts.otherPercentage ? (
//         <div className="flex flex-col items-center justify-center h-[78%] w-full text-center text-gray-500">
//           <div className="flex items-center justify-center w-16 h-16 mb-3 rounded-full bg-gray-100">
//             📊
//           </div>
//           <p className="text-lg font-semibold">No Data Found</p>
//           <p className="text-sm text-gray-400">
//             Try selecting a different month/year
//           </p>
//         </div>
//       ) : (
//         <div
//           className="flex flex-col  justify-center px-2"
//           style={{ width: "100%", height: "80%" }}
//         >
//           <div
//             style={{ height: "85%" }}
//             className="flex justify-center items-center"
//           >
//             <Pie data={data} options={options} />
//           </div>
//           <div className="h-[15%] flex justify-center items-center gap-2">
//             <p className="flex items-center gap-2 text-[14px]">
//               <span className="h-[8px] w-[8px] rounded-full bg-[#F49E88]"></span>Male
//             </p>
//             <p className="flex items-center gap-2 text-[14px]">
//               <span className="h-[8px] w-[8px] rounded-full bg-[#BAB2EA]"></span>
//               Female
//             </p>
//             <p className="flex items-center gap-2 text-[14px]">
//               <span className="h-[8px] w-[8px] rounded-full bg-[#BDDDDD]"></span>
//               Others
//             </p>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default GenderPieChart;




import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import ChartHeader from "../../../commonComponent/ChartHeader";
import { useFetch } from "../../../hooks/useFetch";

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
};

const GenderPieChart = () => {
  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const [counts, setCounts] = useState({});

  const { data: genderData } = useFetch(
    `/api/doctors/gender-percentage`,
    {
      params: {
        month: month,
        year: year,
      },
    },
    [month, year]
  );

  useEffect(() => {
    if (genderData?.data) {
      setCounts(genderData.data);
    }
  }, [genderData]);

  const data = {
    labels: ["Male", "Female", "Others"],
    datasets: [
      {
        data: [
          counts.malePercentage,
          counts.femalePercentage,
          counts.otherPercentage,
        ],
        backgroundColor: ["#F49E88", "#BAB2EA", "#BDDDDD"],
        borderWidth: 1,
      },
    ],
  };

  const hasData =
    counts.malePercentage ||
    counts.femalePercentage ||
    counts.otherPercentage;

  return (
    <>
      <ChartHeader title="Gender Overview" setMonth={setMonth} year={year} setYear={setYear} month={month} />

      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-[78%] w-full text-center text-gray-500">
          <div className="flex items-center justify-center w-16 h-16 mb-3 rounded-full bg-gray-100">📊</div>
          <p className="text-lg font-semibold">No Data Found</p>
          <p className="text-sm text-gray-400">Try selecting a different month/year</p>
        </div>
      ) : (
        <div className="flex flex-col justify-center px-2 w-full h-[80%]">
          <div className="h-[75%] sm:h-[85%] w-full flex justify-center items-center">
            <div className="w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] lg:w-full lg:h-full">
              <Pie data={data} options={options} />
            </div>
          </div>

          <div className="h-[25%] sm:h-[15%] flex flex-wrap justify-center items-center gap-x-3 sm:gap-4">
            <p className="flex items-center gap-2 text-[12px] sm:text-[14px]">
              <span className="h-[8px] w-[8px] rounded-full bg-[#F49E88]"></span>
              Male
            </p>
            <p className="flex items-center gap-2 text-[12px] sm:text-[14px]">
              <span className="h-[8px] w-[8px] rounded-full bg-[#BAB2EA]"></span>
              Female
            </p>
            <p className="flex items-center gap-2 text-[12px] sm:text-[14px]">
              <span className="h-[8px] w-[8px] rounded-full bg-[#BDDDDD]"></span>
              Others
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default GenderPieChart;