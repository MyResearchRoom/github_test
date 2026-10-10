import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import { useAppointments } from "../../../context/AppointmentsContext";
import apiClient from "../../../api/apiClient";
import { PatientInput } from "../../../modal/ReceptionistModal/PatientRegistrationForm";
import { Clock2, Trash, Users, Pencil } from "lucide-react";
import { useFetch } from "../../../hooks/useFetch";
import { days } from "../../../data/days";
import PopUpModal from "../../../commonComponent/PopUpModal";

const AddSlot = () => {
  const [doctorAvailability, setDoctorAvailability] = useState({
    slotName: "",
    startTime: "",
    endTime: "",
    doctorId: "",
    doctorType: "",
    maxCapacity: "",
    availabilityIds: [],
  });
  const [doctorId, setDoctorId] = useState("");
  const { subDoctor, setSubdoctor } = useAppointments();
  const [groupedSlots, setGroupedSlots] = useState([]);
  const [isDelete, setIsDelete] = useState({
    access: false,
    dId: null,
    slotId: null
  })
  const [dayError, setDayError] = useState("");

  const doctorTypeFromSlot = (slot) => slot.doctorType || "sub";

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours, 10);
    const m = minutes;
    const ampm = h >= 12 ? "PM" : "AM";
    const formattedHour = h % 12 || 12;
    return `${formattedHour}:${m} ${ampm}`;
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "availabilityIds") {
      const val = parseInt(value);
      setDoctorAvailability((prev) => {
        const currentIds = prev?.availabilityIds || [];
        if (checked) {
          return { ...prev, availabilityIds: [...currentIds, val] };
        } else {
          return {
            ...prev,
            availabilityIds: currentIds.filter((id) => id !== val),
          };
        }
      });
    } else {
      setDoctorAvailability((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleDoctor = (e) => {
    const { value } = e.target;
    setDoctorId(value);
    setDoctorAvailability((prev) => ({
      ...prev,
      doctorId: value.split("-")[0],
      doctorType: value.split("-")[1],
    }));
  };

  const handleAddDoctorTime = async (e) => {
    e.preventDefault();

    if (!doctorAvailability.availabilityIds.length) {
      toast.error("Please select at least one day");
      return;
    }

    try {
      let response;

      if (isEdit.access) {
        response = await apiClient.put(
          `/api/doctor_time_slots/${isEdit.slot.id}`,
          doctorAvailability
        );

        toast.success("Slot updated successfully");
      } else {
        response = await apiClient.post(
          `/api/doctor_time_slots`,
          doctorAvailability
        );

        toast.success("Slot added successfully");
      }

      const res = response?.data?.data;

      setGroupedSlots((prev) => {
        return prev.map((doc) => {
          if (String(doc.id) !== String(res.doctorId || res.subDoctorId))
            return doc;

          const updatedSlots = isEdit.access
            ? doc.slots.map((s) => (s.id === res.id ? res : s))
            : [...doc.slots, res];

          return { ...doc, slots: updatedSlots };
        });
      });

      setIsEdit({ access: false, dId: null, slot: null });

      setDoctorAvailability({
        slotName: "",
        startTime: "",
        endTime: "",
        maxCapacity: "",
        doctorId: "",
        doctorType: "",
        availabilityIds: [],
      });

      setDoctorId("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error occurred");
    }
  };

  const [isEdit, setIsEdit] = useState({
    access: false,
    dId: null,
    slot: null,
  });

  const handleEditSlot = (dId, slot, type) => {
    setIsEdit({
      access: true,
      dId,
      slot,
    });

    setDoctorId(`${dId}-${type}`);

    setDoctorAvailability({
      slotName: slot.slotName,
      startTime: slot.startTime,
      endTime: slot.endTime,
      doctorId: slot.doctorId || slot.subDoctorId,
      doctorType: slot.doctorType,
      maxCapacity: slot.maxCapacity,
      availabilityIds: slot.availabilityIds || [],
    });
  };

  const deleteSlot = async () => {
    const { access, dId, slotId: id } = isDelete; // rename slotId to id

    if (!access || !dId || !id) return;
    try {
      const response = await apiClient.delete(`/api/doctor_time_slots/${id}`);
      if (response?.status === 200) {
        toast.success("Slot deleted successfully");
        setGroupedSlots((prev) =>
          prev.map((item) =>
            String(item.id) === String(dId)
              ? { ...item, slots: item.slots.filter((fil) => fil.id !== id) }
              : item
          )
        );

        setSubdoctor((prev) =>
          prev.map((item) =>
            String(item.id) === String(dId)
              ? { ...item, slots: item.slots.filter((fil) => fil.id !== id) }
              : item
          )
        );

        setIsDelete({
          access: false,
          dId: null,
          slotId: null
        })
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occured");
    }
  };

  const handleDeleteSlot = (dId, id) => {
    if (isDelete?.access) {
      setIsDelete({
        ...isDelete,
        access: false,
        dId: null,
        slotId: null
      })
    } else {
      setIsDelete({
        ...isDelete,
        access: true,
        dId: dId,
        slotId: id
      })
    }

  }



  const { data: doctorSlot } = useFetch(`/api/doctor_time_slots`);
  useEffect(() => {
    if (doctorSlot?.data) {
      setGroupedSlots(doctorSlot?.data);
    }
  }, [doctorSlot]);

  return (
    <>
      {isDelete?.access && <PopUpModal title='Are you sure you want to delete slot?' closeModal={handleDeleteSlot} doneModal={deleteSlot} />}
      <div className="flex justify-center items-center w-full min-h-[100%] h-auto bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 lg:grid-cols-[0.7fr_1fr] gap-6 w-[100%] mx-auto items-start">
          {/* Left Section - Set Slots */}
          <div className="bg-white border rounded-md shadow-sm p-5 text-[#343c6a] text-[15px]">
            <h1 className="lg:text-xl text-lg font-semibold ">Add New Slot</h1>
            <p className="text-sm mb-3">
              Create a new availability slot for appointments
            </p>

            <form onSubmit={handleAddDoctorTime} className="space-y-4">
              <div className="flex flex-col w-full">
                <label className="font-medium xl:text-base text-sm md:mb-0 mb-1">
                  Select Doctor <span className="text-red-500 text-sm">*</span>
                </label>
                <select
                  name="doctorId"
                  required={true}
                  value={doctorId}
                  onChange={handleDoctor}
                  className="outline-none border p-2  rounded-md bg-[#F6F6F7] border-[#E7E1E1] focus:border focus:border-zinc-400"
                >
                  <option value="">Choose a doctor</option>
                  {subDoctor?.length > 0 &&
                    subDoctor.map((doctor) => (
                      <option
                        key={doctor.id}
                        value={`${doctor.id}-${doctor.type}`}
                      >
                        {doctor.name} - {doctor?.specialization}{" "}
                      </option>
                    ))}
                </select>
              </div>
              <PatientInput
                required={true}
                name="slotName"
                value={doctorAvailability?.slotName}
                onChange={handleChange}
                label="Slot Name"
                placeholder="Enter slot name"
              />
              <div className="grid grid-cols-2 gap-2 ">
                <PatientInput
                  required={true}
                  name="startTime"
                  value={doctorAvailability?.startTime}
                  onChange={handleChange}
                  label="Start Time"
                  type="time"
                  placeholder="Enter slot name"
                />
                <PatientInput
                  required={true}
                  name="endTime"
                  value={doctorAvailability?.endTime}
                  onChange={handleChange}
                  label="End Time"
                  type="time"
                  placeholder="Enter slot name"
                />
              </div>
              <PatientInput
                required={true}
                name="maxCapacity"
                value={doctorAvailability?.maxCapacity}
                onChange={handleChange}
                label="Slot Capacity"
                type="number"
                placeholder="Number of patients"
              />
              <div className="flex flex-col w-full">
                <label className="font-medium xl:text-base text-sm md:mb-0 mb-1">
                  Select days <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {days.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`day-${item.id}`}
                        name="availabilityIds"
                        value={item.id}
                        onChange={handleChange}
                        checked={
                          doctorAvailability?.availabilityIds.includes(item.id) ||
                          false
                        }
                      />
                      <label htmlFor={`day-${item.id}`}>{item.day}</label>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                type="submit"
                variant="outlined"
                className="!bg-[#521785] !border-none !w-full !text-white !capitalize"
              >
                {isEdit.access ? "Update Slot" : "Add Slot"}
              </Button>
            </form>
          </div>

          {/* Right Section - Already Added Slots */}
          <div className="border rounded-md text-[#343c6a] shadow-sm p-5 bg-white flex flex-col">
            <h1 className=" lg:text-xl text-lg font-semibold mb-4">
              Doctor Schedules
            </h1>

            <div
              className="flex flex-col gap-3 overflow-y-auto  pr-2 scrollbar-thin scrollbar-thumb-gray-300  max-h-[75vh]"
              style={{ scrollbarWidth: "none" }}
            >
              {groupedSlots.map((doctor) => (
                <div
                  key={doctor.id}
                  className="border-l border-t p-2 border-l-purple-300 border-t-gray-300  relative mt-4 ml-1"
                >
                  <span className="bg-purple-100 text-purple-500 font-medium p-1 rounded-md text-xs   absolute -top-3 -left-1">
                    {doctor?.name}
                  </span>
                  {doctor?.slots?.map((slot) => (
                    <div
                      key={slot.id}
                      className="border relative top-4 mb-2 rounded-md p-2 pb-6 bg-purple-50 border-purple-300"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h2 className="text-sm font-semibold">{slot.slotName}</h2>
                        <div className="flex items-center gap-2">
                          <Pencil
                            onClick={() => handleEditSlot(doctor.id, slot, doctor.type)}
                            className="text-blue-500 cursor-pointer hover:scale-110 transition"
                            size={16}
                          />

                          <Trash
                            onClick={() => handleDeleteSlot(doctor.id, slot.id)}
                            className="text-red-500 cursor-pointer hover:scale-110 transition"
                            size={16}
                          />
                        </div>
                      </div>
                      <div className="flex gap-4 items-center mb-2">
                        <p className="flex gap-2 items-center text-sm">
                          <Clock2 size={14} /> {formatTime(slot.startTime)} -{" "}
                          {formatTime(slot.endTime)}{" "}
                        </p>
                        <p className="flex gap-2 items-center text-sm">
                          <Users size={14} /> {slot.maxCapacity} Patients{" "}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {slot?.availabilityIds?.map((slotId) => {
                          const dayObj = days.find((d) => d.id === slotId);
                          return (
                            <span
                              key={slotId}
                              className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded"
                            >
                              {dayObj?.day}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>

  );
};

export default AddSlot;
