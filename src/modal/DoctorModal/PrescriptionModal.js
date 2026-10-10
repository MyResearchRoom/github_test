import React, { useEffect, useRef, useState } from "react";
import { FiPlus } from "react-icons/fi";
import PrintPrescription from "./PrintPrescription";
import { MdDeleteOutline } from "react-icons/md";
import { toast } from "react-toastify";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";
import useModalClose from "../../hooks/useModalClose";

const PrescriptionModal = ({
  onClose,
  prescription,
  appointment,
  handleSubmitPrescription,
}) => {
    const modalRef=useRef();
    useModalClose(modalRef,onClose)
  const [medicineName, setMedicineName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [morning, setMorning] = useState(false);
  const [afternoon, setAfternoon] = useState(false);
  const [night, setNight] = useState(false);
  const [printModal, setPrintModal] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [isMedicine, setMedicine] = useState(false);
  const [foodRoutine, setFoodRoutine] = useState("");
  const [day, setDay] = useState("");

  const [prescriptions, setPrescriptions] = useState(
    prescription ? prescription : []
  );

  const handleAddPrescription = () => {

    if (medicineName === '') {
      return toast.error('Please enter medicine')
    }
    if (quantity === '' || quantity < 0) {
      return toast.error('Please enter quantity')
    }
    if (!morning && !afternoon && !night) {
      return toast.error("Please select at least one frequency (Morning, Afternoon, Night)");
    }
    if (foodRoutine === "") {
      return toast.error("Please select a food routine");
    }
    if (day === "" || day <= 0) {
      return toast.error("Please enter a valid number of days");
    }

    const frequency = [];
    if (morning) frequency.push(`${quantity} Morning`);
    if (afternoon) frequency.push(`${quantity} Afternoon`);
    if (night) frequency.push(`${quantity} Night`);

    const newPrescription = {
      no: prescriptions.length + 1,
      medicine: medicineName,
      dosage: `${frequency.join(", ")} (${foodRoutine})`,
      duration: `${day} days`,
    };

    // Update prescriptions state
    setPrescriptions([...prescriptions, newPrescription]);

    // Clear input fields
    setMedicineName("");
    setQuantity("");
    setMorning(false);
    setAfternoon(false);
    setNight(false);
    setFoodRoutine("");

    setDay("");
  };

  const handlePrint = async () => {
    await handleSubmitPrescription(prescriptions);
    setPrintModal(!printModal);
  };

  //delete prescription
  const handleDeletePrescription = (index) => {
    const updatedPrescriptions = prescriptions.filter((_, i) => i !== index);
    setPrescriptions(updatedPrescriptions);
  };

  const handleMedicineInputChange = (e) => {
    const value = e.target.value;
    setMedicineName(value);
    setMedicine(true);
  };

  const handleMedicineSelect = (medicine) => {
    setMedicineName(medicine);
    setMedicine(false); // Close dropdown on selection
  };

  const getMedicines = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/medicines/?searchTerm=${medicineName}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setMedicines(response.data?.medicines);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occured");
    }
  };


  useEffect(() => {
    getMedicines();
  }, [medicineName]);

  return (
    <>
      {printModal && (
        <PrintPrescription
          prescriptions={prescriptions}
          appointment={appointment}
          onClose={() => setPrintModal(!printModal)}
        />
      )}
      <div ref={modalRef} className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-[90%] h-[90vh] bg-white rounded-lg">
          <div className="flex items-center mt-2">
            <h1 className="ml-[45%] text-xl font-semibold">
              Patient Prescription
            </h1>
            <RxCross2
              size={24}
              className="ml-auto mr-2 cursor-pointer"
              onClick={onClose}
            />
          </div>

          <div className="flex flex-wrap md:flex-row items-center justify-evenly mt-6">
            <div className="space-y-2 relative">
              {/* Medicine Name */}
              <p className="text-[#343C6A] text-center font-semibold">
                Medicine Name
              </p>
              <input
                type="text"
                placeholder="Enter name"
                value={medicineName}
                // onChange={(e) => setMedicineName(e.target.value)}
                onChange={handleMedicineInputChange}
                className="p-2 outline-none  bg-gray-100 border border-gray-300 rounded-md"
              />
              {isMedicine && medicineName !== "" && (
                <div
                  className="h-24 bg-white border rounded-sm absolute w-full z-20 overflow-y-auto"
                  style={{ scrollbarWidth: "none" }}
                >
                  {medicines &&
                    medicines.length > 0 &&
                    medicines.map((medicine) => (
                      <p
                        onClick={() => handleMedicineSelect(medicine.name)}
                        className="p-1 font-semibold hover:bg-[#f2e2ff] text-[14px] pl-2  border-b border-[#E7E1E1]"
                      >
                        {medicine.name}
                      </p>
                    ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-[#343C6A] text-center font-semibold">
                Quantity
              </p>
              <input
                type="number"
                placeholder="Enter Qty"
                value={quantity}

                onChange={(e) => {
                  const value = e.target.value;
                  if (value >= 0) {
                    setQuantity(e.target.value)
                  } else {
                    toast.error("Quantity cannot be negative");
                  }
                }}
                // onChange={(e)=>setQuantity(e.target.value)}
                className="p-2 outline-none  bg-gray-100 border border-gray-300 rounded-md"
              />
            </div>

            {/* Frequency */}
            <div className="space-y-2">
              <p className="text-[#343C6A] text-center font-semibold">
                Frequency
              </p>
              <div className="w-80 p-2 bg-white border border-gray-300 rounded-md">
                <div className="flex space-x-4  px-2">
                  {/* Morning */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={morning}
                      onChange={() => setMorning(!morning)}
                      className="w-4 h-4 rounded-full border-gray-300"
                    />
                    <label className="text-[#343C6A]">Morning</label>
                  </div>
                  {/* Afternoon */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={afternoon}
                      onChange={() => setAfternoon(!afternoon)}
                      className="w-4 h-4 rounded-full border-gray-300"
                    />
                    <label className="text-[#343C6A]">Afternoon</label>
                  </div>
                  {/* Night */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={night}
                      onChange={() => setNight(!night)}
                      className="w-4 h-4 rounded-full border-gray-300"
                    />
                    <label className="text-[#343C6A]">Night</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Routine */}
            <div className="space-y-2">
              <p className="text-[#343C6A] text-center font-semibold">
                Routine
              </p>
              <div className="w-52 p-2 bg-white border border-gray-300 rounded-md">
                <div className="flex space-x-4  px-2">
                  {/* Before */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="Before Food"
                      checked={foodRoutine === "Before Food"}
                      // onChange={() => setBeforeFood(!beforeFood)}
                      onChange={() => setFoodRoutine("Before Food")}
                      className="w-4 h-4 rounded-full border-gray-300"
                    />
                    <label className="text-[#343C6A]">Before</label>
                  </div>
                  {/* After */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="After Food"
                      checked={foodRoutine === "After Food"}
                      // onChange={() => setAfterFood(!afterFood)}
                      onChange={() => setFoodRoutine("After Food")}
                      className="w-4 h-4 rounded-full border-gray-300"
                    />
                    <label className="text-[#343C6A]">After</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Day */}
            <div className="space-y-2">
              <p className="text-[#343C6A] text-center font-semibold">Day</p>
              <input
                type="number"
                placeholder="Enter"
                value={day}
                // onChange={(e) => setDay(e.target.value)}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value >= 0) {
                    setDay(e.target.value)
                  } else {
                    toast.error("Days cannot be negative");
                  }
                }}
                className="w-16 p-2 outline-none text-center bg-gray-100 border border-gray-300 rounded-md"
              />
            </div>

            <button
              onClick={handleAddPrescription}
              className="w-10 p-2 mt-8 bg-[#10972E] rounded-lg flex items-center justify-center"
            >
              <FiPlus size={20} className="text-white" />
            </button>
          </div>

          {/* Table */}
          <div className="w-[95%] h-[45%] mt-12 mx-auto border-b border-black">
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
              className="h-[85%] overflow-y-auto"
              style={{ scrollbarWidth: "none" }}
            >
              {prescriptions.map((item, index) => (
                <div
                  key={item.no}
                  className="grid grid-cols-4 h-14 border-b p-2  font-semibold"
                  style={{
                    gridTemplateColumns: "0.1fr 0.6fr 0.6fr 0.4fr 0.2fr",
                  }}
                >
                  <div className="text-center">{item.no}</div>
                  <div className="pl-2">{item.medicine}</div>
                  <div className="pl-1 text-center">
                    {item.dosage.split("(")[0]} <br />{" "}
                    <span className="">{item.dosage.split("(")[1]}</span>
                  </div>
                  <div className="pl-1 text-center">{item.duration}</div>
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
          {/* Upload Button */}
          <button
            className="w-40 h-10 ml-[45%] mt-3 text-white btn_bg rounded-lg"
            onClick={() => handlePrint()}
          >
            Save & Print
          </button>
        </div>
      </div>
    </>
  );
};

export default PrescriptionModal;
