import React, { useEffect, useRef, useState } from "react";
import { Camera, FileText, Upload, X } from "lucide-react";

const PRIMARY = "#521785";

const AddICUPatientDocumentModal = ({
  isOpen,
  onClose,
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

  useEffect(() => {
    if (!isOpen) {
      stopCamera();

      setDocumentName("");
      setDocumentType("MEDICAL");
      setSelectedFile(null);
      setPreviewUrl("");
      setShowCamera(false);
      setCameraError("");
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
      setCameraError("");
      alert("File size must be less than 10 MB");
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
        setCameraError("Camera is not supported by this browser.");
        return;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
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

      setCameraError("Unable to access camera. Please allow camera permission.");
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

    context.drawImage(video, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const file = new File([blob], `icu-patient-document-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });

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

  const handleSubmit = () => {
    if (!selectedFile) return;
    if (!documentName.trim()) return;

    onSuccess?.({
      documentName: documentName.trim(),
      documentType,
      file: selectedFile,
      previewUrl,
    });

    onClose();
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
            <h2 className="text-lg font-semibold">Add Patient Document</h2>
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
              placeholder="e.g. ICU Consent Form, DNR, Family Communication"
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
              <option value="ICU-DOC">ICU Document</option>
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
                <p className="text-sm text-red-500 mt-2">{cameraError}</p>
              )}

              <div className="flex justify-center gap-3 mt-4">
                <button
                  type="button"
                  onClick={handleCapturePhoto}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-medium"
                  style={{ backgroundColor: PRIMARY }}
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
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center hover:border-[#521785] hover:bg-purple-50 transition"
                  >
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                      <Upload size={22} style={{ color: PRIMARY }} />
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
                      <Camera size={22} style={{ color: PRIMARY }} />
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
                      {selectedFile.type.startsWith("image/") ? (
                        <img
                          src={previewUrl}
                          alt="Document preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FileText size={30} className="text-gray-500" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {selectedFile.name}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>

                      <div className="flex gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
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
                  {selectedFile.type.startsWith("image/") && (
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
              <canvas ref={canvasRef} className="hidden" />
            </>
          )}

          {/* Camera error */}
          {!showCamera && cameraError && (
            <div className="text-sm text-red-500 mb-3">{cameraError}</div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedFile || !documentName.trim()}
              className="px-5 py-2.5 rounded-lg text-white text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
              style={{
                backgroundColor:
                  !selectedFile || !documentName.trim() ? undefined : PRIMARY,
              }}
            >
              <Upload size={16} />
              Add Document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddICUPatientDocumentModal;