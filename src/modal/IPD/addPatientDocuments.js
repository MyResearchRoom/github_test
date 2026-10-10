import React, { useEffect, useRef, useState } from "react";
import { Camera, FileText, Image, Upload, X, RotateCcw } from "lucide-react";
import { toast } from "react-toastify";
import ipdService from "../../services/ipdService";
import { patientService } from "../../services/patientService";

const PRIMARY = "#521785";

const AddPatientDocumentModal = ({
  isOpen,
  onClose,
  patientId,
  admissionId,
  onSuccess,
  selectedDocument,
}) => {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("MEDICAL");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();

      setDocumentName("");
      setDocumentType("MEDICAL");
      setSelectedFile(null);
      setPreviewUrl("");
      setShowCamera(false);
      setCameraError("");
      setLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && selectedDocument) {
      setDocumentName(selectedDocument.documentName || "");
      setDocumentType(selectedDocument.documentType || "MEDICAL");
    }
  }, [isOpen, selectedDocument]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);


  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10 MB");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Automatically use file name
    if (!documentName) {
      const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
      setDocumentName(nameWithoutExtension);
    }

    // Reset input so same file can be selected again
    event.target.value = "";
  };

  const handleOpenCamera = async () => {
    try {
      setCameraError("");

      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError(
          "Camera is not supported by this browser."
        );
        return;
      }

      const mediaStream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
          },
          audio: false,
        });

      setStream(mediaStream);
      setShowCamera(true);

      // Video element may not exist until state update
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      }, 100);
    } catch (error) {
      console.error("Camera Error:", error);

      setCameraError(
        "Unable to access camera. Please allow camera permission."
      );
    }
  };

  const handleCapturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    context.drawImage(
      video,
      0,
      0,
      width,
      height
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          toast.error("Failed to capture image");
          return;
        }

        const file = new File(
          [blob],
          `patient-document-${Date.now()}.jpg`,
          {
            type: "image/jpeg",
          }
        );

        setSelectedFile(file);

        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        if (!documentName) {
          setDocumentName("Patient Document");
        }

        stopCamera();
        setShowCamera(false);
      },
      "image/jpeg",
      0.9
    );
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setStream(null);
  };

 
  const handleCloseCamera = () => {
    stopCamera();
    setShowCamera(false);
  };

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl("");
  };
  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error("Please select or capture a document");
      return;
    }

    if (!documentName.trim()) {
      toast.error("Please enter document name");
      return;
    }

    if (!patientId) {
      toast.error("Patient ID is required");
      return;
    }

    if (!admissionId) {
      toast.error("Admission ID is required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("documentName", documentName.trim());
      formData.append("documentType", documentType);
      formData.append("document", selectedFile);

      const response = await patientService.addPatientDocument(formData,patientId,admissionId);

      if (response?.success) {
        toast.success(
          response.message ||
            "Patient document uploaded successfully"
        );

        onSuccess?.();

        onClose();
      } else {
        toast.error(
          response?.message ||
            "Failed to upload patient document"
        );
      }
    } catch (error) {
      console.error("Upload Document Error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to upload patient document"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl overflow-hidden">

        {/* Header */}
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ backgroundColor: PRIMARY }}
        >
          <div className="flex items-center gap-2 text-white">
            <FileText size={20} />
            <h2 className="text-lg font-semibold">
              Add Patient Document
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-white hover:bg-white/10 rounded-full p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">

          {/* Document Name */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Document Name
            </label>

            <input
              type="text"
              value={documentName}
              disabled={!!selectedDocument}
              onChange={(e) => {
                if (!selectedDocument) {
                  setDocumentName(e.target.value);
                }
              }}
              readOnly={!!selectedDocument}
              placeholder="e.g. Aadhaar Card, Insurance, Report"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#521785]"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Document Type
            </label>

            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              disabled={!!selectedDocument}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#521785] disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="MEDICAL">Medical</option>
              <option value="MLC-DOC">MLC Document</option>
              <option value="BIRTH_CERTIFICATE">BIRTH CERTIFICATE</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Camera */}
          {showCamera ? (
            <div className="mb-5">

              <div className="relative bg-black rounded-lg overflow-hidden">

                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full max-h-[350px] object-contain"
                />

                {/* Camera frame */}
                <div className="absolute inset-5 border-2 border-white/70 rounded-lg pointer-events-none" />
              </div>

              {cameraError && (
                <p className="text-sm text-red-500 mt-2">
                  {cameraError}
                </p>
              )}

              <div className="flex justify-center gap-3 mt-4">

                <button
                  type="button"
                  onClick={handleCapturePhoto}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-medium"
                  style={{
                    backgroundColor: PRIMARY,
                  }}
                >
                  <Camera size={18} />
                  Capture
                </button>

                <button
                  type="button"
                  onClick={handleCloseCamera}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm"
                >
                  Cancel
                </button>

              </div>
            </div>
          ) : (
            <>
              {/* Upload options */}
              {!selectedFile && (
                <div className="grid grid-cols-2 gap-3 mb-5">

                  {/* Select File */}
                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center hover:border-[#521785] hover:bg-purple-50 transition"
                  >
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                      <Upload
                        size={22}
                        style={{ color: PRIMARY }}
                      />
                    </div>

                    <span className="text-sm font-semibold text-gray-700">
                      Select File
                    </span>

                    <span className="text-xs text-gray-400 mt-1 text-center">
                      Choose from device
                    </span>
                  </button>

                  {/* Camera */}
                  <button
                    type="button"
                    onClick={handleOpenCamera}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center hover:border-[#521785] hover:bg-purple-50 transition"
                  >
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                      <Camera
                        size={22}
                        style={{ color: PRIMARY }}
                      />
                    </div>

                    <span className="text-sm font-semibold text-gray-700">
                      Take Photo
                    </span>

                    <span className="text-xs text-gray-400 mt-1 text-center">
                      Use device camera
                    </span>
                  </button>

                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileSelect}
              />

              {/* Selected File */}
              {selectedFile && (
                <div className="border border-gray-200 rounded-xl p-3">

                  <div className="flex items-start gap-3">

                    {/* Preview */}
                    <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">

                      {selectedFile.type.startsWith(
                        "image/"
                      ) ? (
                        <img
                          src={previewUrl}
                          alt="Document preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FileText
                          size={30}
                          className="text-gray-500"
                        />
                      )}

                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">

                      <p className="text-sm font-medium text-gray-700 truncate">
                        {selectedFile.name}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {(
                          selectedFile.size /
                          (1024 * 1024)
                        ).toFixed(2)}{" "}
                        MB
                      </p>

                      <div className="flex gap-2 mt-2">

                        <button
                          type="button"
                          onClick={() =>
                            fileInputRef.current?.click()
                          }
                          className="text-xs text-[#521785] font-medium"
                        >
                          Change
                        </button>

                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="text-xs text-red-500 font-medium"
                        >
                          Remove
                        </button>

                      </div>
                    </div>
                  </div>

                  {/* Image preview */}
                  {selectedFile.type.startsWith(
                    "image/"
                  ) && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full max-h-[250px] object-contain bg-gray-50"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Hidden canvas */}
              <canvas
                ref={canvasRef}
                className="hidden"
              />
            </>
          )}

          {/* Camera error */}
          {!showCamera && cameraError && (
            <div className="text-sm text-red-500 mb-3">
              {cameraError}
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !selectedFile}
              className="px-5 py-2.5 rounded-lg text-white text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
              style={{
                backgroundColor:
                  loading || !selectedFile
                    ? undefined
                    : PRIMARY,
              }}
            >
              {loading ? (
                <>
                  <RotateCcw
                    size={16}
                    className="animate-spin"
                  />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Upload Document
                </>
              )}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPatientDocumentModal;