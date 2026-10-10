import React from "react";
import { capitalizeWords } from "../../../utils/capitalizeWords";
import { Button } from "@mui/material";

export const PatientListColumn = ({handleViewDetails}) => {
  return [
    {
      label: "Sr No.",
      field: "",
      render: (_, idx) => idx + 1,
      headerClassName:'text-left pl-1 ',
      className:'text-sm text-left pl-1 '
    },
    {
      label: "Patient Name",
      field: "",
      render: (item) => (
        <p className="text-sm pl-1">
          {capitalizeWords(item?.patient?.name)} <br />
          <span className={`${item?.patient?.mobileNumber ? "block" : "hidden"}`}>
            ({item?.patient?.mobileNumber})
          </span>
        </p>
      ),
      headerClassName:'text-left pl-1 ',
      className:'text-left text-sm w-[25%]'
    },
    {
      label: "PID",
      field: "patientId",
       headerClassName:'text-left pl-1 ',
      className:'text-left text-sm pl-1',
      render: (item) => (
        <p className="pl-1">{item?.patient?.patientId}</p>
      ),
    },
    {
      label: "Last Visit",
      field: "",
      render: (item) => (
        <p className="pl-1">{item?.date?.slice(0, 10)}</p>
      ),
      headerClassName:'text-left pl-1 ',
      className:'text-left text-sm pl-1'
    },
    {
      label: "Visit Reason",
      field: "",
      render: (item) => (
        <p className="pl-1">{item?.reason}</p>
      ),
      headerClassName: "text-left pl-2 min-w-0 max-w-xs",
      className: "text-left text-sm pl-2 min-w-0 max-w-[80px] whitespace-normal break-all",
    },
    {
      label: "Process",
      field: "",
      render: (item) => (
        <button
          className={`w-20 h-6 md:w-24 md:h-8  rounded-lg text-sm  ${
            item?.process === "In-Person"
              ? "text-[#b76df3]"
              : "text-[#58b3f8]"
          }`}
        >
          {item?.process}
        </button>
      ),
       headerClassName:'text-center ',
      className:'text-center text-sm '
    },
    {
      label: "History",
      field: "",
      render: (item) => (
        <Button
          variant="outlined"
          className="!border-none !capitalize !bg-[#F2E2FF] !text-[#343C6A] "
          onClick={() => handleViewDetails(item.patient)}
        >
          View
        </Button>
      ),
       headerClassName:'text-center  ',
      className:'text-center text-sm '
    },
  ];
};
