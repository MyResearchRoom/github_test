// import React, { useRef, useEffect, useState } from "react";
// import { Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
// } from "chart.js";

// import { useFetch } from "../../../hooks/useFetch";

// // Register components with Chart.js
// ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// const months = [
//   "Jan",
//   "Feb",
//   "Mar",
//   "Apr",
//   "May",
//   "Jun",
//   "Jul",
//   "Aug",
//   "Sep",
//   "Oct",
//   "Nov",
//   "Dec",
// ];

// const monthColors = [
//   "#FB896B",
//   "#FF9D0A",
//   "#41C43E",
//   "#3CB1B9",
//   "#3E63C4",
//   "#893EC4",
//   "#F45D76",
//   "#FFBA5A",
//   "#7CD859",
//   "#59D8D8",
//   "#5A91E3",
//   "#BB6CE3",
// ];

// const HospitalBarChart = ({ year }) => {
//   const chartRef = useRef(null);
//   const [monthlyRevanue, setMonthlyRevanue] = useState([]);



//   useEffect(() => {
//     const chart = chartRef.current;

//     if (chart) {
//       const ctx = chart.ctx;
//       const gradients = monthlyRevanue.map((_, i) => {
//         const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
//         gradient.addColorStop(0, monthColors[i]);
//         gradient.addColorStop(1, `${monthColors[i]}66`); // Semi-transparent gradient
//         return gradient;
//       });

//       chart.data.datasets[0].backgroundColor = gradients;
//       chart.update();
//     }
//   }, []);


//    const {data:hospitalData}=useFetch(`/api/doctors/revenue-by-year`,{
//           params:{
//             year:year
//           }
//         },[year])
      
//         useEffect(()=>{
//           if(hospitalData?.monthlyRevenue){
//              setMonthlyRevanue(hospitalData?.monthlyRevenue);
//           }
//         },[hospitalData])


//   const data = {
//     labels: months,
//     datasets: [
//       {
//         label: "Revenue (₹)",
//         data: monthlyRevanue,
//         backgroundColor:  monthlyRevanue.map((_, i) => {
//           const chart = chartRef.current;
//           const ctx = chart ? chart.ctx : null;
//           if (ctx) {
//             const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
//             gradient.addColorStop(0, monthColors[i]);
//             gradient.addColorStop(1, `${monthColors[i]}66`); // Semi-transparent gradient
//             return gradient;
//           }
//           return monthColors[i]; // Fallback color if chart isn't available yet
//         }), 
//         borderWidth: 1,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       x: {
//         grid: {
//           display: false, // Keep grid lines for the x-axis
//         },
//       },
//       y: {
//         beginAtZero: true,
//         ticks: {
//           stepSize: 20000,
//           callback: (value) => {
//             if (value === 0) return "0";
//             if (value >= 1000) return `${value / 1000}k`; // Convert to "k" format for large numbers
//             return value;
//           },
//         },
//         grid: {
//           display: true, // Disable grid lines only on the y-axis
//         },
//         suggestedMax: Math.ceil(
//         Math.max(...monthlyRevanue) / 40000
//       ) * 40000, 
        
//       },
//     },
//     plugins: {
//       legend: {
//         display: false,
//       },
//     },
//   };

//   return (
//     <div className="w-full px-2" style={{ height: "100%" }}>
//       <Bar ref={chartRef} data={data} options={options} />
//     </div>
//   );
// };

// export default HospitalBarChart;








import React, { useRef, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useFetch } from "../../../hooks/useFetch";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const monthColors = [
  "#FB896B",
  "#FF9D0A",
  "#41C43E",
  "#3CB1B9",
  "#3E63C4",
  "#893EC4",
  "#F45D76",
  "#FFBA5A",
  "#7CD859",
  "#59D8D8",
  "#5A91E3",
  "#BB6CE3",
];

const HospitalBarChart = ({ year }) => {
  const chartRef = useRef(null);
  const [monthlyRevanue, setMonthlyRevanue] = useState([]);

  const { data: hospitalData } = useFetch(
    `/api/doctors/revenue-by-year`,
    {
      params: {
        year: year,
      },
    },
    [year]
  );

  useEffect(() => {
    if (hospitalData?.monthlyRevenue) {
      setMonthlyRevanue(hospitalData.monthlyRevenue);
    }
  }, [hospitalData]);

  const data = {
    labels: months,
    datasets: [
      {
        label: "Revenue (₹)",
        data: monthlyRevanue,
        backgroundColor: monthlyRevanue.map((_, i) => {
          const chart = chartRef.current;
          const ctx = chart ? chart.ctx : null;

          if (ctx) {
            const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
            gradient.addColorStop(0, monthColors[i]);
            gradient.addColorStop(1, `${monthColors[i]}66`);
            return gradient;
          }

          return monthColors[i];
        }),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: window.innerWidth < 640 ? 9 : 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 20000,
          font: {
            size: window.innerWidth < 640 ? 9 : 12,
          },
          callback: (value) => {
            if (value === 0) return "0";
            if (value >= 1000) return `${value / 1000}k`;
            return value;
          },
        },
        grid: {
          display: true,
        },
        suggestedMax:
          monthlyRevanue.length > 0
            ? Math.ceil(Math.max(...monthlyRevanue) / 40000) * 40000
            : 40000,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="w-full h-full px-1 sm:px-2">
      <Bar ref={chartRef} data={data} options={options} />
    </div>
  );
};

export default HospitalBarChart;