import React, { useEffect, useRef, useState } from "react";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md";
import { toast } from "react-toastify";
const CustomSelect = ({ options, className, onChange, value, selectedDate }) => {
  const [openModal, setOpenModal] = useState(false);
  const [customSelect, setCustomSelect] = useState(null);
  const selectRef=useRef(null);

  const [date, setDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });


  const handleSelect = (option) => {
    setOpenModal(!openModal);
    setCustomSelect(option);
    if (onChange && typeof onChange === "function") {
      onChange(option); // Call the onChange function if it is defined
    }
  };

  const toggleModal = () => {
    if (selectedDate === date) {
      setOpenModal(!openModal); // Only open the modal if today is selected
    } else {
      // If it's not today's date, show the error message via toast
      toast.error("You can only select options for today's date.");
    }
  };

  useEffect(()=>{
    const handleClose=(e)=>{
      if(selectRef.current && !selectRef.current.contains(e.target)){
        setOpenModal(false)
      }
    }
    if(openModal){
      document.addEventListener('mousedown',handleClose);
    }
    return ()=>{
      document.addEventListener('mousedown',handleClose);
    }
  },[openModal])
  return (
    <div
      className={`relative w-full cursor-pointer font-semibold text-[#343C6A] ${className}`}
    >
      <div className="w-full">
        <p
          onClick={toggleModal}
          className={` w-full flex justify-around items-center ${value ? "bg-green-100 text-green-700" : "bg-[#F2E2FF]"
            } p-1 text-center ${openModal
              ? "rounded-tl-md rounded-tr-md border border-[#8958b2]"
              : "rounded-md"
            }`}
        >
          <span>{value ? value : "select"} </span> {openModal ? <MdOutlineKeyboardArrowUp className={`${value ? 'text-green-700' : 'text-[#343c6a]'}`} /> : <MdOutlineKeyboardArrowDown className={`${value ? 'text-green-700' : 'text-[#343c6a]'}`} />}
        </p>
      </div>
      {openModal && (
        <div
          ref={selectRef}
          className={`z-10 absolute top-8 w-full bg-[#f2e2ff] ${openModal
            ? "rounded-bl-md rounded-br-md border-r border-b border-l border-[#8958b2]"
            : "border-none"
            }`}
        >
          {options.map((data) => (
            <p
              onClick={() => handleSelect(data)}
              className="text-center hover:bg-[#e0c3f7] hover:rounded-bl-md hover:rounded-br-md"
            >
              {data}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
