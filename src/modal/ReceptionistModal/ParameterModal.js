import React, { useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import InputField from "../../commonComponent/InputField";

import { toast } from "react-toastify";
import useModalClose from "../../hooks/useModalClose";
import { Button } from "@mui/material";
import { Activity, Droplet, Ruler, Thermometer, Weight } from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "../../api/apiClient";

const ParameterModal = ({
  openParameter,
  setOpenParameter,
  parameters,
  appointmentId,
}) => {
  const modalRef = useRef();
  const handleClose = () => {
    setOpenParameter(false);
  };
  useModalClose(modalRef, handleClose);
  const [parameterData, setParameterData] = useState(
    parameters || {
      sugar: "",
      bloodPressure: "",
      temprature: "",
      height: "",
      weight: "",
    }
  );

  const handleInput = (e) => {
    const floatRegex = /^-?\d*\.?\d*$/;
    const { name, value } = e.target;
    if (name === "bloodPressure") {
      setParameterData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      if (!floatRegex.test(value)) {
        return toast.error("Invalid Input");
      }
      if (value < 0) {
        return toast.error("Invalid Input");
      }
      setParameterData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddSubmit = async (parameters) => {
    const {sugar,bloodPressure,temprature,height,weight} =parameterData;
    if(!sugar && !bloodPressure && !temprature && !height && !weight) return
    try {
      const response = await apiClient.put(
        `/api/appointments/parameters/${appointmentId}`,
        {
          parameters,
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        setOpenParameter(!openParameter);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to add paramters");
    }
  };

  useEffect(() => {
    if (openParameter) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // Cleanup when modal unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openParameter]);

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl shadow-2xl lg:w-[50%] w-[90%]  bg-white max-h-[90%] relative flex flex-col items-center object-cover pb-4"
      >
        <div className="flex rounded-t-2xl bg-[#521785]  text-white justify-start items-center w-full px-5 py-3 border-b border-gray-200 mb-4">
          <h1 className="font-semibold xl:text-xl text-base ">Add Vitals</h1>
          <RxCross2
            
            className="cursor-pointer text-xl  text-white hover:text-red-500 absolute right-2"
            onClick={() => setOpenParameter(!openParameter)}
          />
        </div>

        <div
          className="space-y-2 mb-4 md:w-[70%] w-[90%] overflow-y-auto"
          style={{ scrollbarWidth: "thin" }}
        >
          {/* Height */}
          <div className=" border rounded-lg px-3 py-2 shadow-sm bg-white/70 hover:bg-[#fcf9ff] cursor-pointer">
            <InputField
              onChange={handleInput}
              name="height"
              value={parameterData.height}
              placeholder="Enter Height (cm)"
              label="Height (cm)"
              className={"text-sm"}
              icon={<Ruler className="text-[#8659ad]  text-sm" size={18} />}
            />
          </div>

          {/* Weight */}
          <div className=" border rounded-lg px-3 py-2 bg-white/70 hover:bg-[#fcf9ff] cursor-pointer">
            <InputField
              onChange={handleInput}
              name="weight"
              value={parameterData.weight}
              placeholder="Enter Weight (Kg)"
              label="Weight (Kg)"
              className={"text-sm"}
              icon={<Weight className="text-[#8659ad]   text-sm" size={18} />}
            />
          </div>
          {/* Blood Pressure */}
          <div className=" border rounded-lg px-3 py-2 bg-white/70 hover:bg-[#fcf9ff] cursor-pointer">
            <InputField
              onChange={handleInput}
              name="bloodPressure"
              value={parameterData.bloodPressure}
              placeholder="Ex. 120/80 mmHg"
              label="B.P (mmHg)"
              className={"text-sm"}
              icon={<Activity className="text-[#8659ad]  text-sm" size={18} />}
            />
          </div>

          {/* Sugar */}
          <div className=" border rounded-lg px-3 py-2 bg-white/70 hover:bg-[#fcf9ff] cursor-pointer">
            <InputField
              onChange={handleInput}
              name="sugar"
              value={parameterData.sugar}
              placeholder="Sugar (mg/dL)"
              label="Sugar Level (mg/dL)"
              className={"text-sm"}
              icon={<Droplet className="text-[#8659ad]   text-sm" size={18} />}
            />
          </div>

          {/* Temperature */}
          <div className=" border rounded-lg px-3 py-2 bg-white/70 hover:bg-[#fcf9ff] cursor-pointer">
            <InputField
              onChange={handleInput}
              name="temprature"
              value={parameterData.temprature}
              placeholder="Temperature (°F)"
              label="Temperature (°F)"
              className={"text-sm"}
              icon={
                <Thermometer className="text-[#8659ad]   text-sm" size={18} />
              }
            />
          </div>
        </div>

        <Button
          variant="outlined"
          disabled={!appointmentId}
          onClick={() => handleAddSubmit(parameterData)}
          className="!btn_bg w-[150px]  !text-white !border-none !capitalize"
        >
          Done
        </Button>
      </motion.div>
    </div>
  );
};

export default ParameterModal;
