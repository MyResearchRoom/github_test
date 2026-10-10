import React from "react";

const AgePieChart = React.lazy(() => import("./AgePieChart"));
const GenderPieChart = React.lazy(() => import("./GenderPieChart"));
const HospitalBarChart = React.lazy(() => import("./HospitalBarChart"));
const RevenueChart = React.lazy(() => import("./RevenueChart"));

export { AgePieChart, GenderPieChart, HospitalBarChart, RevenueChart };
