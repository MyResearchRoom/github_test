import { Button } from "@mui/material";
import { UserPlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import DoctorCount from "../../components/Doctor/doctorManagement/DoctorCount";
import DoctorDetailsCard from "../../components/Doctor/doctorManagement/DoctorDetailsCard";
import PopUpModal from "../../commonComponent/PopUpModal";
import AddNewDoctor from "../../modal/DoctorModal/AddNewDoctor";
import { useFetch } from "../../hooks/useFetch";
import { toast } from "react-toastify";
import {
  changeDoctorStatus,
  deleteSubDoctor,
} from "../../services/SubdoctorService";
import { DoctorDetailsCardSkeleton } from "../../components/Doctor/doctorManagement/DoctorDetailsCardSkeleton";
import { useSearch } from "../../context/SearchContext";
import Pagination from "../../commonComponent/Pagination";
import { usePagination } from "../../hooks/usePagination";

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  
  const [selectedId, setSelectedId] = useState({
    id: null,
    type: null,
  });
  const { debounceSearchTerm } = useSearch();
  const { currentPage, totalPages, goToPage, setTotalPages } = usePagination();
  const [refreshKey, setRefreshKey] = useState(0);
  const [department,setDepartment]= useState("");

  const handleClose = () => {
    setSelectedId({
      id: null,
      type: null,
    });
  };
  const handleChangeStatus = async (id) => {
    if (!id) return;
    try {
      const response = await changeDoctorStatus(id);
      if (response) {
        setDoctors((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, isActive: !item.isActive } : item
          )
        );
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async () => {
    if (selectedId.id) {
      try {
        const response = await deleteSubDoctor(selectedId.id);
        if (response) {
          setDoctors((prev) =>
            prev.filter((item) => item.id !== selectedId.id)
          );
          setSelectedId({
            id: null,
            type: null,
          });
        }
      } catch (error) {
        toast.error(error?.message);
      }
    }
  };

  const addNewDoctor = (newDoctor, isEdit) => {
    // newDoctor should include `id` from backend
    if (isEdit) {
      setDoctors((prev) =>
        prev.map((item) => (item.id === newDoctor.id ? newDoctor : item))
      );
    } else {
      setDoctors((prev) => [newDoctor, ...prev]);
    }
  };

  const { data, loading } = useFetch(
    `/api/subdoctors`,
    {
      params: {
        searchTerm: debounceSearchTerm,
        page:currentPage,
        departmentFilter:department,
        limit:20
      },
    },
    [debounceSearchTerm,currentPage,refreshKey,department]
  );

  useEffect(() => {
    if (data?.success) {
      setDoctors(data?.data);
      setTotalPages(data?.pagination?.totalPages)
    }
  }, [data]);


  return (
    <>
      {selectedId.id && selectedId.type === "delete" && (
        <PopUpModal
          title={"Are you sure you want to delete doctor ?"}
          closeModal={handleClose}
          doneModal={handleDelete}
        />
      )}
      {(selectedId.type === "add_new_doctor" ||
        selectedId.type === "edit_prev_doctor") && (
        <AddNewDoctor
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          addNewDoctor={addNewDoctor}
        />
      )}
      <div className="flex flex-col md:flex-row justify-between py-2 items-start md:items-center">
        <h1 className="text-[#343c6a] font-semibold text-lg">
          Doctor Management
        </h1>
        <div className="flex flex-col md:flex-row  justify-end items-start gap-3">
          <select
                name="department"
                value={department}
                onChange={(e)=>setDepartment(e.target.value)}
                className="outline-none border p-2 text-white w-auto text-sm rounded-lg bg-[#521785] "
              >
                <option value="">Select department</option>
                <option value="Orthopaedics Department">Orthopaedics Department</option>
                <option value="ICU Trauma Care Center">ICU Trauma Care Center</option>
                <option value="Radiology Department">Radiology Department</option>
                <option value="Surgery Department">Surgery Department</option>
                <option value="Medicine Department">Medicine Department</option>
                <option value="Paediatrics Department">Paediatrics Department</option>
                <option value="Ophthalmology Department">Ophthalmology Department</option>
                <option value="Obstetrics & Gynaecology Department">Obstetrics & Gynaecology Department</option>
                <option value="other">Other</option>

          </select>
          <Button
            variant="outlined"
            onClick={() =>
              setSelectedId({ ...selectedId, type: "add_new_doctor" })
            }
            className="!flex !gap-2 !items-center !bg-[#521785] !rounded-lg !text-white !capitalize !border-none !ml-auto"
          >
            <UserPlus size={18} className="text-sm" /> Add New Doctor
          </Button>
        </div>
      </div>
      {/* bg-[#175efc] */}
      <DoctorCount />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 mt-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <DoctorDetailsCardSkeleton key={i} />
          ))
        ) : !loading && doctors?.length > 0 ? (
          doctors?.map((item) => (
            <DoctorDetailsCard
              key={item.id}
              doctor={item}
              setSelectedId={setSelectedId}
              handleChangeStatus={handleChangeStatus}
              setRefreshKey={setRefreshKey}
            />
          ))
        ) : (
          // 👉 Empty State
          <div className="col-span-full flex flex-col items-center justify-center text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 17v-2h6v2m-6 4h6a2 2 0 002-2v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2zm0-8h.01M9 7h6m-6-4h6a2 2 0 012 2v2a2 2 0 01-2 2H9a2 2 0 01-2-2V5a2 2 0 012-2z"
              />
            </svg>
            <h2 className="text-lg font-semibold text-gray-700">
              No doctors found
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Add a new doctor to get started.
            </p>
          </div>
        )}
      </div>
      <div className="flex justify-end items-center py-4">
        {doctors.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            goToPage={goToPage}
          />
        )}
      </div>
    </>
  );
};

export default DoctorManagement;
