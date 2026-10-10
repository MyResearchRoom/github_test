import React, { useEffect, useRef, useState } from "react";

import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";
import { IoTrashBin } from "react-icons/io5";

import { myImg } from "../../assets/Images/index";
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";
import PopUpModal from "../../commonComponent/PopUpModal";
import useModalClose from "../../hooks/useModalClose";
import { Button } from "@mui/material";
import { motion } from "framer-motion";
import { useFetch } from "../../hooks/useFetch";
import apiClient from "../../api/apiClient";
const MedicineModal = ({ openMedicineModal, setOpenMedicineModal }) => {
  const modalRef = useRef();
  const handleClose = () => {
    setOpenMedicineModal(false);
  };
  useModalClose(modalRef, handleClose);
  const [openModal, setOpenModal] = useState(false);
  const Options = ["Capsule", "Tablet", "Syrup", "Inhalers", "Drops"];
  const [medicineData, setMedicineData] = useState([]);
  const [medicineId, setMedicineId] = useState(null);
  const [isOpenPopUp, setOpenPopUp] = useState(false);

  const excelRef = useRef(null);

  const [formData, setFormData] = useState({
    medicinename: "",
    strength: "",
    form: "",
    category: "",
    brand: "",
  });

  const handleSelect = (option) => {
    setOpenModal(!openModal);
    setFormData((prev) => ({
      ...prev,
      form: option,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const { medicinename, strength, form, category, brand } = formData;
    if (!medicinename) {
      toast.error("Please Enter medicine name");
      return;
    }
    if (!strength) {
      toast.error("Please Enter medicine strength");
      return;
    }
    if (!form) {
      toast.error("Please Enter medicine form");
      return;
    }
    if (!category) {
      toast.error("Please Enter medicine category");
      return;
    }
    if (!brand) {
      toast.error("Please Enter medicine brand");
      return;
    }
    if (!medicineId) {
      try {
        const response = await apiClient.post(
          `/api/medicines/add`,
          formData
        );

        if (response.status === 200) {
          setMedicineData((prev) => [...prev, response.data?.medicine]);
          setFormData({
            medicinename: "",
            strength: "",
            form: "",
            category: "",
            brand: "",
          });
        }
      } catch (error) {
        toast.error(error?.response?.data?.error || "An error occured");
      }
    } else {
      try {
        const response = await apiClient.put(
          `/api/medicines/${medicineId}`,
          formData
        );

        if (response.status === 200) {
          const updatedMedicine = response.data?.medicine; // Assuming the updated medicine is returned in the response
          setMedicineData((prevData) =>
            prevData.map((item) =>
              item.id === medicineId ? updatedMedicine : item
            )
          );
          setMedicineId(null);
          setFormData({
            medicinename: "",
            strength: "",
            form: "",
            category: "",
            brand: "",
          });
          toast.success("Medicine updated successfully");
        } else {
          toast.error("Failed to update medicine");
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.error ||
            "An error occurred while updating the medicine"
        );
      }
    }
  };

  const handleEdit = (medicine) => {
    setFormData(medicine);
    setMedicineId(medicine.id);
  };

  const handleRemove = async () => {
    try {
      const response = await apiClient.delete(
        `/api/medicines/${medicineId}`,
      );

      if (response.status === 200) {
        toast.success("Medicine removed successfully");
        const data = medicineData.filter(
          (medicine) => medicine.id !== medicineId
        );
        setMedicineData(data);
        setMedicineId(null);
        setOpenPopUp(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occured");
    }
  };

  const RemoveModal = (id) => {
    setOpenPopUp(true);
    setMedicineId(id);
  };

  const { data, refetch } = useFetch("/api/medicines/");
  useEffect(() => {
    if (data?.medicines) {
      setMedicineData(data?.medicines);
    }
  }, [data]);

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("excelFile", file);

    try {
      const response = await apiClient.post(
        `/api/medicines/addBulkMedicines`,
        formData,{
          headers:{
            "Content-Type" : "multipart/form-data"
          }
        }
      );

      toast.success(response.data.message);
      refetch(); // refresh list
    } catch (error) {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.response?.data?.details) {
        toast.error(error.response.data.details);
      } else {
        toast.error("Failed to upload Excel. Please check column names!");
      }
    }
  };

  useEffect(() => {
    if (openMedicineModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // Cleanup when modal unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openMedicineModal]);

  return (
    <>
      {isOpenPopUp && (
        <PopUpModal
          closeModal={() => setOpenPopUp(false)}
          title="Are  you want to remove medicine ?"
          doneModal={handleRemove}
        />
      )}
      <div
        // ref={modalRef}

        className="fixed inset-0 bg-black/50 flex justify-center items-center z-40"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl bg-white shadow-2xl w-[80%] h-[90%] relative flex flex-col items-center"
        >
          <div className="w-full mb-2  h-[8%] flex flex-col justify-start items-center rounded-t-2xl bg-[#521785] ">
            <h1 className="text-white xl:text-xl text-base relative w-full font-semibold  p-2 text-left pl-[2%] rounded-md">
              Medicine List
              <RxCross2
                size={24}
                // color="#343c6a"
                onClick={() => setOpenMedicineModal(!openMedicineModal)}
                className="cursor-pointer absolute text-white transform top-1/2  -translate-y-1/2 right-4"
              />
            </h1>
          </div>

          <div
            className="cursor-pointer flex items-center ml-auto mr-4  gap-2 text-green-600"
            onClick={() => excelRef.current.click()}
          >
            <img
              src={myImg.excelIcon}
              alt="Upload Excel"
              className="w-12 h-12"
            />
            <input
              type="file"
              accept=".xlsx, .xls"
              ref={excelRef}
              className="hidden"
              onChange={handleExcelUpload}
            />
          </div>
          <div className="flex items-center ml-auto mr-5 mb-5">
            <p className="text-xs  text-red-500">
              (Note - To import medicines, upload an Excel file)
            </p>
          </div>

          <div className="w-[100%] grid grid-cols-5 gap-3 py-1 px-4 text-[#343c6a] mb-3 h-[18%] ">
            <div>
              <p className="text-center font-semibold xl:text-base text-sm w-full mb-2">
                Medicine Name
              </p>
              <input
                className="outline-none border w-full bg-[#F6F6F7] border-[#E7E1E1] p-1 rounded-sm"
                placeholder="Enter Medicine Name"
                name="medicinename"
                value={formData.medicinename}
                onChange={handleChange}
              />
            </div>

            <div>
              <p className="text-center font-semibold xl:text-base text-sm w-full mb-2">
                Strength (Mg)
              </p>
              <input
                className="outline-none border w-full bg-[#F6F6F7] border-[#E7E1E1] p-1 rounded-sm"
                placeholder="Enter Strength"
                name="strength"
                value={formData.strength}
                onChange={handleChange}
              />
            </div>

            <div className="text-[#343c6a]">
              <p className="text-center font-semibold xl:text-base text-sm w-full mb-2 ">
                Form
              </p>
              <div className="relative">
                <p
                  onClick={() => setOpenModal(!openModal)}
                  className={`bg-[#F6F6F7] rounded-sm border border-[#E7E1E1] p-2 flex justify-around text-center font-semibold text-[14px]`}
                >
                  {formData.form !== "" ? formData.form : "Form"}{" "}
                  {openModal ? (
                    <MdKeyboardArrowUp size={20} color="#343c6a" />
                  ) : (
                    <MdKeyboardArrowDown size={20} color="#343c6a" />
                  )}
                </p>
                {openModal && (
                  <div
                    className={`z-10 absolute top-10 w-[100%] bg-[#F6F6F7] cursor-pointer border border-[#E7E1E1] rounded-sm`}
                  >
                    {Options.map((option) => (
                      <p
                        onClick={() => handleSelect(option)}
                        className="p-1 text-center font-semibold hover:bg-[#f2e2ff] text-[14px] border-b border-[#E7E1E1]"
                      >
                        {option}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className="text-center font-semibold xl:text-base text-sm w-full mb-2">
                Category
              </p>
              <input
                className="outline-none border w-full bg-[#F6F6F7] border-[#E7E1E1] p-1 rounded-sm"
                placeholder="Enter Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
            </div>

            <div>
              <p className="text-center font-semibold xl:text-base text-sm w-full mb-2">
                Brand
              </p>
              <input
                className="outline-none border w-full bg-[#F6F6F7] border-[#E7E1E1] p-1 rounded-sm"
                placeholder="Enter Brand Name"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
              />
            </div>
          </div>
          <Button
            variant="outlined"
            onClick={handleSubmit}
            className="!btn_bg  !text-white !border-none !capitalize !mb-2"
          >
            {medicineId ? "Update" : "Add"} Medicine
          </Button>

          <div
            className="w-full relative h-[60%]  overflow-y-auto px-4 "
            style={{ scrollbarWidth: "none" }}
          >
            <table className="w-full">
              <thead className="bg-[#F6F6F7] w-full  border-[#E7E1E1] sticky top-0 ">
                <tr className="text-[#343c6a] text-[14px] font-semibold h-10">
                  <th className="pl-1 text-left w-[5%]">Sr No.</th>
                  <th className="pl-1 text-left w-[30%]">Medicine Name</th>
                  <th className="pl-1 text-left w-[10%]">Strength</th>
                  <th className="pl-1 text-left w-[10%]">Form</th>
                  <th className="pl-1 text-left w-[15%]">Category</th>
                  <th className="pl-1 text-left w-[20%]">Innovator Brand</th>
                  <th className="pl-1 text-left w-[10%]">Action</th>
                </tr>
              </thead>

              <tbody>
                {medicineData.map((medicine, index) => (
                  <tr
                    key={index}
                    className="text-[14px] text-[#343c6a] border-b border-l border-r h-10"
                  >
                    <td className="pl-1 text-center w-[5%]">{index + 1}</td>
                    <td className="pl-1 text-left w-[30%]">
                      {medicine.medicinename}
                    </td>
                    <td className="pl-1 text-left w-[10%]">
                      {medicine.strength}
                    </td>
                    <td className="pl-1 text-left w-[10%]">{medicine.form}</td>
                    <td className="pl-1 text-left w-[15%]">
                      {medicine.category}
                    </td>
                    <td className="pl-1 text-left w-[20%]">{medicine.brand}</td>
                    <td className="pl-1 text-left w-[10%]  ">
                      <p className="flex w-full gap-3 items-center ">
                        <BiEditAlt
                          size={16}
                          color="#343c6a"
                          onClick={() => handleEdit(medicine)}
                          className="cursor-pointer"
                        />{" "}
                        <IoTrashBin
                          size={16}
                          color="red"
                          onClick={() => RemoveModal(medicine.id)}
                          className="cursor-pointer"
                        />
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        {/* </div> */}
      </div>
    </>
  );
};

export default MedicineModal;
