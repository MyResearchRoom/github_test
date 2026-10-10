import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  UserRound,
  Phone,
  Stethoscope,
  BedDouble,
  Calendar,
  FileText,
  Loader2,
  Tag,
} from "lucide-react";

import Button from "../../commonComponent/Button";
import AddSectionModal from "../../modal/IPD/AddSectionModal";
import { ipdService } from "../../services/ipdService";
import { downloadClinicalTimeline } from "../../utils/downloadClinicalTimeline";
import DeleteConfirmationModal from "../../modal/IPD/DeleteConfirmationModal";


import IPDPatientDocuments from "../../pages/IPD/IPDPatientDocuments";

import AddPatientDocumentModal from "../../modal/IPD/addPatientDocuments";
import IPDPatientVitals from "../../components/IPD/PatientDetails/IPDPatientVitals";
import IPDPatientIntakeOutput from "../../components/IPD/PatientDetails/IPDIntakeOutput";
const PRIMARY = "#521785";

const statusStyles = {
  Stable: "bg-[#DCFCE7] text-[#16A34A] border-[#16A34A]",
  "Under Treatment": "bg-[#FFEDD5] text-[#EA580C] border-[#EA580C]",
  Critical: "bg-[#FEE2E2] text-[#EF4444] border-[#EF4444]",
};

const InfoBlock = ({ icon: Icon, label, value, subValue }) => (
  <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
    <div className="w-9 h-9 rounded-full bg-[#F3E8FF] flex items-center justify-center shrink-0">
      <Icon size={16} color={PRIMARY} />
    </div>

    <div className="min-w-0">
      <p className="text-[11px] sm:text-[12px] text-[#8BA3CB]">
        {label}
      </p>

      <p className="text-[13px] sm:text-[14px] font-semibold text-[#343C6A] break-words">
        {value}
      </p>

      {subValue && (
        <p className="text-[11px] sm:text-[12px] text-[#8BA3CB] break-words">
          {subValue}
        </p>
      )}
    </div>
  </div>
);

