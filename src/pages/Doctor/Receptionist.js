import React, { useEffect, useState } from "react";
import "../../index.css";

import AddReceptionistModal from "../../modal/DoctorModal/AddReceptionistModal";
import ViewReceptionist from "../../modal/DoctorModal/ViewReceptionist";
import { toast } from "react-toastify";

import { HiTrash, HiUserGroup } from "react-icons/hi2";
import { HiUserAdd, HiPencil } from "react-icons/hi";

import PopUpModal from "../../commonComponent/PopUpModal";
import { Button } from "@mui/material";

import AttendenceHistory from "../../components/Doctor/AttendenceHistory";
import StaffDetails from "../../components/Receptionist/staff/StaffDetails";

import { useFetch } from "../../hooks/useFetch";
import apiClient from "../../api/apiClient";

const ReceptionistPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [receptionists, setReceptionists] = useState([]);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [selectedReceptionist, setSelectedReceptionist] = useState(null);
  const [receptionistId, setReceptionistId] = useState(null);

  const [removeId, setRemoveId] = useState();
  const [isOpenModal, setOpenModal] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editReceptionistData, setEditReceptionistData] = useState(null);

  const handleViewDetails = (id) => {
    setSelectedReceptionist(id);
    setIsViewDetailsOpen(true);
  };

  const { data: receptionistList, refetch } = useFetch("/api/receptionists/");

  useEffect(() => {
    if (receptionistList?.receptionists?.length > 0) {
      setReceptionists(receptionistList.receptionists);

      if (!receptionistId) {
        setReceptionistId(receptionistList.receptionists[0].id);
      }
    } else {
      setReceptionists([]);
      setReceptionistId(null);
    }
  }, [receptionistList]);

  const handleRemoveReceptionist = async () => {
    try {
      const response = await apiClient.delete(`/api/receptionists/${removeId}`);

      if (response.status === 200) {
        toast.success("Receptionist removed successfully");

        const updatedList = receptionists.filter(
          (item) => item.id !== removeId,
        );

        setReceptionists(updatedList);

        if (updatedList.length > 0) {
          setReceptionistId(updatedList[0].id);
        } else {
          setReceptionistId(null);
        }

        setOpenModal(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occurred");
    }
  };

  const handleRemove = (id) => {
    setRemoveId(id);
    setOpenModal(true);
  };

  const handleEditReceptionist = (item) => {
    setEditReceptionistData(item);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditReceptionistData(null);
  };

  useEffect(() => {
    const calendarTiles = document.querySelectorAll(
      ".react-calendar__tile abbr",
    );

    calendarTiles.forEach((tile) => {
      const dayNumber = tile.innerText;

      if (dayNumber && dayNumber.length === 1) {
        tile.innerText = `0${dayNumber}`;
      }
    });
  }, []);

  return (
    <>
      {isOpenModal && (
        <PopUpModal
          title="Are you sure you want to remove Receptionist ?"
          closeModal={() => setOpenModal(false)}
          doneModal={handleRemoveReceptionist}
        />
      )}

      <div className="w-full h-auto xl:h-[30%] bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center p-1 h-[25%] px-2 mb-2 lg:mb-0">
          <h1 className="text-lg font-semibold text-[#343C6A]">
            Staff List
          </h1>

          <Button
            variant="outlined"
            onClick={() => {
              setIsEditMode(false);
              setEditReceptionistData(null);
              setIsModalOpen(true);
            }}
            className="!btn_bg text-[15px] !text-white !capitalize !border-none font-semibold w-[180px] p-2"
          >
            Add New 
          </Button>
        </div>

        <div
          className="w-full h-auto xl:h-[75%] px-2 pb-2 rounded-lg overflow-y-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {receptionists?.length > 0 ? (
            <>
              <div className="hidden lg:block">
                <table className="w-full">
                  <thead className="bg-[#f2f2f2] w-full h-10 sticky top-0 border-b border-r border-l z-10">
                    <tr className="text-[#343c6a] text-sm lg:text-[15px]">
                      <th className="font-semibold w-[5%] text-left pl-1"></th>
                      <th className="font-semibold w-[15%] text-left pl-1">
                        Receptionist Name
                      </th>
                      <th className="font-semibold w-[10%] text-center">
                        Staff ID
                      </th>
                      <th className="font-semibold w-[15%] text-center pl-1">
                        Role
                      </th>
                      <th className="font-semibold w-[10%] text-center">
                        Joining Date
                      </th>
                      <th className="font-semibold w-[15%] text-center">
                        Today's Attendance
                      </th>
                      <th className="font-semibold w-[10%] text-center">
                        Details
                      </th>
                      <th className="font-semibold w-[5%] text-center">Edit</th>
                      <th className="font-semibold w-[5%] text-center">
                        Delete
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {receptionists.map((item, index) => (
                      <tr
                        key={item.id}
                        onClick={() => setReceptionistId(item.id)}
                        className={`h-10 p-2 text-[#343c6a] text-[13px] font-semibold border-b border-r border-l cursor-pointer ${item.id === receptionistId ? "bg-[#fbf6ff]" : "bg-white"}`}
                      >
                        <td className="text-center">{index + 1}</td>

                        <td className="text-left pl-1 capitalize">
                          {item.name}
                        </td>

                        <td className="text-center">{item.receptionistId}</td>
                        <td className="text-center capitalize">{item.role}</td>


                        <td className="text-center">
                          {item.dateOfJoining?.slice(0, 10)}
                        </td>

                        <td
                          className={`text-center ${item.availabilityStatus === "Available" ? "text-[#10972E]" : "text-red-500"}`}
                        >
                          {item.availabilityStatus}
                        </td>

                        <td className="text-center">
                          <Button
                            variant="outlined"
                            className="text-sm !bg-[#d9b3f8] !border-none !capitalize !h-8 !text-[#343C6A] font-semibold"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(item.id);
                            }}
                          >
                            View
                          </Button>
                        </td>

                        <td
                          className="text-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditReceptionist(item);
                          }}
                        >
                          <div className="flex justify-center">
                            <HiPencil
                              size={18}
                              className="text-blue-500 cursor-pointer hover:scale-110 transition-all"
                            />
                          </div>
                        </td>

                        <td
                          className="text-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(item.id);
                          }}
                        >
                          <div className="flex justify-center">
                            <HiTrash
                              className="text-red-500 cursor-pointer"
                              size={18}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
                {receptionists.map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => setReceptionistId(item.id)}
                    className={`rounded-xl border p-3 sm:p-4 cursor-pointer transition-all ${item.id === receptionistId ? "bg-[#fbf6ff] border-[#521785] shadow-sm" : "bg-white border-gray-200"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-[#f2e2ff] flex items-center justify-center shrink-0">
                          <span className="text-[#521785] font-semibold text-sm sm:text-base">
                            {item.name?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm sm:text-base font-semibold text-[#343c6a] capitalize truncate">
                            {item.name}
                          </p>

                          <p className="text-xs sm:text-sm text-gray-500 truncate">
                            ID: {item.receptionistId}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs text-gray-400 shrink-0">
                        #{index + 1}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                      <div className="rounded-lg bg-[#f8f8f8] p-2">
                        <p className="text-[10px] sm:text-xs text-gray-500">
                          Role
                        </p>
                        <p className="text-xs sm:text-sm font-semibold text-[#521785] mt-0.5 truncate capitalize">
                          {item.role
                            ? item.role
                            : "N/A"}
                        </p>
                      </div>

                      <div className="rounded-lg bg-[#f8f8f8] p-2">
                        <p className="text-[10px] sm:text-xs text-gray-500">
                          Joining Date
                        </p>
                        <p className="text-xs sm:text-sm font-semibold text-[#343c6a] mt-0.5">
                          {item.dateOfJoining?.slice(0, 10) || "N/A"}
                        </p>
                      </div>

                      <div className="rounded-lg bg-[#f8f8f8] p-2">
                        <p className="text-[10px] sm:text-xs text-gray-500">
                          Attendance
                        </p>
                        <p
                          className={`text-xs sm:text-sm font-semibold mt-0.5 ${item.availabilityStatus === "Available" ? "text-[#10972E]" : "text-red-500"}`}
                        >
                          {item.availabilityStatus}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-gray-100">
                      <Button
                        variant="outlined"
                        className="!bg-[#d9b3f8] !border-none !capitalize !h-8 !text-xs sm:!text-sm !text-[#343C6A] font-semibold !px-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(item.id);
                        }}
                      >
                        View Details
                      </Button>

                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditReceptionist(item);
                          }}
                          className="p-1.5 rounded-md hover:bg-blue-50 transition-all"
                        >
                          <HiPencil size={18} className="text-blue-500" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(item.id);
                          }}
                          className="p-1.5 rounded-md hover:bg-red-50 transition-all"
                        >
                          <HiTrash size={18} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-full min-h-[180px] flex flex-col justify-center items-center text-gray-400 px-4 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-gray-100 mb-3">
                <HiUserAdd className="h-7 w-7 sm:h-8 sm:w-8 text-gray-500" />
              </div>

              <p className="text-base sm:text-[18px] font-semibold text-gray-600">
                No receptionists added yet
              </p>

              <p className="text-xs sm:text-[13px] text-gray-400 mt-1">
                Start by adding a receptionist to manage your staff.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="w-full h-auto xl:h-[30%] mt-2 mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        {receptionistId ? (
          <StaffDetails receptionistId={receptionistId} />
        ) : (
          <div className="flex flex-col min-h-[180px] h-full items-center justify-center text-gray-400 px-4 text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-gray-100 mb-3">
              <HiUserGroup className="h-7 w-7 sm:h-8 sm:w-8 text-gray-400" />
            </div>

            <p className="font-semibold text-sm sm:text-[16px] text-gray-500">
              No staff selected
            </p>

            <p className="text-xs sm:text-[13px] text-gray-400 mt-1">
              Please select a staff member from the list to view details
            </p>
          </div>
        )}
      </div>

      {receptionistId && (
        <div className="w-full h-auto xl:h-[70%] mt-2 bg-white shadow-md rounded-lg overflow-hidden">
          <AttendenceHistory receptionistId={receptionistId} />
        </div>
      )}

      {isModalOpen && (
        <AddReceptionistModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          getReceptionists={refetch}
          isEdit={isEditMode}
          editData={editReceptionistData}
          receptionistId={editReceptionistData?.id}
          setReceptionistId={setReceptionistId}
        />
      )}

      {isViewDetailsOpen && (
        <ViewReceptionist
          isOpenDetails={isViewDetailsOpen}
          onCloseDetails={() => setIsViewDetailsOpen(false)}
          receptionistId={selectedReceptionist}
        />
      )}
    </>
  );
};

export default ReceptionistPage;