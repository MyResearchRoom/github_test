import React, { useRef } from 'react'
import useModalClose from '../hooks/useModalClose';
import { motion } from "framer-motion";
const PopUpModal = ({ title, closeModal, doneModal }) => {
    const modalRef=useRef();
    useModalClose(modalRef,closeModal)
  return (
     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      {/* Modal Box */}
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white shadow-2xl rounded-2xl w-[90%] max-w-md p-6 flex flex-col items-center text-center"
      >
        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>

        {/* Divider */}
        <div className="w-full h-[1px] bg-gray-200 mb-4"></div>

        {/* Buttons */}
        <div className="flex gap-4 w-full justify-center">
          <button
            onClick={closeModal}
            className="px-5 py-2 rounded-xl border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition-all font-medium shadow-sm w-[100px]"
          >
            Cancel
          </button>

          <button
            onClick={doneModal}
            className="px-5 py-2 rounded-xl bg-[#6C4AB6] text-white hover:bg-[#5a3a95] transition-all font-medium shadow-md w-[100px]"
          >
            Yes
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default PopUpModal
