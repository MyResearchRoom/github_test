import React, { useEffect, useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import { useFetch } from "../../../hooks/useFetch";
import apiClient from "../../../api/apiClient";
const AddTime = () => {
  const [shifts, setShifts] = useState({
    shiftName: "",
    shiftStartTime: "",
    shiftEndTime: "",
  });
  const [shiftsList, setShiftsList] = useState([]);
  const [selectedClosedDays, setSelectedClosedDays] = useState([]);
  const [clinicTime, setClinicTime] = useState({
    clinicStartTime: "",
    clinicEndTime: "",
  });

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours, 10);
    const m = minutes;
    const ampm = h >= 12 ? "PM" : "AM";
    const formattedHour = h % 12 || 12;
    return `${formattedHour}:${m} ${ampm}`;
  };

  const toggleDay = (day) => {
    setSelectedClosedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleAddShift = async () => {
    try {
      const response = await apiClient.post(`/api/doctors/addShift`, shifts);

      if (response?.status === 200) {
        toast.success("Shift Added Successfully");
        setShiftsList([...shiftsList, response?.data?.shift]);
        setShifts({
          shiftName: "",
          shiftStartTime: "",
          shiftEndTime: "",
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occurred");
    }
  };

  const handleDeleteShift = async (id) => {
    try {
      const response = await apiClient.delete(`/api/doctors/deleteShift/${id}`);

      if (response?.status === 200) {
        toast.success("Shift deleted successfully");
        setShiftsList((prev) => {
          return prev.filter((item) => item.id !== id);
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occured");
    }
  };

  const handleAddClinic = async () => {
    try {
      const response = await apiClient.post(`/api/doctors/setClinicTime`, {
        ...clinicTime,
        closedDays: selectedClosedDays,
      });

      if (response?.status === 200) {
        toast.success("Clinic Time Added Successfully");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occurred");
    }
  };

  const { data: shiftData } = useFetch("/api/doctors/getShifts");

  useEffect(() => {
    if (shiftData) {
      setShiftsList(shiftData?.data || []);
    }
  }, [shiftData]);

  const { data: clinicData } = useFetch("/api/doctors/getClinicTime");

  useEffect(() => {
    if (clinicData) {
      setClinicTime(clinicData);
      setSelectedClosedDays(clinicData.closedDays || []);
    }
  }, [clinicData]);

  const daysList = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.5fr]  gap-6  h-auto w-full p-4 bg-white rounded-lg shadow-md">
      {/* Left Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Set Shifts */}
        <div className="border rounded-md shadow-sm p-3 bg-white">
          <h1 className="text-[#343c6a] text-lg font-semibold text-center mb-4">
            Set Shifts
          </h1>
          <div className="flex flex-col items-center space-y-3 w-[100%]">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">
                Shift Name
              </label>
              <input
                type="text"
                name="shiftName"
                className="w-full p-2 mt-1 outline-none border border-gray-300 bg-gray-100 rounded-md focus:ring-2 focus:ring-[#8659ad]"
                value={shifts.shiftName}
                onChange={(e) =>
                  setShifts({ ...shifts, shiftName: e.target.value })
                }
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">
                Shift Start Time
              </label>
              <input
                type="time"
                name="shiftStartTime"
                className="w-full p-2 mt-1 outline-none border border-gray-300 bg-gray-100 rounded-md focus:ring-2 focus:ring-[#8659ad]"
                value={shifts.shiftStartTime}
                onChange={(e) =>
                  setShifts({ ...shifts, shiftStartTime: e.target.value })
                }
                onClick={(e) => e.target.showPicker()}
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">
                Shift End Time
              </label>
              <input
                type="time"
                name="shiftEndTime"
                className="w-full p-2 mt-1 outline-none border border-gray-300 bg-gray-100 rounded-md focus:ring-2 focus:ring-[#8659ad]"
                value={shifts.shiftEndTime}
                onChange={(e) =>
                  setShifts({ ...shifts, shiftEndTime: e.target.value })
                }
                onClick={(e) => e.target.showPicker()}
              />
            </div>

            <Button
              variant="outlined"
              className="!w-full !bg-[#8659ad] !text-white !py-2  !border-none !capitalize font-semibold"
              onClick={handleAddShift}
            >
              Add Shift
            </Button>
          </div>
        </div>

        {/* Already Added Shifts */}
        <div className="border rounded-md shadow-sm p-3 bg-white">
          <h1 className="text-[#343c6a] text-lg font-semibold text-center mb-4">
            Already Added Shifts
          </h1>
          <div className="flex flex-col gap-3 h-[90%] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">
            {shiftsList?.length > 0 ? (
              shiftsList.map((shift) => (
                <div
                  key={shift.id}
                  className="flex justify-between items-center border p-2 rounded-lg bg-gray-50 shadow-sm"
                >
                  <div>
                    <p className="font-medium text-black">{shift.shiftName}</p>
                    <p className="text-xs text-gray-600 italic">
                      {formatTime(shift.shiftStartTime)} –{" "}
                      {formatTime(shift.shiftEndTime)}
                    </p>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDeleteShift(shift.id)}
                  >
                    <MdDeleteForever size={20} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm text-center">
                No shifts added yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="border rounded-md shadow-sm p-3 bg-white lg:w-full w-[70%] mx-auto">
        <h1 className="text-[#343c6a] text-lg font-semibold text-center mb-4">
          Set Clinic Time
        </h1>
        <div className="flex flex-col items-center space-y-4 w-[100%]">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">
              Clinic Start Time
            </label>
            <input
              type="time"
              name="clinicStartTime"
              className="w-full p-2 mt-1 outline-none border border-gray-300 bg-gray-100 rounded-md focus:ring-2 focus:ring-[#8659ad]"
              value={clinicTime.clinicStartTime}
              onChange={(e) =>
                setClinicTime({
                  ...clinicTime,
                  clinicStartTime: e.target.value,
                })
              }
              onClick={(e) => e.target.showPicker()}
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">
              Clinic End Time
            </label>
            <input
              type="time"
              name="clinicEndTime"
              className="w-full p-2 mt-1 outline-none border border-gray-300 bg-gray-100 rounded-md focus:ring-2 focus:ring-[#8659ad]"
              value={clinicTime.clinicEndTime}
              onChange={(e) =>
                setClinicTime({ ...clinicTime, clinicEndTime: e.target.value })
              }
              onClick={(e) => e.target.showPicker()}
            />
          </div>

          <div className="w-full">
            <label className="block font-medium mb-2">Clinic Closed On</label>
            <div className="grid grid-cols-3 gap-2">
              {daysList.map((day) => (
                <label key={day} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedClosedDays.includes(day)}
                    onChange={() => toggleDay(day)}
                  />
                  <span>{day}</span>
                </label>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Selected: {selectedClosedDays.join(", ") || "None"}
            </p>
          </div>

          <Button
            variant="outlined"
            className="!w-[100%] !bg-[#8659ad] !text-white !py-2  !border-none !capitalize font-semibold"
            onClick={handleAddClinic}
          >
            Save Clinic Time
          </Button>
          <p className="text-xs text-gray-500 text-left w-[100%]">
            (*Note – Clinic timings & closed days will show on the
            prescription.)
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddTime;
