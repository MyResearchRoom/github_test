import React, { useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";

import "../../index.css";
import { FcFolder } from "react-icons/fc";
import { IoCamera } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import useModalClose from "../../hooks/useModalClose";
import { Button } from "@mui/material";
import { motion } from "framer-motion";

const UploadFileModal = React.memo(
  ({ appointmentId, openFileModal, setOpenFileModal, updateDocument, doc, docType }) => {
      const modalRef=useRef();
      const handleClose=()=>{
        setOpenFileModal(false);
      }
      useModalClose(modalRef,handleClose)
    const uploadRef = useRef(null);
    const videoRef = useRef(null);
    const [noImage, setNoImage] = useState(true);
    const [inputFile, setInputFile] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [openCamera, setOpenCamera] = useState(false);
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      setCapturedImage(null);
      if (file) {
        setUploadedImage(null)
        console.log("Selected file:", file);
        setInputFile(file);
      }
    };

    // Start the camera
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }, // Use "environment" for back camera
        });
        videoRef.current.srcObject = stream;
      } catch (error) {
        alert("Unable to access the camera. Please check permissions.");
      }
    };

    const captureImage = () => {
      const canvas = document.createElement("canvas");
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      setInputFile(null);
      setCapturedImage(canvas.toDataURL("image/png"));
      stopCamera();
    };

    // Stop the camera
    const stopCamera = () => {
      const stream = videoRef.current?.srcObject;
      const tracks = stream?.getTracks();
      tracks?.forEach((track) => track.stop());
    };

    const handleCamera = () => {
      if (openCamera) {
        captureImage();
        setOpenCamera(false);
      } else if (capturedImage) {
        setCapturedImage(null);
        startCamera();
      } else {
        setInputFile(null);
        setNoImage(false)
        setUploadedImage(null)
        setOpenCamera(true);
        startCamera();
      }
    };



    const handleUpload = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/appointments/prescription/${appointmentId}`,
          { prescription: inputFile, base64Image: capturedImage },
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 200) {
          toast.success("File uploaded successfully");
          updateDocument(appointmentId, response.data.document, response.data.documentType);
          setOpenFileModal(false);

        }
      } catch (error) {
        toast.error(error?.response?.data?.error || "Failed to upload");
      }
    };

    const [uploadedImage, setUploadedImage] = useState(doc ? doc : null);



      useEffect(()=>{
      if(openFileModal){
        document.body.style.overflow ="hidden";
      }
      else{
        document.body.style.overflow ="auto";
        }
         // Cleanup when modal unmounts
      return () => {
        document.body.style.overflow = "auto";
      };
    },[openFileModal])



    return (
      <div  className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <motion.div  ref={modalRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }} className="rounded-2xl bg-[#f6f6f7] shadow-2xl lg:w-[60%] w-[80%] h-[90%] relative flex flex-col items-center justify-center object-cover">
          <div className="p-1 flex w-full justify-end absolute top-0 right-0">
            <RxCross2
              size={20}
              color="#343c6a"
              onClick={() => {
                stopCamera();
                setOpenFileModal(!openFileModal);
              }}
              className="cursor-pointer"
            />
          </div>

          <div className="h-[80%] w-[90%] bg-[#e3dfdf] border-2 rounded-md flex flex-col justify-center items-center border-[#b986fb] mb-2">
            {
              uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt="Captured"
                  className="w-[70%] h-full object-cover "
                />
              ) : (
                <>
                  {capturedImage ? (
                    <img
                      src={capturedImage}
                      alt="Captured"
                      className="w-[70%] h-full object-cover "
                    />
                  ) : inputFile ? (
                    <img
                      src={URL.createObjectURL(inputFile)} // Display the selected file
                      alt="Uploaded"
                      className="w-[50%] h-full object-cover "
                    />
                  ) : (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover rounded-md"
                    />
                  )}
                </>
              )
            }
          </div>

          <div className="w-[90%] flex gap-4 justify-center relative  items-center">
            <div
              onClick={() => uploadRef.current.click()}
              className="float-left absolute left-0"
            >
              <input
                type="file"
                ref={uploadRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <FcFolder
                size={34}
                // color="#343c6a"
                className="cursor-pointer"
              />
            </div>

            {/* ************* Open back Camera of device ************* */}
            <div className="absolute left-12">
              <label
                onClick={handleCamera}
                className="bg-black flex justify-center items-center h-[30px] w-[30px]"
              >
                <IoCamera size={28} color="white" className="cursor-pointer" />
              </label>
            </div>
            <center>
              <Button
               variant="outlined"
                onClick={handleUpload}
                className="!btn_bg !border-none !capitalize font-semibold  !text-white !w-[200px]"
              >
                Upload
              </Button>
            </center>
          </div>
        </motion.div>
      </div>
    );
  }
);

export default UploadFileModal;
