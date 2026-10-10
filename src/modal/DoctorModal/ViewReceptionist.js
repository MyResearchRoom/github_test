import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import ReceptionistPasswordModal from "./ReceptionistPasswordModal";
import { RxCross2 } from "react-icons/rx";
import { myImg } from "../../assets/Images";
import { TbUpload } from "react-icons/tb";
import useModalClose from "../../hooks/useModalClose";
import { capitalizeWords } from "../../utils/capitalizeWords";
import { Button } from "@mui/material";
import { useFetch } from "../../hooks/useFetch";
import apiClient from "../../api/apiClient";
import { motion } from "framer-motion";

const Field = ({ label, children }) => (
  <div className="flex items-center gap-2">
    <label className="w-[45%] text-[13px] font-semibold text-[#521785] shrink-0">{label}</label>
    <div className="flex-1 text-[13px] text-[#374151]">{children}</div>
  </div>
);

const ViewReceptionist = React.memo(({ isOpenDetails, onCloseDetails, receptionistId,setReceptionistId }) => {
  const modalRef = useRef();
  // useModalClose(modalRef, onCloseDetails);
  const [receptionist, setReceptionist] = useState({});
  const [shifts, setShifts] = useState([]);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [formData, setFormData] = useState({
    name: "", mobileNumber: "", address: "", email: "",
    age: "", dateOfBirth: "", gender: "", dateOfJoining: "",
    qualification: "", shiftId: "", documents: [],
  });

  const [assignedShift,setAssignedShift]=useState({});

  const { data: receptionistData } = useFetch(`/api/receptionists/${receptionistId}`);
  useEffect(() => {
    if (receptionistData?.receptionist) setReceptionist(receptionistData?.receptionist);
  }, [receptionistData]);

  const openPDFInNewTab = (document) => {
    const newTab = window.open();
    newTab.document.write(`<iframe src="${document}" style="border:0;top:0;left:0;bottom:0;right:0;padding:0;width:100%;height:100%;" allowfullscreen></iframe>`);
    newTab.document.close();
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${minutes} ${ampm}`;
  };

  const getMaxDate = () => {
    const today = new Date();
    return new Date(today.setFullYear(today.getFullYear() - 18)).toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobileNumber") {
      if (!/^\d*$/.test(value)) return toast.error("Invalid Input");
      if (value.length > 10) return toast.error("Mobile number cannot be more than 10 digits");
    }
    if (name === "dateOfBirth") {
      const age = calculateAge(value);
      if (age < 18 || age > 120) return toast.error("Age must be 18 or older");
      setFormData((prev) => ({ ...prev, dateOfBirth: value, age: age.toString() }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const files = Array.from(e.target.files);
    if (!files.every((f) => f.size <= 2 * 1024 * 1024)) return toast.error("Please upload files smaller than 2 MB.");
    if (files.length > 0 && name === "documents")
      setFormData((prev) => ({ ...prev, documents: [...prev.documents, ...files] }));
  };

  const handleSave = async () => {
    if (!isEdit) { setEdit(true); return; }
    if (formData.mobileNumber.length < 10) return toast.error("Mobile number must be 10 digits.");
    if (formData.age < 0) return toast.error("Enter Valid Age");

      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "documents" && Array.isArray(value)) {
          value.forEach((doc) => {
            if (!doc.id && doc instanceof File) {
              payload.append("documents", doc);
            }
          });
        }else if (value !== null && value !== undefined) {
          payload.append(key, value);
        }
      });

    try {
      const response = await apiClient.patch(`/api/receptionists/${receptionistId}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) {
        toast.success("Receptionist updated successfully");
        setEdit(false);
        setReceptionistId(receptionistId);
        setReceptionist(response?.data?.receptionist);
        const shift = shifts.find((s) => s.id === parseInt(response?.data?.receptionist?.shiftId));
        // console.log(shift);
        
        setAssignedShift(shift);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occurred");
    }
  };

  const { data: shiftData } = useFetch(`/api/doctors/getShifts`);
  useEffect(() => {
    if (shiftData?.data) setShifts(shiftData.data);
  }, [shiftData]);

  useEffect(() => {
    if (receptionist) {
      
      setFormData({
        name: receptionist.name || "",
        mobileNumber: receptionist.mobileNumber || "",
        address: receptionist.address || "",
        email: receptionist.email || "",
        age: receptionist.age || "",
        dateOfBirth: receptionist.dateOfBirth ? new Date(receptionist.dateOfBirth).toISOString().split("T")[0] : "",
        gender: receptionist.gender || "",
        dateOfJoining: receptionist.dateOfJoining ? new Date(receptionist.dateOfJoining).toISOString().split("T")[0] : "",
        qualification: receptionist.qualification || "",
        documents: receptionist.documents,
        shiftId: receptionist.shiftId || "",
      });
    }
  }, [receptionist]);

  useEffect(() => {
      const shift = shifts.find((s) => s.id === receptionist.shiftId);
      setAssignedShift(shift);
  }, [receptionist,shifts]);


  const inputCls = "outline-none border border-[#E8EAF6] rounded-lg px-2 py-1 text-[13px] w-full focus:border-[#4F46E5] transition-colors bg-[#F8F9FF]";

  return (
    <>
      {isChangePassword && (
        <ReceptionistPasswordModal
          receptionistId={receptionist?.id}
          setIsChangePassword={setIsChangePassword}
          isChangePassword={isChangePassword}
        />
      )}
      {isOpenDetails && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-40 backdrop-blur-sm">
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.95, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="bg-[#F8F9FF] rounded-2xl shadow-2xl overflow-hidden flex flex-col w-[90%] xl:w-[62%] 2xl:w-[52%]"
            style={{ maxHeight: "92vh" }}
          >
            {/* ── Header ── */}
            <div className="flex items-center px-5 py-3 bg-[#521785] shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-indigo-300 rounded-full" />
                <h1 className="text-white font-semibold text-sm tracking-wide">Receptionist Details</h1>
              </div>
              <button
                onClick={onCloseDetails}
                className="ml-auto text-indigo-200 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              >
                <RxCross2 className="text-lg" />
              </button>
            </div>

            {/* ── Scrollable body ── */}
            <div className="overflow-y-auto flex-1 px-6 py-5" style={{ scrollbarWidth: "thin" }}>

              {/* ── Profile Card ── */}
              <div className="flex flex-col items-center mb-5">
                <div className="relative mb-3">
                  <img
                    src={receptionist?.profile || myImg.userIcon}
                    alt="profile"
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#4F46E5] rounded-full border-2 border-white" />
                </div>
                {isEdit ? (
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`${inputCls} text-center font-bold text-[15px] w-48`}
                    placeholder="Enter Name"
                  />
                ) : (
                  <p className="font-bold text-[15px] text-[#521785] text-center">
                    {capitalizeWords(receptionist?.name)}
                  </p>
                )}
                <span className="mt-1 px-3 py-0.5 bg-[#F0F1FF] border border-[#E8EAF6] rounded-full text-[12px] font-semibold text-[#4F46E5]">
                  ID: {receptionist?.receptionistId}
                </span>
              </div>

              {/* ── Details Grid ── */}
              <div className="bg-white rounded-xl border border-[#E8EAF6] shadow-sm p-4 mb-4">
                <p className="text-[9px] font-bold text-[#4F46E5] uppercase tracking-widest mb-3 border-b border-[#E8EAF6] pb-2">
                  Personal Information
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Mobile Number">
                    {isEdit ? <input name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className={inputCls} placeholder="Enter Mobile Number" /> : receptionist?.mobileNumber}
                  </Field>
                  <Field label="Email ID">
                    <p>{receptionist?.email}</p>
                  </Field>
                  <Field label="Gender">
                    {isEdit ? <input name="gender" value={formData.gender} onChange={handleChange} className={inputCls} placeholder="Enter Gender" /> : capitalizeWords(receptionist?.gender)}
                  </Field>
                  <Field label="Age">
                    {isEdit ? <input name="age" type="number" value={formData.age} readOnly className={`${inputCls} bg-[#F0F1FF] cursor-not-allowed`} placeholder="Auto-calculated" /> : receptionist?.age}
                  </Field>
                  <Field label="Date of Birth">
                    {isEdit ? <input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} className={inputCls} max={getMaxDate()} /> : receptionist?.dateOfBirth}
                  </Field>
                  <Field label="Address">
                    {isEdit ? <input name="address" value={formData.address} onChange={handleChange} className={inputCls} placeholder="Enter Address" /> : receptionist?.address}
                  </Field>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-[#E8EAF6] shadow-sm p-4 mb-4">
                <p className="text-[9px] font-bold text-[#4F46E5] uppercase tracking-widest mb-3 border-b border-[#E8EAF6] pb-2">
                  Professional Information
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Date of Joining">
                    {isEdit ? <input name="dateOfJoining" type="date" value={formData.dateOfJoining} onChange={handleChange} className={inputCls} /> : receptionist?.dateOfJoining?.slice(0, 10)}
                  </Field>
                  <Field label="Qualification">
                    {isEdit ? <input name="qualification" value={formData.qualification} onChange={handleChange} className={inputCls} placeholder="Enter Qualification" /> : receptionist?.qualification}
                  </Field>
                  <Field label="Allotted Shift">
                    {isEdit ? (
                      <select name="shiftId" value={formData.shiftId} onChange={handleChange} className={inputCls}>
                        <option value="">Select Shift</option>
                        {shifts.map((shift) => (
                          <option key={shift.id} value={shift.id}>
                            {shift.shiftName} ({formatTime(shift.shiftStartTime)} – {formatTime(shift.shiftEndTime)})
                          </option>
                        ))}
                      </select>
                    ) : assignedShift ? (
                      <span>
                        {assignedShift.shiftName} ({formatTime(assignedShift.shiftStartTime)} – {formatTime(assignedShift.shiftEndTime)})
                      </span>
                    ) : "—"}
                  </Field>
                  <Field label="Documents">
                    {isEdit ? (
                      <div>
                        <input type="file" id="documentInput" name="documents" multiple accept="application/pdf" onChange={handleFileChange} className="hidden" />
                        <label htmlFor="documentInput" className="flex items-center justify-center gap-2 border border-dashed border-[#4F46E5] rounded-lg h-9 w-full cursor-pointer text-[#4F46E5] text-[12px] font-medium hover:bg-[#F0F1FF] transition-colors">
                          <TbUpload size={15} /> Upload PDF
                        </label>
                      </div>
                    ) : (
                      <select
                        onChange={(e) => { const d = receptionist?.documents?.[e.target.value]; if (d) openPDFInNewTab(d.document); }}
                        className={inputCls}
                      >
                        <option value="">Select Document</option>
                        {receptionist?.documents?.map((doc, idx) => (
                          <option key={idx} value={idx}>{doc?.fileName || "Document"}</option>
                        ))}
                      </select>
                    )}
                  </Field>
                </div>
                {isEdit && formData.documents?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-[#E8EAF6]">
                    {formData.documents.map((doc, i) => (
                      <>
                      {(!doc.id && doc instanceof File) &&  
                      <span key={i} className="text-[11px] text-[#4F46E5] bg-[#F0F1FF] px-2 py-0.5 rounded-full border border-[#E8EAF6]">
                        {doc.name}                        
                      </span>
                      }
                      </>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Footer Bar ── */}
            <div className="shrink-0 flex flex-col md:flex-row justify-end items-center gap-2 px-5 py-3 bg-white border-t border-[#E8EAF6]">
              <button
                onClick={() => setIsChangePassword(!isChangePassword)}
                style={{
                  background: "transparent",
                  color: "#4F46E5", fontWeight: 600, fontSize: "13px",
                  border: "1.5px solid #4F46E5", borderRadius: "10px",
                  padding: "7px 18px", cursor: "pointer",
                }}
              >
                Change Password
              </button>
              <button
                onClick={handleSave}
                style={{
                  background: "linear-gradient(135deg, #521785 0%, #4F46E5 100%)",
                  color: "#fff", fontWeight: 600, fontSize: "13px",
                  border: "none", borderRadius: "10px",
                  padding: "7px 22px", cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(79,70,229,0.3)",
                }}
              >
                {isEdit ? "Save Changes" : "Edit Details"}
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </>
  );
});

export default ViewReceptionist;