const PatientDetails = () => {
  const { mrn } = useParams();
  const { state } = useLocation();

  const status = state?.status;

  console.log("status", status);

  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [sections, setSections] = useState([]);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentsRefreshKey, setDocumentsRefreshKey] = useState(0);

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    sectionId: null,
  });

  const [isDeleting, setIsDeleting] = useState(false);

  const [activeTab, setActiveTab] = useState("note");

  const [showAddVitalsModal, setShowAddVitalsModal] = useState(false);

  const [intakeOutputCategory, setIntakeOutputCategory] = useState("");

  const [showAddIntakeOutputModal, setShowAddIntakeOutputModal] = useState(false);

  const fetchPatient = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await ipdService.getAdmissions({
        searchTerm: mrn,
        status: status,
      });

      const admissions = res?.admissions || [];
      console.log(admissions)

      const match = admissions.find(
        (a) =>
          String(a.mrn).trim().toLowerCase() ===
          String(mrn).trim().toLowerCase()
      );

      setPatient(match || null);
      console.log("patient object", match);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Failed to load patient details."
      );
    } finally {
      setLoading(false);
    }
  }, [mrn]);

  useEffect(() => {
    fetchPatient();
  }, [fetchPatient]);

  const fetchSections = useCallback(async (admissionId) => {
    setSectionsLoading(true);

    try {
      const res = await ipdService.getClinicalSummary(admissionId);
      setSections(res?.sections || []);
    } catch (err) {
      setSections([]);
    } finally {
      setSectionsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (patient?.id) {
      fetchSections(patient.id);
    }
  }, [patient, fetchSections]);

  if (loading) {
    return (
      <div className="h-full min-h-full bg-transparent p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col gap-4">
        <button
          onClick={() => navigate("/ipd/admissions")}
          className="flex items-center gap-1 text-[13px] sm:text-[14px] font-medium w-fit"
          style={{ color: PRIMARY }}
        >
          <ArrowLeft size={16} />
          Back to Admitted Patients
        </button>

        <div className="bg-white rounded-lg border border-[#e5e5e5] p-6 sm:p-8 md:p-10 flex items-center justify-center text-[#8BA3CB] gap-2 text-center text-sm">
          <Loader2 size={18} className="animate-spin shrink-0" />
          Loading patient details...
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="h-full min-h-full bg-transparent p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col gap-4">
        <button
          onClick={() => navigate("/ipd/admissions")}
          className="flex items-center gap-1 text-[13px] sm:text-[14px] font-medium w-fit"
          style={{ color: PRIMARY }}
        >
          <ArrowLeft size={16} />
          Back to Admitted Patients
        </button>

        <div className="bg-white rounded-lg border border-[#e5e5e5] p-6 sm:p-8 md:p-10 text-center text-[#8BA3CB] text-sm">
          {error || `Patient with MRN ${mrn} was not found.`}
        </div>
      </div>
    );
  }

  const openAddModal = () => {
    setEditingSection(null);
    setIsModalOpen(true);
    setActiveTab("note")
  };

  const openEditModal = (section) => {
    setEditingSection(section);
    setIsModalOpen(true);
  };

  const handleSaveSection = async (data) => {
    try {
      if (editingSection) {
        const res =
          await ipdService.updateClinicalSummarySection(
            editingSection.id,
            data
          );

        toast.success(
          res?.message || "Edit succcessfull..."
        );
      } else {
        const res =
          await ipdService.addClinicalSummarySection(
            patient.id,
            data
          );

        toast.success(
          res?.message || "Added successfully.."
        );
      }

      fetchSections(patient.id);
    } catch (err) {
      console.error(
        "Failed to save section:",
        err?.response?.data || err.message
      );

      toast.error(
        err?.response?.data?.message ||
        "Failed to save section."
      );

      fetchSections(patient.id);
    }
  };

  const openDeleteModal = (sectionId) => {
    setDeleteModal({
      isOpen: true,
      sectionId,
    });
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;

    setDeleteModal({
      isOpen: false,
      sectionId: null,
    });
  };

  const confirmDeleteSection = async () => {
    if (!deleteModal.sectionId) return;

    try {
      setIsDeleting(true);

      await ipdService.deleteClinicalSummarySection(
        deleteModal.sectionId
      );

      toast.success(
        "Clinical timeline entry deleted successfully."
      );

      closeDeleteModal();

      fetchSections(patient.id);
    } catch (error) {
      toast.error(
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to delete clinical timeline entry."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDocumentUploadSuccess = () => {
    // forces IPDPatientDocuments to remount and refetch its document list
    setDocumentsRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="h-full min-h-full bg-transparent p-1 md:px-2 flex flex-col gap-4">

      <div>
        <button
          onClick={() => navigate("/ipd/admissions")}
          className="flex items-center gap-1 text-[12px] sm:text-[13px] font-medium mb-2"
          style={{ color: PRIMARY }}
        >
          <ArrowLeft size={15} />
          Back to Admitted Patients
        </button>

        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3 sm:gap-4">
          <div className="min-w-0">
            <p className="text-[#8BA3CB] text-xs sm:text-sm mt-1">
              Clinical timeline and admission details.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto lg:justify-end shrink-0">

            <div className="grid grid-cols-3 gap-2 w-full sm:flex sm:w-auto sm:flex-wrap">
              <Button
                onClick={openAddModal}
                className="text-white flex items-center justify-center gap-1 px-2 lg:px-4 py-2 text-xs sm:text-sm whitespace-nowrap"
                style={{ backgroundColor: PRIMARY }}
              >
                <Plus size={15} />
                <span className="sm:hidden">Note</span>
                <span className="hidden sm:inline">Add Note</span>
              </Button>

              <Button
                onClick={() => {setShowAddDocumentModal(true); setActiveTab("documents");}}
                className="text-white flex items-center justify-center gap-1 px-2 lg:px-4 py-2 text-xs sm:text-sm whitespace-nowrap"
                style={{ backgroundColor: PRIMARY }}
              >
                <Plus size={15} />
                <span className="sm:hidden">Document</span>
                <span className="hidden sm:inline">Add Document</span>
              </Button>

              <Button
                onClick={() => {
                  setActiveTab("vitals");
                  setShowAddVitalsModal(true);
                }}
                className="text-white flex items-center justify-center gap-1 px-2 lg:px-4 py-2 text-xs sm:text-sm whitespace-nowrap"
                style={{ backgroundColor: PRIMARY }}
              >
                <Plus size={15} />
                <span className="sm:hidden">Vitals</span>
                <span className="hidden sm:inline">Add Vitals</span>
              </Button>

              <Button
                onClick={() => {
                  setActiveTab("intakeOutput");
                  setIntakeOutputCategory("intake");
                  setShowAddIntakeOutputModal(true);
                }}
                className="text-white flex items-center justify-center gap-1 px-2 lg:px-4 py-2 text-xs sm:text-sm whitespace-nowrap"
                style={{ backgroundColor: PRIMARY }}
              >
                <Plus size={15} />
                <span className="sm:hidden">Intake</span>
                <span className="hidden sm:inline">Add Intake</span>
              </Button>

              <Button
                onClick={() => {
                  setActiveTab("intakeOutput");
                  setIntakeOutputCategory("output");
                  setShowAddIntakeOutputModal(true);
                }}
                className="text-white flex items-center justify-center gap-1 px-2 lg:px-4 py-2 text-xs sm:text-sm whitespace-nowrap"
                style={{ backgroundColor: PRIMARY }}
              >
                <Plus size={15} />
                <span className="sm:hidden">Output</span>
                <span className="hidden sm:inline">Add Output</span>
              </Button>
            </div>

            <span
              className={`order-first sm:order-last w-fit text-[11px] sm:text-[13px] font-medium px-2.5 sm:px-3 py-1.5 rounded-lg whitespace-nowrap capitalize border ${statusStyles[patient.status] || "bg-gray-100 text-gray-600"
                }`}
            >
              {patient.status}
            </span>
          </div>
        </div>
      </div>


      <div className="bg-white rounded-lg border border-[#e5e5e5] p-3 sm:p-4 md:p-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        <InfoBlock
          icon={UserRound}
          label="Patient"
          value={patient.name}
          subValue={`MRN: ${patient.mrn}`}
        />

        <InfoBlock
          icon={Phone}
          label="Phone"
          value={patient.phone}
        />

        <InfoBlock
          icon={Stethoscope}
          label="Doctor"
          value={patient.doctor}
          subValue={patient.doctorRole}
        />

        <InfoBlock
          icon={BedDouble}
          label="Ward / Room / Bed"
          value={`${patient.ward} / ${patient.room}`}
          subValue={patient.currentBed}
        />

        <InfoBlock
          icon={Calendar}
          label="Admission Date"
          value={patient.admissionDate}
          subValue={patient.admissionTime}
        />

        <InfoBlock
          icon={Calendar}
          label="Admission type"
          value={`${patient.admissionType}`}
        // subValue={patient.admissionTime}
        />
      </div>


      <div className="bg-white rounded-lg border border-[#e5e5e5] p-3 sm:p-4 md:p-5 flex flex-col gap-4">


        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">

          <button
            type="button"
            onClick={() => setActiveTab("note")}
            className={`px-4 py-2 rounded-md text-[13px] sm:text-[14px] font-semibold transition-colors ${activeTab === "note"
              ? "text-white"
              : "text-[#8BA3CB] bg-[#F3F4F6] hover:bg-[#E5E7EB]"
              }`}
            style={activeTab === "note" ? { backgroundColor: PRIMARY } : undefined}
          >
            Note
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("documents")}
            className={`px-4 py-2 rounded-md text-[13px] sm:text-[14px] font-semibold transition-colors ${activeTab === "documents"
              ? "text-white"
              : "text-[#8BA3CB] bg-[#F3F4F6] hover:bg-[#E5E7EB]"
              }`}
            style={activeTab === "documents" ? { backgroundColor: PRIMARY } : undefined}
          >
            Documents
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("vitals")}
            className={`px-4 py-2 rounded-md text-[13px] sm:text-[14px] font-semibold transition-colors ${activeTab === "vitals"
              ? "text-white"
              : "text-[#8BA3CB] bg-[#F3F4F6] hover:bg-[#E5E7EB]"
              }`}
            style={activeTab === "vitals" ? { backgroundColor: PRIMARY } : undefined}
          >
            Vitals
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("intakeOutput")}
            className={`px-4 py-2 rounded-md text-[13px] sm:text-[14px] font-semibold transition-colors ${activeTab === "intakeOutput"
              ? "text-white"
              : "text-[#8BA3CB] bg-[#F3F4F6] hover:bg-[#E5E7EB]"
              }`}
            style={activeTab === "intakeOutput" ? { backgroundColor: PRIMARY } : undefined}
          >
            Intake & Output
          </button>
        </div>

        {activeTab === "note" && (
          <div className="flex flex-col gap-4">


            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <FileText
                  size={18}
                  color={PRIMARY}
                  className="shrink-0"
                />

                <h2 className="text-[15px] sm:text-[16px] font-semibold text-[#343C6A]">
                  Clinical Timeline
                </h2>
              </div>

              <Button
                onClick={openAddModal}
                className="text-white flex items-center justify-center gap-1 w-full sm:w-auto sm:ml-auto md:w-[140px] lg:w-[150px] px-4 py-2 text-sm"
                style={{ backgroundColor: PRIMARY }}
              >
                <Plus size={15} />
                Add
              </Button>
            </div>

            {sectionsLoading ? (
              <div className="flex items-center justify-center text-[#8BA3CB] gap-2 py-8 sm:py-10 text-sm text-center">
                <Loader2
                  size={16}
                  className="animate-spin shrink-0"
                />
                Loading clinical timeline...
              </div>
            ) : sections.length === 0 ? (
              <div className="text-center text-[#8BA3CB] text-[13px] py-8 sm:py-10 px-3">
                No entries yet. Click "Add Entry" to start the patient's
                clinical timeline.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    className="border border-[#e5e5e5] rounded-lg p-3 sm:p-4 flex flex-col md:flex-row items-stretch md:items-start gap-3 sm:gap-4"
                  >
                    {/* Date */}

                    <div className="flex flex-row md:flex-col items-center md:items-start gap-2 md:gap-1 w-full md:w-auto shrink-0 md:pr-4 md:border-r md:border-[#e5e5e5] pb-3 md:pb-0 border-b md:border-b-0 border-[#e5e5e5]">
                      <div className="flex items-center gap-1.5">
                        <Calendar
                          size={13}
                          color={PRIMARY}
                          className="shrink-0"
                        />

                        <span className="text-[12px] sm:text-[13px] font-semibold text-[#343C6A] whitespace-nowrap">
                          {section.date
                            ? new Date(
                              section.date
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                            : "-"}
                        </span>
                      </div>

                      {section.timestamp && (
                        <span className="text-[11px] text-[#8BA3CB] md:pl-[19px] whitespace-nowrap">
                          {
                            section.timestamp
                              .split(",")
                              .slice(-1)[0]
                              .trim()
                          }
                        </span>
                      )}
                    </div>

                    {/* Content */}

                    <div className="flex-1 flex flex-col gap-2 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div className="flex items-center gap-2 flex-wrap min-w-0">
                          <h3 className="text-[13px] sm:text-[14px] font-semibold text-[#343C6A] break-words">
                            {section.heading}
                          </h3>

                          <span
                            className={`text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${statusStyles[section.status]
                              }`}
                          >
                            {section.status}
                          </span>
                        </div>

                        {/* Action Buttons */}

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() =>
                              openEditModal(section)
                            }
                            className="p-1.5 rounded-md border border-[#d9d0f7] text-[#7C3AED]"
                          >
                            <Pencil size={13} />
                          </button>

                          <button
                            onClick={() =>
                              openDeleteModal(section.id)
                            }
                            className="p-1.5 rounded-md border border-[#fbd5d5] text-[#EF4444]"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <p className="text-[12px] sm:text-[13px] text-[#343C6A] leading-relaxed break-words">
                        {section.description}
                      </p>

                      {section.doctorName && (
                        <span className="text-[11px] sm:text-[12px] font-medium text-[#521785] flex items-center gap-1.5 break-words">
                          <Stethoscope
                            size={13}
                            className="shrink-0"
                          />

                          <span className="break-words">
                            {section.doctorName.startsWith("Dr.")
                              ? section.doctorName
                              : `Dr. ${section.doctorName}`}
                          </span>
                        </span>
                      )}

                      <div className="pt-2 mt-1 border-t border-[#F1EDF8]">
                        <span className="text-[10px] sm:text-[11px] text-[#8BA3CB] flex items-start sm:items-center gap-1.5 break-words">
                          <Tag
                            size={11}
                            className="shrink-0 mt-0.5 sm:mt-0"
                          />

                          <span className="break-words">
                            Added on {section.timestamp}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "documents" && (
          <IPDPatientDocuments
            key={documentsRefreshKey}
            admissionId={patient.id}
            patientId={patient.patientId}
            patient={patient}
            logo={patient.logo}
          />
        )}

        {activeTab === "vitals" && (
          <IPDPatientVitals
            patientId={patient.patientId}
            admissionId={patient.id}
            isAddModalOpen={showAddVitalsModal}
            onOpenAddModal={() => setShowAddVitalsModal(true)}
            onCloseAddModal={() => setShowAddVitalsModal(false)}
            success={()=>setActiveTab("vitals")}
          />
        )}

        {activeTab === "intakeOutput" && (
          <IPDPatientIntakeOutput
            patientId={patient.patientId}
            admissionId={patient.id}
            success={()=>setActiveTab("intakeOutput")}
            isAddModalOpen={showAddIntakeOutputModal}
            addModalCategory={intakeOutputCategory}
            onOpenAddModal={(category) => {
              setIntakeOutputCategory(category);
              setShowAddIntakeOutputModal(true);
            }}
            onCloseAddModal={() =>      setShowAddIntakeOutputModal(false)}
          />
        )}
      </div>


      <AddSectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSection}
        editingSection={editingSection}
      />

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteSection}
        title="Delete Clinical Timeline Entry"
        message="Are you sure you want to delete this clinical timeline entry? This action cannot be undone."
        loading={isDeleting}
      />

      <AddPatientDocumentModal
        isOpen={showAddDocumentModal}
        onClose={() => {
          setShowAddDocumentModal(false);
          setSelectedDocument(null);
        }}
        patientId={patient.patientId}
        admissionId={patient.id}
        onSuccess={handleDocumentUploadSuccess}
        selectedDocument={selectedDocument}
      />
    </div>
  );
};

export default PatientDetails;