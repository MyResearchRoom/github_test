import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { toast } from "react-toastify";
import { convertToRatio } from "../../../utils/convertToRatio";
import { useFetch } from "../../../hooks/useFetch";

const CustomInput = ({
  label,
  min,
  name,
  type,
  onChange,
  value,
  placeholder,
  readOnly = false,
}) => {
  return (
    <div className="space-y-2">
      <p className="text-[#343C6A]  font-semibold">{label}</p>
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        readOnly={readOnly}
        onKeyDown={(e) => {
          if (
            e.key === "e" ||
            e.key === "E" ||
            e.key === "+" ||
            e.key === "-"
          ) {
            e.preventDefault();
          }
        }}
        onWheel={(e) => e.currentTarget.blur()}
        className="p-2 outline-none  bg-white border border-gray-300 rounded-md w-full"
      />
    </div>
  );
};
const TRANSLATIONS = {
  en: {
    label: "English",
    selectRoutine: "Select Routine",
    before: "Before Food",
    after: "After Food",
    morning: "Morning",
    afternoon: "Afternoon",
    night: "Night",
    days: "days",
    tot: "Tot",
    ml: "ml",
    selectType: "Select Type",
    tablet: "Tablet",
    syrup: "Syrup",
    injection: "Injection",
    other: "Other",
  },
  mr: {
    label: "Marathi",
    selectRoutine: "दिनचर्या निवडा",
    before: "जेवणापूर्वी",
    after: "जेवणानंतर",
    morning: "सकाळी",
    afternoon: "दुपारी",
    night: "रात्री",
    days: "दिवस",
    tot: "एकूण",
    ml: "मिली",
    selectType: "प्रकार निवडा",
    tablet: "टॅबलेट",
    syrup: "सिरप",
    injection: "इंजेक्शन",
    other: "इतर",
  },
  hi: {
    label: "Hindi",
    selectRoutine: "दिनचर्या चुनें",
    before: "भोजन से पहले",
    after: "भोजन के बाद",
    morning: "सुबह",
    afternoon: "दोपहर",
    night: "रात",
    days: "दिन",
    tot: "कुल",
    ml: "मिली",
    selectType: "प्रकार चुनें",
    tablet: "टैबलेट",
    syrup: "सिरप",
    injection: "इंजेक्शन",
    other: "अन्य",
  },
};

