import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { IoMdCloudUpload } from "react-icons/io";
import { useFetch } from "../../hooks/useFetch";
import apiClient from "../../api/apiClient";
import { Button } from "@mui/material";

const Scanner = () => {
  const [tab, setTab] = useState("Payment QR");
  const scannerRef = useRef(null);
  const [qrImg, setQrImg] = useState(null);
  const [qrContentType, setQrContentType] = useState(null);

  const openPDFInNewTab = () => {
    const blob = new Blob([new Uint8Array(qrImg?.data)], {
      type: qrContentType,
    });
    const url = window.URL.createObjectURL(blob);
    return url;
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if(file.size > 2*1024*1024){
      return toast.error('Please upload file smaller than 2 MB.')
    }
    try {
      const response = await apiClient.post(
        `/api/doctors/payment-qr`,
        { paymentQr:file },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if(response.status === 200) {
        setQrImg(response.data?.paymentQr);
        setQrContentType(response.data?.qrContentType);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occured");
    }
  };



  const {data}=useFetch('/api/doctors/payment-qr')
  useEffect(()=>{
    if(data){
       setQrImg(data?.paymentQr);
        setQrContentType(data?.qrContentType);
    }
  },[data])

  return (
    <>
      <div className=" flex justify-start items-center gap-4 mb-2">
        <Button
          onClick={() => setTab("Payment QR")}
          className={`${
            tab === "Payment QR" ? "!bg-[#521785] !text-white" : "!bg-[#f2e2ff] !text-[#343c6a]"
          } !p-2 !text-[#343c6a]  !text-[14px]  !capitalize`}
        >
          Payment QR
        </Button>
        <Button
          onClick={() => setTab("Patient Scanner")}
          className={`${
            tab === "Patient Scanner" ? "!bg-[#521785] !text-white" : "!bg-[#f2e2ff] !text-[#343c6a]"
          } !p-2 !text-[#343c6a] !text-[14px]  !capitalize`}
        >
          Patient Registration QR
        </Button>
      </div>
      <div className="h-[86%] bg-white shadow-md  rounded-lg">
      {tab === "Patient Scanner" && (
          <>
            <div className="h-[100%] p-1  flex items-center justify-center">
            <h1 className='font-semibold text-[24px] text-center text-gray-400'>This feature is available in the premium version.</h1>
            </div>
          </>
        )}

      
        {tab === "Payment QR" && (
          <>
            <div className="h-[10%] p-1  flex items-center justify-center">
              <div>
                <input
                  className="hidden"
                  type="file"
                  onChange={handleFileChange}
                  ref={scannerRef}
                  accept="image/*"
                />
                <Button
                  className="!w-[150px] !border !bg-[#f8f8f8] !shadow-sm !border-gray-300 !text-[#343c6a] !text-[14px] !flex !justify-center !items-center !gap-3 !p-1 !capitalize"
                  onClick={() => scannerRef.current.click()}
                >
                  <IoMdCloudUpload size={20} /> Upload QR
                </Button>
              </div>
            </div>
            <div className="h-[90%] flex justify-center items-center">
              {
                qrContentType && (
                  <img
                    src={openPDFInNewTab()}
                    alt="QrImage"
                    className="h-[70%] w-[30%] object-cover"
                  />
                )
              }
            </div>
          </>
        )}
      </div>


    </>
  );
};

export default Scanner;
