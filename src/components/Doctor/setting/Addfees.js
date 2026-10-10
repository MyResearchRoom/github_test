import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import { useFetch } from "../../../hooks/useFetch";
import apiClient from "../../../api/apiClient";
const Addfees = () => {
  const [feeStructure, setFeeStructure] = useState({
    feesFor: "",
    fees: "",
  });

  const [feesList, setFeesList] = useState([]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "feesFor") {
      const isFeeCategory = feesList.find((item) => item.feesFor === value);

      if (isFeeCategory) {
        setFeeStructure({
          ...feeStructure,
          fees: isFeeCategory.fees,
          feesFor: value,
        });
      } else {
        setFeeStructure({ ...feeStructure, feesFor: value, fees: "" });
      }
    } else {
      setFeeStructure({ ...feeStructure, [name]: value });
    }
  };

  const handleUpload = async () => {
    if (feeStructure.feesFor === "") {
      toast.error("Please select fee category");
    }
    if (feeStructure.fees <= 0) {
      toast.error("Please enter valid amount");
      return;
    }

    try {
      const response = await apiClient.post(`/api/doctors/fees`, feeStructure);

      if (response.status === 201) {
        toast.success("Fees added successfully");
        const data = response.data.data;
        setFeesList((prev) => {
          const isExist = prev.some((item) => item.feesFor === data.feesFor);
          if (!isExist) {
            return [data, ...prev];
          } else {
            return prev.map((item) =>
              item.feesFor === data.feesFor
                ? { ...item, fees: data.fees }
                : item
            );
          }
        });
        setFeeStructure({ feesFor: "", fees: "" });
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occured");
    }
  };

  const { data } = useFetch("/api/doctors/fees");

  useEffect(() => {
    if (data?.data) {
      setFeesList(data?.data);
    }
  }, [data]);

  return (
    <div className="flex justify-center items-center w-full min-h-[100%] p-4  h-auto  bg-white shadow-md rounded-lg ">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-[70%] mx-auto  h-auto">
        {/* Left Side - Add Fees */}
        <div className="border rounded-md shadow-sm p-5 flex flex-col items-center bg-white">
          <h1 className="text-[#343c6a] lg:text-xl text-lg font-semibold text-center mb-4">
            Add Fees
          </h1>

          <select
            name="feesFor"
            value={feeStructure.feesFor}
            onChange={handleChange}
            className="outline-none border p-2 w-full rounded-md bg-[#F6F6F7] border-[#E7E1E1] mb-3"
          >
            <option value="">Select Fee Category</option>
            <option value="Checkup">Checkup</option>
            <option value="Followup">Followup</option>
            <option value="Vaccination">Vaccination</option>
            <option value="Investigation">Investigation</option>
            <option value="Prescription Refill">Prescription Refill</option>
          </select>

          <input
            type="number"
            name="fees"
            placeholder="Enter Charges"
            className="w-full p-2 outline-none border border-[#E7E1E1] bg-[#F6F6F7] rounded-md mb-4"
            value={feeStructure.fees}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
            }}
            onWheel={(e) => e.target.blur()}
            min={0}
          />

          <Button
            variant="outlined"
            className="!text-white !btn_bg !border-none !capitalize !py-2 font-semibold w-full"
            onClick={handleUpload}
          >
            Upload
          </Button>
        </div>

        {/* Right Side - Already Set Fees */}
        <div className="border rounded-md shadow-sm p-5 bg-white flex flex-col ">
          <h2 className="text-[#343c6a] lg:text-lg text-base font-semibold mb-4 text-center">
            Already Set Fees
          </h2>
          <div className="space-y-3 ">
            {feesList && feesList.length > 0 ? (
              feesList.map((fee, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border p-2 rounded-lg bg-gray-50 shadow-sm"
                >
                  <span className="font-medium text-[#343c6a]">
                    {fee.feesFor}
                  </span>
                  <span className="text-[#343c6a] font-semibold">
                    ₹ {fee.fees}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-[#343c6a] text-sm italic text-center">
                No fees set yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addfees;