const AddMedicine = ({ prescriptions, setPrescriptions,language,setLanguage }) => {
  //   **************** Prescription Form *******************
  const [medicines, setMedicines] = useState([]);
  const [isMedicine, setMedicine] = useState(false);

  // const [language, setLanguage] = useState("english");

  const [formData, setFormData] = useState({
    medicineType:'tablet',
    medicineName: "",
    totalQuantity: 0,
    morning: 0,
    afternoon: 0,
    night: 0,
    foodRoutine: "",
    day: 0,
    note:'',
  });

  const calculateTotalQuantity = ({ morning, afternoon, night, day }) => {
  const m = parseFloat(morning) || 0;
  const a = parseFloat(afternoon) || 0;
  const n = parseFloat(night) || 0;
  const d = parseFloat(day) || 0;
  return Math.ceil((m + a + n) * d);
};

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value, // keep as string, parse in calc
      };
      if (
        updated.medicineType === "tablet" &&
        ["morning", "afternoon", "night", "day"].includes(name)
      ) {
        return {
          ...updated,
          totalQuantity: calculateTotalQuantity(updated),
        };
      }

      if (
        updated.medicineType === "syrup" &&
        ["morning", "afternoon", "night", "day"].includes(name)
      ) {
        return {
          ...updated,
          totalQuantity: 1,
        };
      }

      // otherwise, just update value without recalculating
      return updated;
    });
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    // Reset foodRoutine since previously selected value was in a different language
    setFormData((prev) => ({
      ...prev,
      foodRoutine: "",
    }));
  };

  const handleMedicineInputChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      medicineName: value,
    }));
    setMedicine(true);
  };

  const handleMedicineSelect = (medicine) => {
    setFormData((prev) => ({
      ...prev,
      medicineName: medicine,
    }));
    setMedicine(false); // Close dropdown on selection
  };

  const formatDosage = (val, label) => {
  const n = parseFloat(val);
  if (!n) return null;

  // If integer → return as is
  if (Number.isInteger(n)) return `${n} ${label}`;

  // If float → convert to ratio
  return `${convertToRatio(n)} ${label}`;
};

  const handleAddPrescription = () => {
    const {
      medicineType,
      medicineName,
      morning,
      afternoon,
      night,
      day,
      totalQuantity,
      foodRoutine,
      note
    } = formData;

    if (medicineType === "") {
      return toast.error("Please enter medicine type");
    }
    if (medicineName === "") {
      return toast.error("Please enter medicine");
    }
    if (totalQuantity === "" || totalQuantity < 0) {
      return toast.error("Please enter totalQuantity");
    }

    if (foodRoutine === "") {
      return toast.error("Please select a food routine");
    }
    if (day === "" || day <= 0) {
      return toast.error("Please enter a valid number of days");
    }

    const t = TRANSLATIONS[language];
    const frequency = [];

    if(medicineType === 'tablet'){
        if (morning) frequency.push(formatDosage(morning, t.morning));
        if (afternoon) frequency.push(formatDosage(afternoon, t.afternoon));
        if (night) frequency.push(formatDosage(night, t.night));
    }else if(medicineType === 'syrup'){
        if (morning) frequency.push(`${morning} ${t.ml} ${t.morning}`);
        if (afternoon) frequency.push(`${afternoon} ${t.ml} ${t.afternoon}`);
        if (night) frequency.push(`${night} ${t.ml} ${t.night}`);
    }else if(medicineType === 'injection'){
        if (morning) frequency.push(`${morning} ${t.morning}`);
        if (afternoon) frequency.push(`${afternoon} ${t.afternoon}`);
        if (night) frequency.push(`${night} ${t.night}`);
    }else{
        if(note) frequency.push(`${note}`)
    }


    const newPrescription = {
      no: prescriptions.length + 1,
      medicineType:medicineType,
      medicine: medicineName,
      dosage: `${frequency.join(", ")} (${foodRoutine})`,
      duration: `${day} ${t.days}`,
      totalQuantity : `(${t.tot} : ${totalQuantity}  ${t[medicineType]})`
    };

    // Update prescriptions state
    setPrescriptions([...prescriptions, newPrescription]);

    setFormData({
        medicineType: 'tablet',
        medicineName:'',
        morning:0,
        afternoon:0,
        night:0,
        foodRoutine:'',
        day:0,
        totalQuantity:0,
        note:''
    })
  };

  //delete prescription
  const handleDeletePrescription = (index) => {
    const updatedPrescriptions = prescriptions.filter((_, i) => i !== index);
    setPrescriptions(updatedPrescriptions);
  };


  const {data}=useFetch(`/api/medicines/`,{
    params:{
      searchTerm:formData.medicineName
    }
  },[formData.medicineName])

  useEffect(()=>{
    if(data?.medicines){
      setMedicines(data?.medicines);
    }
  },[data])

  // Current language's translation set (used for dropdown labels)
  const t = TRANSLATIONS[language];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-start gap-3 mt-6 bg-[#f6f6f6] p-2 pb-2 rounded-lg shadow-sm ">

        <p className="hidden lg:block"></p>
        <p className="text-violet-800 font-semibold text-start md:text-right ">Prescription Language:</p>
        <div className="space-y-2">
          <select
            name="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="outline-none p-2 bg-violet-800 border border-violet-900 text-white rounded-md w-full"
          >
            <option value="en">English</option>
            <option value="mr">Marathi</option>
            <option value="hi">Hindi</option>
          </select>
        </div>

         {/* Medicine Type */}
        <div className="space-y-2">
          <p className="text-[#343C6A] font-semibold">Medicine Type</p>
          <select
            name="medicineType"
            value={formData.medicineType}
            onChange={handleChange}
            className="outline-none p-2 bg-white border border-gray-300 rounded-md w-full"
          >
            <option value="">{t.selectType}</option>
            <option value="tablet">{t.tablet}</option>
            <option value="syrup">{t.syrup}</option>
            <option value="injection">{t.injection}</option>
            <option value="other">{t.other}</option>
          </select>
        </div>

        <div className="space-y-2 relative">
          {/* Medicine Name */}
          <p className="text-[#343C6A] font-semibold">Medicine Name</p>
          <input
            type="text"
            placeholder="Enter name"
            name="medicineName"
            value={formData.medicineName}
            // onChange={(e) => setMedicineName(e.target.value)}
            onChange={handleMedicineInputChange}
            className="p-2 outline-none  bg-white border border-gray-300 rounded-md w-full"
          />
          {isMedicine && formData.medicineName !== "" && (
            <div
              className="max-h-32 h-auto bg-white  rounded-sm absolute w-full z-20 overflow-y-auto border border-gray-400"
              style={{ scrollbarWidth: "none" }}
            >
              {medicines &&
                medicines.length > 0 &&
                medicines.map((medicine) => (
                  <p
                    onClick={() => handleMedicineSelect(medicine.medicinename)}
                    className="p-1 font-semibold hover:bg-[#f2e2ff] text-[14px] pl-2  border-b border-[#E7E1E1] cursor-pointer"
                  >
                    {medicine.medicinename}
                  </p>
                ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-[#343C6A] font-semibold">Routine</p>
          <select
            name="foodRoutine"
            value={formData.foodRoutine}
            onChange={handleChange}
            className="outline-none p-2 bg-white border border-gray-300 rounded-md w-full"
          >
            <option value="">{t.selectRoutine}</option>
            <option value={t.before}>{t.before}</option>
            <option value={t.after}>{t.after}</option>
          </select>
        </div>


        <CustomInput
          type="number"
          min={0}
          label="Morning"
          name="morning"
          value={formData.morning}
          onChange={handleChange}
          placeholder={"Enter Morning Frequency"}
        />
        <CustomInput
          type="number"
          min={0}
          label="Afternoon"
          name="afternoon"
          value={formData.afternoon}
          onChange={handleChange}
          placeholder={"Enter Afternoon Frequency"}
        />
        <CustomInput
          type="number"
          min={0}
          label="Night"
          name="night"
          value={formData.night}
          onChange={handleChange}
          placeholder={"Enter Night Frequency"}
        />

        {/* Day */}
        <CustomInput
          type="number"
          min={0}
          label="Total Days"
          name="day"
          value={formData.day}
          onChange={handleChange}
          placeholder={"Enter Total Days"}
        />
        <CustomInput
          type="number"
          min={0}
          label="Total Quantity"
          name="totalQuantity"
          value={formData.totalQuantity}
          onChange={handleChange}
          placeholder={"Enter Total Quantity"}
        />

         {/* Note */}
        <div className="space-y-2">
          <p className="text-[#343C6A] font-semibold">Note</p>
          <input
            name="note"
            value={formData.note}
            onChange={handleChange}
            readOnly={formData.medicineType !== 'other'}
            placeholder="Enter note"
            className="outline-none p-2 bg-white border border-gray-300 rounded-md w-full"
          />          
        </div>

        <Button
          variant="outlined"
          onClick={handleAddPrescription}
          className="!col-span-1 sm:!col-start-2 lg:!mt-0 !mt-4 !bg-[#10972E] !border-none !capitalize !text-base  !text-white !flex !items-center !gap-2 !justify-center !w-full sm:!w-auto"
        >
          <FiPlus size={18} className="text-white" /> Add Medicine
        </Button>
      </div>

      {/* Desktop/large-tablet table view */}
      <div className="hidden lg:block w-[100%] h-[45%] mt-8 mx-auto bg-[#f6f6f6] rounded-lg shadow-sm p-2 pb-2">
        {/* Table Head */}
        <div
          className="grid grid-cols-5 h-[15%] items-center border-t font-semibold border-black border-b   px-2"
          style={{ gridTemplateColumns: "0.1fr 0.6fr 0.6fr 0.4fr 0.2fr" }}
        >
          <div className="text-center">Sr No.</div>
          <div className="pl-2">Medicine Name</div>
          <div className="pl-1 text-center">Dosage</div>
          <div className="pl-1 text-center">Duration</div>
          <div className="pl-1 text-center">Actions</div>
        </div>
        {/* Table Data */}
        <div
          className="h-[85%] overflow-y-auto  border-b border-black"
          style={{ scrollbarWidth: "none" }}
        >
          {prescriptions.map((item, index) => (
            <div
              key={item.no}
              className="grid grid-cols-4 border-b p-2  font-semibold "
              style={{
                gridTemplateColumns: "0.1fr 0.6fr 0.6fr 0.4fr 0.2fr",
              }}
            >
              <div className="text-center">{item.no}</div>
              <div className="pl-2">{item.medicine}</div>
              <div className="pl-1 text-center">
                {item.dosage.split("(")[0]} <br />{" "}
                <span className="">{"("}{item.dosage.split("(")[1]}</span>
              </div>
              <div className="pl-1 text-center">{item.duration} <br /> <span>{item.totalQuantity}</span></div>
              <div className="text-center flex justify-center items-center">
                <MdDeleteOutline
                  size={25}
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleDeletePrescription(index)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile/tablet card view */}
      <div className="lg:hidden w-full mt-8 bg-[#f6f6f6] rounded-lg shadow-sm p-2">
        <p className="font-semibold text-[#343C6A] px-1 pb-2">
          Added Medicines
        </p>

        {prescriptions.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-6">
            No medicines added yet.
          </p>
        ) : (
          <div
            className="space-y-2 max-h-96 overflow-y-auto pr-1"
            style={{ scrollbarWidth: "none" }}
          >
            {prescriptions.map((item, index) => (
              <div
                key={item.no}
                className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Sr No. {item.no}</p>
                    <p className="font-semibold text-[#343C6A] break-words">
                      {item.medicine}
                    </p>
                  </div>
                  <MdDeleteOutline
                    size={22}
                    className="text-red-500 cursor-pointer shrink-0"
                    onClick={() => handleDeletePrescription(index)}
                  />
                </div>

                <div className="mt-2 grid md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-500">Dosage</p>
                    <p className="font-medium break-words">
                      {item.dosage.split("(")[0]}
                    </p>
                    <p className="text-xs text-gray-600 break-words">
                      {"("}
                      {item.dosage.split("(")[1]}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="font-medium">{item.duration}</p>
                    <p className="text-xs text-gray-600">
                      {item.totalQuantity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AddMedicine;