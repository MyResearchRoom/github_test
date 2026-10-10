import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import PrintPrescription from "../../../modal/DoctorModal/PrintPrescription";
import { Button } from "@mui/material";
import ClickableInputBox from "../../../commonComponent/ClickableInputBox";
import { useDispatch, useSelector } from "react-redux";
import {updateAppointment} from "../../../store/slices/todayAppointmentSlice";
import AddMedicine from "./AddMedicine";

import { preloadTranslator } from "../../../utils/translator";
import { translateNote } from "../../../utils/translatePrescription";

const AddPrescription = ({ appointmentId}) => {
  const todayAppointment= useSelector((state)=>state.todayAppointment.appointments);
  let appointment=todayAppointment.find((item)=>item.id === appointmentId)
  const [formData, setFormData] = useState({
    extraFees: "",
    note: "",
    followUp: "",
    investigation: [],
    chiefComplaints:[],
    diagnosis: [],
  });

  const [printLanguage, setPrintLanguage] = useState("en");


  const dispatch=useDispatch();
    //   **************** Prescription Form *******************
  const [complaints, setComplaints] = useState('');
  const [diagnosisText, setDiagnosisText] = useState('');
  const [investigationText, setInvestigationText] = useState('');
  const [printModal, setPrintModal] = useState(false);
  const [prescriptions, setPrescriptions] = useState(appointment?.prescription ? appointment.prescription : []);
  const [loading, setLoading] = useState(false);

  const [language, setLanguage] = useState(appointment?.language ||"en");

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === "extraFees" && Number(value) < 0) {
      return toast.error("Extra Fees cannot be less than 0");
    }

    // Other fields
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInputOnEnter = (e) => {
    
    if (e.key === 'Enter') {
        e.preventDefault();
        const value = e.target.value.trim(); // remove spaces
         if (!value) return; // stop if empty

        if (e.target.name === 'complaints') {

            setFormData((prev) => ({ ...prev, chiefComplaints: [...prev.chiefComplaints , complaints] }));
            setComplaints('');
        }
        else if (e.target.name === 'diagnosisText') {
            setFormData((prev) => ({ ...prev, diagnosis: [...prev.diagnosis, diagnosisText ] }));
            setDiagnosisText('');
        }
        else if (e.target.name === 'investigationText') {
            setFormData((prev) => ({ ...prev, investigation: [...prev.investigation, investigationText ] }));
            setInvestigationText('');
        }
    }
  }

  const handleRemoveText=(type,index)=>{
    if(type === 'diagnosisText'){
      setFormData((prev)=>({
        ...prev,
        diagnosis : prev.diagnosis.filter((_,idx)=>idx!==index)
      }))
    }else if (type === 'investigationText'){
       setFormData((prev)=>({
        ...prev,
        investigation : prev.investigation.filter((_,idx)=>idx!==index)
      }))
    }else if(type === 'complaints'){
       setFormData((prev)=>({
        ...prev,
        chiefComplaints : prev.chiefComplaints.filter((_,idx)=>idx!==index)
      }))
    }
  }

  const handleSubmit = async () => {
  if (appointment?.status === "cancel") {
    toast.error(
      "Can't submit appointment, Appointment is cancelled."
    );
    return;
  }

  try {
    setLoading(true);
    // const { note: translatedNote } = await translateNote({
    //   note: formData?.note || "",
    //   language: language,
    // });

    const submitData = {
      ...formData,
      // note: translatedNote,
      note: formData?.note || "",
      prescription: prescriptions,
      language:language,
    };

    // console.log("Data before submit:", submitData);

    await dispatch(
      updateAppointment({
        appointmentId: appointment.id,
        formData: submitData,
      })
    );

  } catch (error) {
    console.error("Failed to translate note:", error);

    toast.error("Failed to translate note");

  } finally {
    setLoading(false);
  }
};

  useEffect(()=>{
    setFormData({
        extraFees: appointment?.extraFees || '',
        note: appointment?.note || '',
        followUp:  appointment?.followUp || '',
        investigation: appointment?.investigation || [],
        chiefComplaints: appointment?.chiefComplaints || [],
        diagnosis:  appointment?.diagnosis || [],

    })
    setPrescriptions(appointment?.prescription ? appointment.prescription : [])
  },[appointment])

  return (
    <div>
       {printModal && (
        <PrintPrescription
          appointment={appointment}
          onClose={() => setPrintModal(!printModal)}
          selectedLanguage={language}
        />
      )}
      <div className="grid md:grid-cols-2 gap-3 relative bg-[#f6f6f6] mb-4 p-2 pb-2 rounded-lg shadow-sm  ">
        <ClickableInputBox 
        label='Chief Complaint'
        name="complaints"
        placeholder="Enter chief complaint"
        value={complaints}
        onChange={(e)=>setComplaints(e.target.value)}
        handleEnter={handleInputOnEnter}
        list={formData.chiefComplaints}
        handleRemoveText={handleRemoveText}
        />

        <ClickableInputBox 
        label='Diagnosis'
        placeholder="Enter diagnosis"
        name="diagnosisText"
        value={diagnosisText}
        onChange={(e)=>setDiagnosisText(e.target.value)}
        handleEnter={handleInputOnEnter}
        list={formData.diagnosis}
         handleRemoveText={handleRemoveText}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-3 relative bg-[#f6f6f6] mb-4 p-2 pb-2 rounded-lg shadow-sm  ">

       <ClickableInputBox 
            label='Investigation'
            placeholder="Enter investigation"
            name="investigationText"
            value={investigationText}
            onChange={(e)=>setInvestigationText(e.target.value)}
            handleEnter={handleInputOnEnter}
            list={formData.investigation}
            handleRemoveText={handleRemoveText}
        />

        <div className=" text-[14px] lg:text-[16px] space-y-1">
          <p className="w-[100%] font-bold">Advice :</p>
          <textarea
            type="text"
            placeholder="Enter advice"
            rows={5}
            cols={5}
            name="note"
            value={formData.note}
            onChange={handleChange}
            className="px-3 w-[100%] resize-none outline-none bg-white border border-gray-300 rounded-lg"
          />
        </div>

      </div>
        
      <div className="grid md:grid-cols-2 gap-3 relative bg-[#f6f6f6] p-2 pb-2 rounded-lg shadow-sm  ">
        <div className="text-[14px]  lg:text-[16px] font-semibold  flex flex-col space-y-1">
          <label className="font-bold w-[100%]">Follow Up :</label>
          <input
            type="date"
            value={formData.followUp}
            name="followUp"
            onChange={handleChange}
            min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
            onClick={(e) => e.target.showPicker()}
            className="outline-none border p-2 w-[100%]  h-10 rounded-md bg-white border-[#E7E1E1]"
          />
        </div>

        <div className=" text-[14px] lg:text-[16px] font-semibold space-y-1 flex flex-col">
          <label className="font-bold w-[100%] ">Extra Fees :</label>
          <input
            type="number"
            value={formData.extraFees}
            name="extraFees"
            placeholder="Enter extra fees"
            onChange={handleChange}
            className="outline-none border p-2 w-[100%] h-10  rounded-md bg-white border-[#E7E1E1]"
          />
        </div>
      </div>

      <br />
      <hr />

      <AddMedicine prescriptions={prescriptions} setPrescriptions={setPrescriptions} language={language}
    setLanguage={setLanguage} />


      <div className="mb-2 mt-4 flex justify-end items-center space-y-1 gap-3">

          {/* <select
              value={printLanguage}
              onChange={(e) => setPrintLanguage(e.target.value)}
              className="h-[35px] rounded-md bg-[#6d3e96] px-3 text-sm text-white outline-none focus:border-[#521785] focus:ring-1 focus:ring-[#521785] mt-1"
          >
              <option value="en">English</option>
              <option value="mr">मराठी</option>
              <option value="hi">हिन्दी</option>
          </select> */}

          <Button
            onClick={handleSubmit}
            variant="outlined"
            disabled={loading}
            className="!text-white !btn_bg  !border-none  !capitalize disabled:!opacity-50 disabled:!cursor-not-allowed"
          >
             {loading ? "Saving..." : "Save Details"}
          </Button>

          <Button 
            variant="outlined" onClick={()=>setPrintModal(true)} 
            // disabled={!appointment || !Array.isArray(appointment?.prescription) || appointment?.prescription?.length===0} 
            disabled={!appointment} 
            className='!text-white !border-none  !btn_bg  !capitalize '
          >Click to Print</Button>
      </div>
    </div>
  );
};

export default AddPrescription;
