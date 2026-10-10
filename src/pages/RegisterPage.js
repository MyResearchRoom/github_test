import React, { useRef, useState } from "react";
import { myImg } from "../assets/Images";
import { IoCameraOutline, IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../commonComponent/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PatientInput } from "../modal/ReceptionistModal/PatientRegistrationForm";
import { adminDoctorValidator } from "../utils/adminDoctorValidators";

const RegisterPage = () => {

  const profileRef = useRef(null);
  const [profilePic, setProfilePic] = useState(myImg.userIcon); //State for the profile picture
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    address: "",
    email: "",
    dateOfBirth: "",
    age: "",
    gender: "",
    clinicName: "",
    medicalLicenceNumber: "",
    medicalDegree: "",
    password: "",
    profile: null,
    clinicAddress: "",
    specialization: "",
    experience: "",
    department:"",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        profile: file,
      }));
      setProfilePic(url);
    }
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today.setFullYear(today.getFullYear() - 18));
    return maxDate.toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    if (name === "dateOfBirth") {
      const age = calculateAge(value);
      if (age < 18 || age > 120) {
        return toast.error("Age must be 18 or older");
      }
      setFormData((prevData) => ({
        ...prevData,
        dateOfBirth: value,
        age: age.toString(), 
      }));
      return;
    }

    if (name === "mobileNumber") {
      if (!/^\d*$/.test(value)) {
        return toast.error("Invalid Input");
      }
      if (value.length > 10) {
        return toast.error("mobile Number  cannot be more than 10 digits");
      }
    }
    if (name === "age") {
      if (formData.dateOfBirth === "") {
        return toast.error("Please select date of birth");
      }
    }

    if (name === "address") {
      if (value.length <= 50) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      } else {
        return toast.error("Address cannot be more than 50 characters");
      }
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = adminDoctorValidator({ ...formData, confirmPassword });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please filled required field");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/doctors/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        setProfilePic(myImg.profile);
        toast.success(response?.data?.message || "Registration successfull!");
        setLoading(false);
        setFormData({
          name: "",
          mobileNumber: "",
          address: "",
          email: "",
          dateOfBirth: "",
          age: "",
          gender: "",
          clinicName: "",
          medicalLicenceNumber: "",
          medicalDegree: "",
          password: "",
          profile: null,
          clinicAddress: "",
          specialization: "",
          experience: "",
        });
        setConfirmPassword("");
        navigate("/");
      }
    } catch (error) {
      setLoading(false);
      const errors = error?.response?.data?.errors;
      if (errors) {
        for (const err of errors) {
          toast.error(err.msg);
        }
      } else {
        toast.error(
          error?.response?.data?.error ||
            error?.response?.data?.message ||
            "An Error occurred"
        );
      }
    } finally{
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen h-auto bg-gray-50 flex flex-col items-center py-6">
      {/* style={{backgroundImage:`url(${myImg.bgImage})`}} */}
      {/* <div
        className="w-full h-full flex flex-col items-center "
        style={{ scrollbarWidth: "none" }}
      > */}
      <h1 className="text-2xl md:text-3xl font-bold text-[#343C6A] mb-6">
        Doctor Registration Form
      </h1>

      <div className="lg:w-[80%] md:w-[90%] sm:w-[70%] w-[90%] max-w-4xl bg-white shadow-md rounded-xl px-6 py-8">
        <div className="relative mb-4 flex justify-center">
          {/* Profile Image */}
          <div className="relative group">
            <img
              src={profilePic || myImg.userIcon}
              alt="profile"
              className="cursor-pointer w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full object-cover shadow-md border-2 border-gray-200 group-hover:opacity-90 transition"
            />

            {/* File Input (Hidden) */}
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              name="profile"
              className="hidden"
              ref={profileRef}
              onChange={handleImageChange}
            />

            {/* Camera Icon */}
            <span
              onClick={() => profileRef.current.click()}
              className="absolute bottom-0 right-0 p-2 bg-white shadow-md rounded-full cursor-pointer border border-gray-200 group-hover:scale-105 transition"
            >
              <IoCameraOutline size={20} color="#343c6a" />
            </span>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className=""
        >
          <div className="grid md:grid-cols-2 grid-cols-1 md:gap-4 gap-2 text-[#343c6a] ">
            <h1 className="text-left md:col-span-2 col-span-1 text-lg font-semibold text-[#343c6a] mt-4 mb-4 border-b pb-2">
              <span className="underline">Personal Information</span>
            </h1>
            <PatientInput
              label="Doctor Name:"
              placeholder="Enter full name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required={true}
              error={errors.name}
            />
            <PatientInput
              label="Address :"
              placeholder="Street Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required={true}
              error={errors.address}
            />
            <PatientInput
              label="Mobile Number :"
              placeholder="Enter Mobile Number"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              required={true}
              error={errors.mobileNumber}
            />
            <PatientInput
              label="Email ID :"
              placeholder="Enter Email ID"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required={true}
              error={errors.email}
            />
            <PatientInput
              label="Date Of Birth :"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth || ""}
              onChange={handleChange}
              // onClick={(e) => e.target.showPicker()}
              max={getMaxDate()}
              required={true}
              error={errors.dateOfBirth}
            />
            <PatientInput
              label="Age"
              placeholder="Enter Age"
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              readOnly={true}
            />

            <div className={`flex  flex-col  `}>
              <label className="  font-medium xl:text-base text-sm md:mb-0 mb-1">
                Gender
                {<span className="text-red-500">*</span>}
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required={true}
                className="outline-none border p-2  rounded-md bg-[#F6F6F7] border-[#E7E1E1] focus:border focus:border-zinc-400"
                style={{ width: "100%" }}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <span className="text-sm text-red-500">{errors.gender}</span>
              )}
            </div>
            <hr className="md:col-span-2 col-span-1" />
            <h1 className="text-left md:col-span-2 col-span-1 text-lg font-semibold text-[#343c6a] mt-4 mb-4 border-b pb-2">
              <span className="underline">Professional Information</span>
            </h1>
            <PatientInput
              label="Medical License Number :"
              placeholder="Enter License Number"
              name="medicalLicenceNumber"
              value={formData.medicalLicenceNumber}
              onChange={handleChange}
              required={true}
              error={errors.medicalLicenceNumber}
            />

            <div className={`flex  flex-col  gap-1 `}>
              <label className="  font-medium xl:text-base text-sm md:mb-0 mb-1">
                Department
                {<span className="text-red-500">*</span>}
              </label>
              <select
                name="department"
                value={formData.department}
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
              label="Specialization :"
              placeholder="Enter Specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
            />

            <PatientInput
              label="Qualification :"
              placeholder="Enter qualification"
              name="medicalDegree"
              value={formData.medicalDegree}
              onChange={handleChange}
              required={true}
              error={errors.medicalDegree}
            />

            <PatientInput
              label="Experience (In Years) :"
              type="number"
              name="experience"
              value={formData.experience}
              min={0}
              placeholder="Enter experience"
              onChange={handleChange}
              onKeyDown={(e) => {
                if (["+", "-", "E", "e"].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              required={true}
              error={errors.experience}
            />

            <PatientInput
              label="Clinic Name :"
              placeholder="Enter Clinic Name"
              name="clinicName"
              value={formData.clinicName}
              onChange={handleChange}
              required={true}
              error={errors.clinicName}
            />
            <PatientInput
              label="Clinic Address :"
              placeholder="Enter Clinic Address"
              name="clinicAddress"
              value={formData.clinicAddress}
              onChange={handleChange}
              required={true}
              error={errors.clinicAddress}
            />
            <hr className="md:col-span-2 col-span-1" />
            {/* Create Password */}
            <div className="flex flex-col">
              <label className="xl:text-base text-sm font-medium md:mb-0 mb-1">
                Create Password: <span className="text-red-500 text-sm">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  required={true}
                  className="w-[100%] p-2 outline-none
                    border rounded-md bg-[#F6F6F7] border-[#E7E1E1] focus:border focus:border-zinc-400"
                  value={formData.password}
                  onChange={handleChange}
                />
                {/* Eye Icon */}
                <span
                  className="absolute top-3 right-3 cursor-pointer"
                  onClick={togglePasswordVisibility}
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

            {/* Re-enter Password */}
            <div className="flex flex-col">
              <label className="xl:text-base text-sm font-semibold md:mb-0 mb-1">
                Re-enter Password:{" "}
                <span className="text-red-500 text-sm">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required={true}
                  placeholder="Re-enter Password"
                  className="w-[100%] p-2 border outline-none rounded-md bg-[#F6F6F7] border-[#E7E1E1] focus:border focus:border-zinc-400"
                  value={confirmPassword}
                  onChange={(e) => {
                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword: "",
                    }));
                    setConfirmPassword(e.target.value);
                  }}
                />
                {/* Eye Icon */}
                <span
                  className="absolute top-3 right-3 cursor-pointer"
                  onClick={toggleConfirmPasswordVisibility}
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

            {/* Left Section */}
          </div>

              <div className="flex justify-center items-center">
 {/* Button */}
          <Button
            className={`mt-4 text-white text-[15px] bg-[#521785] font-semibold mb-4 md:w-[200px] w-full  p-2 ${
              isLoading ? "cursor-wait" : "cursor-pointer"
            }`}
            type="submit"
            // onClick={handleSubmit}
            disabled={isLoading}
          >
            
            {isLoading ? "Registering...": "Register"}
          </Button>
              </div>
         
        </form>
      </div>

      {/* </div> */}
    </div>
  );
};

export default RegisterPage;
