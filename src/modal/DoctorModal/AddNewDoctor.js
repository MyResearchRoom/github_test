import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";
import { motion } from "framer-motion";
import { PatientInput } from "../ReceptionistModal/PatientRegistrationForm";
import { Button } from "@mui/material";
import { doctorValidator } from "../../utils/doctorValidator";
import {
  createSubdoctor,
  updateSubdoctor,
} from "../../services/SubdoctorService";
import { useFetch } from "../../hooks/useFetch";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

const AddNewDoctor = ({ selectedId, setSelectedId, addNewDoctor }) => {
  const isEditMode = selectedId.type === "edit_prev_doctor" ? true : false;

  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    alternateMobileNumber: "",
    specialization: "",
    qualification: "",
    experience: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
    idProof: null,
    gender: "",
    password: "",
    department:"",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    if (
      (name === "mobileNumber" || name === "alternateMobileNumber") &&
      value.length > 10
    ) {
      return;
    }

    setFormdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file upload change
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0]; // single file only
    if (!file) return;
    // check file size (<= 2 MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Please upload a file smaller than 2 MB.");
      e.target.value = ""; // reset input
      return;
    }
    // update state (single file only)
    setFormdata((prev) => ({
      ...prev,
      [name]: file, // directly store file instead of array
    }));
    e.target.value = "";
  };

  const handleReset = () => {
    setFormdata({
      name: "",
      email: "",
      mobileNumber: "",
      alternateMobileNumber: "",
      specialization: "",
      qualification: "",
      experience: "",
      dateOfBirth: "",
      address: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
      idProof: null,
      gender: "",
      password: "",
      department:"",
    });
    setConfirmPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = doctorValidator({
      ...formdata,
      confirmPassword,
      isEdit: false,
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please filled required field");
      return;
    }
    setLoading(true);

    try {
      const response = await createSubdoctor(formdata);
      if (response) {
        toast.success("Doctor created successfully!");
        addNewDoctor(response, false);
        setSelectedId({
          id: null,
          type: null,
        });
      }
    } catch (error) {
      if (Array.isArray(error)) {
        error.forEach((errMsg) => {
          return toast.error(errMsg.msg);
        });
      } else {
        return toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const newErrors = doctorValidator({ ...formdata, isEdit: true });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please filled required field");
      return;
    }

    setLoading(true);

    try {
      const response = await updateSubdoctor(selectedId.id, formdata);
      if (response) {
        toast.success("Doctor updated successfully!");
        addNewDoctor(response, true);
        setSelectedId({
          id: null,
          type: null,
        });
      }
    } catch (error) {
      if (Array.isArray(error)) {
        error.forEach((errMsg) => {
          return toast.error(errMsg.msg);
        });
      } else {
        return toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const { data } = useFetch(
    selectedId?.id && isEditMode && `/api/subdoctors/${selectedId.id}`
  );

  useEffect(() => {
    if (data?.success) {
      const {
        name,
        email,
        mobileNumber,
        alternateMobileNumber,
        specialization,
        qualification,
        experience,
        dateOfBirth,
        address,
        city,
        state,
        country,
        pinCode,
        gender,
        department,
      } = data?.data;
      setFormdata({
        name,
        email,
        mobileNumber,
        alternateMobileNumber,
        specialization,
        qualification,
        experience,
        dateOfBirth,
        address,
        city,
        state,
        country,
        pinCode,
        idProof: null,
        gender,
        password: "",
        department,
      });
    }
  }, [data]);

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl shadow-2xl bg-white w-[80%] max-h-[90%]  relative flex flex-col items-center object-cover"
      >
        <div className="p-2 rounded-t-2xl bg-[#521785]  text-white flex w-full items-center justify-start pl-[5%] mb-2">
          <h1 className="font-semibold xl:text-xl text-base text-left">
            {isEditMode ? "Update Doctor Details" : "Add New Doctor"}
          </h1>
          <RxCross2
            size={20}
            // color="#343c6a"
            onClick={() => setSelectedId({ type: null, id: null })}
            className="cursor-pointer absolute right-2 text-white"
          />
        </div>

        {/* Form */}
        <form
          className="w-[90%] h-[90%] relative overflow-y-auto"
          style={{ scrollbarWidth: "none" }}
          onSubmit={isEditMode ? handleEdit : handleSubmit}
        >
          <div
            className=" grid grid-cols-2 lg:grid-cols-3 w-[100%] gap-3 mb-4 overflow-y-auto"
            style={{ scrollbarWidth: "none" }}
          >
            <h1 className="col-span-2 lg:col-span-3 font-semibold xl:text-xl text-base border-b pb-2 text-zinc-800  border-zinc-400">
              Basic Details : -
            </h1>
            <PatientInput
              label="Name"
              type="text"
              name={"name"}
              value={formdata.name}
              placeholder="Enter name"
              required={true}
              onChange={handleChange}
              error={errors.name}
            />
            <PatientInput
              label="Email"
              type="email"
              name={"email"}
              value={formdata.email}
              placeholder="Enter email"
              required={true}
              onChange={handleChange}
              error={errors.email}
            />
            <PatientInput
              label="Mobile Number"
              type="number"
              name={"mobileNumber"}
              value={formdata.mobileNumber}
              placeholder="Enter mobile"
              required={true}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (["+", "-", "e", "E"].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              error={errors.mobileNumber}
            />

            <PatientInput
              label="Alternate Mobile Number"
              type="number"
              name={"alternateMobileNumber"}
              value={formdata.alternateMobileNumber}
              placeholder="Enter mobile"
              onChange={handleChange}
              onKeyDown={(e) => {
                if (["+", "-", "e", "E"].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              error={errors.alternateMobileNumber}
            />
            <PatientInput
              label="Date of Birth"
              type="date"
              name={"dateOfBirth"}
              value={formdata.dateOfBirth}
              placeholder="Enter date"
              required={true}
              onChange={handleChange}
              error={errors.dateOfBirth}
            />
            <div className={`flex  flex-col  gap-1 `}>
              <label className="  font-medium xl:text-base text-sm md:mb-0 mb-1">
                Gender
                {<span className="text-red-500">*</span>}
              </label>
              <select
                name="gender"
                value={formdata.gender}
                required={true}
                onChange={handleChange}
                className="outline-none border p-2  rounded-md bg-[#F6F6F7] border-[#E7E1E1] focus:border focus:border-zinc-400"
                style={{ width: "100%" }}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors?.gender && (
                <span className="text-sm text-red-500">{errors.gender}</span>
              )}
            </div>

            <h1 className="col-span-2 lg:col-span-3 font-semibold xl:text-xl text-base border-b pb-2 text-zinc-800  border-zinc-400">
              Professional Details : -
            </h1>

            <div className={`flex  flex-col  gap-1 `}>
              <label className="  font-medium xl:text-base text-sm md:mb-0 mb-1">
                Department
                {<span className="text-red-500">*</span>}
              </label>
              <select
                name="department"
                value={formdata.department}
                required={true}
                onChange={handleChange}
                className="outline-none border p-2  rounded-md bg-[#F6F6F7] border-[#E7E1E1] focus:border focus:border-zinc-400"
                style={{ width: "100%" }}
              >
                <option value="">Select department</option>
                <option value="Orthopaedics Department">Orthopaedics Department</option>
                <option value="ICU Trauma Care Center">ICU Trauma Care Center</option>
                <option value="Radiology Department">Radiology Department</option>
                <option value="Surgery Department">Surgery Department</option>
                <option value="Medicine Department">Medicine Department</option>
                <option value="Paediatrics Department">Paediatrics Department</option>
                <option value="Ophthalmology Department">Ophthalmology Department</option>
                <option value="Obstetrics & Gynaecology Department">Obstetrics & Gynaecology Department</option>
                <option value="other">Other</option>

              </select>
              {errors?.department && (
                <span className="text-sm text-red-500">{errors.department}</span>
              )}
            </div>

            <PatientInput
              label="Specialization"
              type="text"
              name={"specialization"}
              value={formdata.specialization}
              placeholder="Enter specialization"
              required={true}
              onChange={handleChange}
              error={errors.specialization}
            />
            <PatientInput
              label="Qualification"
              type="text"
              name={"qualification"}
              value={formdata.qualification}
              placeholder="Enter qualification"
              required={true}
              onChange={handleChange}
              error={errors.qualification}
            />
            <PatientInput
              label="Experience (In Years)"
              type="number"
              name={"experience"}
              value={formdata.experience}
              placeholder="(in years)"
              required={true}
              onChange={handleChange}
              error={errors.experience}
              min={0}
            />
            

            <h1 className="col-span-2 lg:col-span-3 font-semibold xl:text-xl text-base border-b pb-2 text-zinc-800  border-zinc-400">
              Address Details : -
            </h1>

            <PatientInput
              label="Address"
              type="text"
              name={"address"}
              value={formdata.address}
              placeholder="Enter address"
              required={true}
              onChange={handleChange}
              error={errors.address}
            />
            <PatientInput
              label="City"
              type="text"
              name={"city"}
              value={formdata.city}
              placeholder="Enter city"
              required={true}
              onChange={handleChange}
              error={errors.city}
            />

            <PatientInput
              label="State"
              type="text"
              name={"state"}
              value={formdata.state}
              placeholder="Enter state"
              required={true}
              onChange={handleChange}
              error={errors.state}
            />

            <PatientInput
              label="Country"
              type="text"
              name={"country"}
              value={formdata.country}
              placeholder="Enter country"
              required={true}
              onChange={handleChange}
              error={errors.country}
            />

            <PatientInput
              label="Pin Code"
              type="number"
              name={"pinCode"}
              value={formdata.pinCode}
              placeholder="Enter pin code"
              required={true}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (["+", "-", "e", "E"].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              error={errors.pinCode}
            />

            <h1 className="col-span-2 lg:col-span-3 font-semibold xl:text-xl text-base border-b pb-2 text-zinc-800  border-zinc-400">
              Add Documents & Password : -
            </h1>

            <div className="flex flex-col w-full">
              <label className="font-medium xl:text-base text-sm md:mb-0 mb-1">
                Id Proof
              </label>
              <div className="relative w-full">
                {/* Hidden file input */}
                <input
                  type="file"
                  id="idProof"
                  name="idProof"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {/* Text input showing filename */}
                <input
                  type="text"
                  readOnly
                  className="w-full border p-2 pr-28 rounded-md bg-[#F6F6F7] border-[#E7E1E1] truncate focus:outline-none focus:border-zinc-400"
                  value={formdata.idProof ? formdata.idProof.name : ""}
                  placeholder="No file chosen"
                />

                {/* Browse button inside the input */}
                <label
                  htmlFor="idProof"
                  className="absolute top-0 right-0 h-full bg-[#521785] text-white text-[15px] font-medium px-4 flex items-center justify-center rounded-r-md cursor-pointer"
                >
                  Browse
                </label>
              </div>
            </div>

            <div className={`flex flex-col w-full`}>
              <label className="font-medium xl:text-base text-sm md:mb-0 mb-1">
                Password{" "}
                {selectedId.type !== "edit_prev_doctor" && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <div className="relative w-full">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formdata.password}
                  placeholder="Enter Password"
                  required={isEditMode ? false : true}
                  onChange={handleChange}
                  className={`outline-none border p-2  rounded-md bg-[#F6F6F7] border-[#E7E1E1] focus:border focus:border-zinc-400 w-full`}
                />
                <span
                  className="absolute top-3 right-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <IoEyeOffOutline size={20} />
                  ) : (
                    <IoEyeOutline size={20} />
                  )}
                </span>
              </div>

              {errors?.password && (
                <span className="text-sm text-red-500">{errors.password}</span>
              )}
            </div>
            <div className={`flex flex-col w-full`}>
              <label className="font-medium xl:text-base text-sm md:mb-0 mb-1">
                Confirm Password{" "}
                {selectedId.type !== "edit_prev_doctor" && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <div className="relative w-full">
                <input
                  type={showConfirmPassword ? 'text' : `password`}
                  required={isEditMode ? false : true}
                  value={confirmPassword}
                  placeholder="Enter Confirm Password"
                  onChange={(e) => {
                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword: "",
                    }));
                    setConfirmPassword(e.target.value);
                  }}
                  className={`outline-none border p-2  rounded-md bg-[#F6F6F7] border-[#E7E1E1] focus:border w-full focus:border-zinc-400 `}
                />
                <span
                  className="absolute top-3 right-3 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <IoEyeOffOutline size={20} />
                  ) : (
                    <IoEyeOutline size={20} />
                  )}
                </span>
              </div>
              {errors?.confirmPassword && (
                <span className="text-sm text-red-500">
                  {errors.confirmPassword}
                </span>
              )}
            </div>
          </div>
          <div className="   flex justify-end items-center gap-3 mb-2 w-[100%]">
            <Button
              onClick={handleReset}
              variant="outlined"
              type="button"
              className="!border-none !capitalize  !text-[#343c6a] !bg-gray-200  !w-[100px]"
            >
              Reset
            </Button>
            <Button
              variant="outlined"
              type="submit"
              disabled={loading}
              className={`!bg-[#521785]  !border-none !capitalize  !text-white ${loading ? "cursor-wait" : "cursor-pointer"
                }`}
            >
              {isEditMode ? "Update Doctor" : "Add New Doctor"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddNewDoctor;
