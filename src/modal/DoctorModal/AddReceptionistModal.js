import React, { useEffect, useRef, useState } from "react";
import { TbUpload } from "react-icons/tb";
import { myImg } from "../../assets/Images";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { MdOutlineEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import useModalClose from "../../hooks/useModalClose";
import { Button } from "@mui/material";
import apiClient from "../../api/apiClient";
import { PatientInput } from "../ReceptionistModal/PatientRegistrationForm";

const AddReceptionistModal = ({
  isOpen,
  onClose,
  getReceptionists,
  isEdit = false,
  editData = null,
  receptionistId = null,
  setReceptionistId,
}) => {
  const modalRef = useRef();
  const profileRef = useRef(null);

  useModalClose(modalRef, onClose);

  const defaultFormData = {
    name: "",
    role: "receptionist",
    mobileNumber: "",
    address: "",
    email: "",
    dateOfBirth: "",
    age: "",
    gender: "",
    dateOfJoining: "",
    qualification: "",
    password: "",
    shiftId: "",
    documents: [],
    profile: null,
  };

  const [profilePic, setProfilePic] = useState(myImg.userIcon);
  const [formData, setFormData] = useState(defaultFormData);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [shifts, setShifts] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (isEdit) {
      const fetchReceptionist = async () => {
        const targetId = receptionistId || editData?.id;

        if (!targetId) return;

        try {
          const response = await apiClient.get(`/api/receptionists/${targetId}`);

          if (response?.data?.receptionist) {
            const data = response.data.receptionist;

            setFormData({
              name: data.name || "",
              role: data.role
                ? String(data.role).toUpperCase()
                : "RECEPTIONIST",
              mobileNumber: data.mobileNumber || "",
              address: data.address || "",
              email: data.email || "",
              dateOfBirth: data.dateOfBirth
                ? data.dateOfBirth.slice(0, 10)
                : "",
              age: data.age || "",
              gender: data.gender || "",
              dateOfJoining: data.dateOfJoining
                ? data.dateOfJoining.slice(0, 10)
                : "",
              qualification: data.qualification || "",
              password: "",
              shiftId: data.shiftId || "",
              documents: (data.documents || []).map((doc) => ({
                id: doc.id,
                name: doc.fileName,
                contentType: doc.contentType,
                document: doc.document,
              })),
              profile: null,
            });

            setConfirmPassword("");
            setProfilePic(data.profile || myImg.userIcon);
          }
        } catch (err) {
          toast.error(
            err.response?.data?.error ||
              err.response?.data?.message ||
              err.message ||
              "Failed to fetch receptionist data."
          );
        }
      };

      fetchReceptionist();
    } else {
      setFormData({
        ...defaultFormData,
      });

      setProfilePic(myImg.userIcon);
      setConfirmPassword("");
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen, isEdit, editData, receptionistId]);

  const calculateAge = (dob) => {
    if (!dob) return "";

    const birthDate = new Date(dob);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    const days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months -= 1;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    if (years > 0 && months > 0) {
      return `${years} ${years > 1 ? "years" : "year"} ${months} ${
        months > 1 ? "months" : "month"
      }`;
    }

    if (years > 0) {
      return `${years} ${years > 1 ? "years" : "year"}`;
    }

    return `${months} ${months > 1 ? "months" : "month"}`;
  };

  const formatTime = (time) => {
    if (!time) return "";

    const [hours, minutes] = time.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const formattedHour = h % 12 || 12;

    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(
      today.setFullYear(today.getFullYear() - 18)
    );

    return maxDate.toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobileNumber") {
      if (!/^\d*$/.test(value)) {
        toast.error("Invalid Input");
        return;
      }

      if (value.length > 10) {
        toast.error("Mobile Number cannot be more than 10 digits");
        return;
      }
    }

    if (name === "dateOfBirth") {
      const age = calculateAge(value);

      setFormData((prev) => ({
        ...prev,
        dateOfBirth: value,
        age,
      }));

      return;
    }

    if (name === "age" && formData.dateOfBirth === "") {
      toast.error("Please select date of birth");
      return;
    }

    if (name === "address") {
      if (value.length > 50) {
        toast.error("Address cannot be more than 50 characters");
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInput = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const files = Array.from(e.target.files);

    const isFileSizeValid = files.every(
      (file) => file.size <= 2 * 1024 * 1024
    );

    if (!isFileSizeValid) {
      toast.error("Please upload files smaller than 2 MB.");
      return;
    }

    if (files.length > 0) {
      if (name === "profile") {
        const url = URL.createObjectURL(files[0]);

        setProfilePic(url);

        setFormData((prev) => ({
          ...prev,
          profile: files[0],
        }));
      }

      if (name === "documents") {
        setFormData((prev) => ({
          ...prev,
          documents: [...prev.documents, ...files],
        }));
      }
    }

    e.target.value = "";
  };

  const handleRemoveDocument = async (index, document) => {
    try {
      const targetId = receptionistId || editData?.id;

      if (document.id && targetId) {
        await apiClient.delete(
          `/api/receptionists/${targetId}/documents/${document.id}`
        );
      }

      setFormData((prev) => ({
        ...prev,
        documents: prev.documents.filter((_, idx) => idx !== index),
      }));

      toast.success("Document removed successfully.");
    } catch (err) {
      toast.error("Failed to remove document.");
    }
  };

  const validateForm = () => {
    const { mobileNumber, password, age, role } = formData;

    if (!role) {
      toast.error("Please select a role.");
      return false;
    }

    if (mobileNumber.length < 10) {
      toast.error("Mobile number must be 10 digits.");
      return false;
    }

    if (age < 0) {
      toast.error("Enter valid age");
      return false;
    }

    if (!isEdit) {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

      if (!passwordRegex.test(password)) {
        toast.error(
          "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
        );
        return false;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const endpoint = isEdit
        ? `/api/receptionists/${editData.id}`
        : `/api/receptionists/register`;

      const method = isEdit ? "patch" : "post";

      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "documents" && Array.isArray(value)) {
          value.forEach((doc) => {
            if (!doc.id && doc instanceof File) {
              payload.append("documents", doc);
            }
          });
        } else if (
          key === "profile" &&
          formData.profile instanceof File
        ) {
          payload.append("profile", formData.profile);
        } else if (value !== null && value !== undefined) {
          payload.append(key, value);
        }
      });

      const response = await apiClient[method](endpoint, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(
          isEdit
            ? "Staff updated successfully."
            : "Staff added successfully."
        );

        getReceptionists();

        if (isEdit && typeof setReceptionistId === "function") {
          setReceptionistId(editData.id);
        }

        setFormData({
          ...defaultFormData,
        });

        setProfilePic(myImg.userIcon);
        setConfirmPassword("");
        setShowPassword(false);
        setShowConfirmPassword(false);

        onClose();
      }
    } catch (error) {
      const errors = error?.response?.data?.errors;

      if (errors) {
        errors.forEach((error) => toast.error(error.msg));
      } else {
        toast.error(
          error?.response?.data?.error ||
            "Failed to add staff, Please fill all the details."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      ...defaultFormData,
    });

    setProfilePic(myImg.userIcon);
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const getShifts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/doctors/getShifts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setShifts(response.data.data);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Failed to fetch shifts"
      );
    }
  };

  useEffect(() => {
    getShifts();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div ref={modalRef} className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-3 sm:p-4">
      <div className="rounded-xl sm:rounded-2xl bg-white shadow-2xl w-full sm:w-[94%] lg:w-[88%] xl:w-[80%] max-h-[96vh] sm:max-h-[92vh] relative flex flex-col items-center overflow-hidden">
        <div className="w-full rounded-t-xl sm:rounded-t-2xl bg-[#521785] text-white px-4 sm:px-[5%] py-3 relative flex justify-start items-center shrink-0">
          <h1 className="w-full text-left text-sm sm:text-base lg:text-lg font-semibold pr-8">
            {isEdit ? "Edit Staff Details" : "Staff Registration Form"}
          </h1>

          <RxCross2 size={22} className="cursor-pointer absolute right-3 sm:right-5" onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit} className="w-[90%] sm:w-[90%] lg:w-[88%] h-full relative overflow-y-auto py-3 sm:py-4" style={{ scrollbarWidth: "none" }}>
          <div className="relative flex flex-col items-center mb-4">
            <div className="relative">
              <img src={profilePic || myImg.profile} alt="profilechange" className="cursor-pointer w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-md" />

              <span className="absolute bottom-0 right-0 flex justify-center items-center p-1.5 bg-white rounded-full shadow">
                <input type="file" id="fileInput" accept="image/*" name="profile" className="hidden" ref={profileRef} onChange={handleFileChange} />

                <MdOutlineEdit size={18} color="#343c6a" onClick={() => profileRef.current.click()} className="cursor-pointer" />
              </span>
            </div>
          </div>

          <div className="text-[#343C6A] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            <div className="flex flex-col">
              <label className="font-medium text-sm xl:text-base mb-1">
                Role <span className="text-red-500">*</span>
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="outline-none border p-2 rounded-md bg-[#F6F6F7] border-[#E7E1E1] focus:border-zinc-400 w-full"
              >
                <option value="receptionist">Receptionist</option>
                <option value="nurse">Nurse</option>
              </select>
            </div>

            <PatientInput label="Staff Name :" name="name" placeholder="Enter full name" value={formData.name} onChange={handleChange} required={true} />

            <PatientInput label="Date of Birth :" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} required={true} max={getMaxDate()} />

            <PatientInput label="Age :" name="age" type="text" placeholder="Enter Age" value={formData.age} onChange={handleChange} required={true} readOnly={true} />

            <PatientInput label="Mobile Number :" name="mobileNumber" placeholder="Enter Mobile Number" value={formData.mobileNumber} onChange={handleChange} required={true} />

            <PatientInput label="Email ID :" type="email" name="email" placeholder="Enter Mail ID" value={formData.email} onChange={handleChange} required={true} />

            <div className="flex flex-col">
              <label className="font-medium text-sm xl:text-base mb-1">
                Gender <span className="text-red-500">*</span>
              </label>

              <select name="gender" value={formData.gender} onChange={handleChange} required={true} className="outline-none border p-2 rounded-md bg-[#F6F6F7] border-[#E7E1E1] focus:border-zinc-400 w-full">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <PatientInput label="Date of Joining :" type="date" name="dateOfJoining" value={formData.dateOfJoining} onChange={handleChange} required={true} />

            <PatientInput label="Qualification :" name="qualification" placeholder="Enter Qualification" value={formData.qualification} onChange={handleChange} required={true} />

            <PatientInput label="Address :" name="address" placeholder="Street Address" value={formData.address} onChange={handleChange} required={true} />

            <div className="flex flex-col">
              <label className="mb-1 font-medium text-sm xl:text-base">
                Upload Documents: <span className="text-red-500">*</span>
              </label>

              <input type="file" id="documentInput" name="documents" multiple accept="application/pdf" onChange={handleFileChange} className="hidden" />

              <label className="w-full min-h-[42px] rounded-md bg-[#F6F6F7] border-[#E7E1E1] border flex justify-center items-center p-2 cursor-pointer hover:bg-gray-100 transition" htmlFor="documentInput">
                <TbUpload size={20} />
              </label>

              <div className="flex flex-wrap gap-2 mt-2">
                {formData.documents?.map((doc, index) => (
                  <div key={index} className="flex items-center gap-2 bg-blue-50 border border-blue-300 text-blue-600 px-2 sm:px-3 py-1 rounded-full shadow-sm max-w-full">
                    <span className="text-xs sm:text-sm font-medium truncate max-w-[130px] sm:max-w-[180px]">
                      {doc.name}
                    </span>

                    <RxCross2 className="text-red-500 cursor-pointer shrink-0" size={16} onClick={() => handleRemoveDocument(index, doc)} />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-[#343C6A] mb-1 font-semibold text-sm xl:text-base">
                Assign Shift : <span className="text-red-500">*</span>
              </label>

              <select name="shiftId" value={formData.shiftId} onChange={handleInput} className="outline-none border p-2 rounded-md bg-[#F6F6F7] border-[#E7E1E1] focus:border-zinc-400 w-full">
                <option value="">Select Shift</option>

                {shifts.map((shift) => (
                  <option className="text-[#343C6A]" key={shift.id} value={shift.id}>
                    {shift.shiftName} - ({formatTime(shift.shiftStartTime)} –{" "}
                    {formatTime(shift.shiftEndTime)})
                  </option>
                ))}
              </select>
            </div>

            {!isEdit && (
              <>
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-sm xl:text-base">
                    Create Password :{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} name="password" placeholder="Enter Password" className="p-2 pr-10 outline-none w-full border rounded-md bg-[#F6F6F7] border-[#E7E1E1] focus:border-zinc-400" value={formData.password} onChange={handleChange} />

                    <span className="absolute top-2.5 right-3 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? (
                        <IoEyeOffOutline size={20} />
                      ) : (
                        <IoEyeOutline size={20} />
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-sm xl:text-base">
                    Re-Enter Password:{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" className="w-full p-2 pr-10 outline-none rounded-md bg-[#F6F6F7] border border-[#E7E1E1] focus:border-zinc-400" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                    <span className="absolute top-2.5 right-3 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? (
                        <IoEyeOffOutline size={20} />
                      ) : (
                        <IoEyeOutline size={20} />
                      )}
                    </span>
                  </div>

                  {formData.password !== "" &&
                    confirmPassword !== "" &&
                    formData.password !== confirmPassword && (
                      <span className="text-red-500 text-xs sm:text-sm text-left">
                        Password Not Matched
                      </span>
                    )}

                  {formData.password !== "" &&
                    confirmPassword !== "" &&
                    formData.password === confirmPassword && (
                      <span className="text-green-600 text-xs sm:text-sm text-left">
                        Password Matched
                      </span>
                    )}
                </div>
              </>
            )}
          </div>

          <div className="mt-5 mb-2 w-full flex flex-col-reverse sm:flex-row justify-end items-stretch sm:items-center gap-2 sm:gap-3">
            <Button onClick={handleReset} variant="outlined" type="button" className="!border-none !capitalize !text-[#343c6a] !bg-gray-200 !w-full sm:!w-[100px] !h-10">
              Reset
            </Button>

            <Button type="submit" variant="outlined" className={`!text-white !btn_bg !border-none !capitalize !w-full sm:!w-auto !min-w-[130px] !h-10 ${isLoading ? "!cursor-wait" : ""}`} disabled={isLoading}>
              {isLoading
                ? isEdit
                  ? "Updating..."
                  : "Registering..."
                : isEdit
                ? "Update Staff"
                : "Register Staff"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReceptionistModal;