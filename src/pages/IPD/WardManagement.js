import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import {
  Building2,
  BedDouble,
  Bed as BedIcon,
  UserRound,
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  Info,
} from "lucide-react";
import TableComponent from "../../commonComponent/TableComponent";
import Button from "../../commonComponent/Button";
import AddWardModal from "../../modal/IPD/addWard";
import { wardService } from "../../services/wardService";
import Pagination from "../../commonComponent/Pagination";
import { usePagination } from "../../hooks/usePagination";

const ITEMS_PER_PAGE = 10;

const statIcons = [
  { icon: Building2, bg: "#F3E8FF", color: "#9333EA" },
  { icon: BedDouble, bg: "#E0F2FE", color: "#2563EB" },
  { icon: BedIcon, bg: "#DCFCE7", color: "#16A34A" },
  { icon: UserRound, bg: "#FFEDD5", color: "#EA580C" },
];

const getOccupancyColor = (percent) => {
  if (percent >= 80) return "#EF4444";
  if (percent >= 70) return "#F97316";
  return "#F97316";
};

const WardManagement = () => {
  const [search, setSearch] = useState("");
  const [wards, setWards] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAddWardOpen, setIsAddWardOpen] = useState(false);
  const [editingWard, setEditingWard] = useState(null);

  const { currentPage, totalPages, goToPage, setTotalPages } =
    usePagination();

  const [isDeleteModalOpen, setIsDeleteModalOpen] =
    useState(false);
  const [deletingWard, setDeletingWard] = useState(null);
  const [deleteLoading, setDeleteLoading] =
    useState(false);

  useEffect(() => {
    setTotalPages(
      Math.ceil(wards.length / ITEMS_PER_PAGE) || 1
    );
  }, [wards, setTotalPages]);

  useEffect(() => {
    goToPage(1);
  }, [search, goToPage]);

  const fetchWards = useCallback(
    async (searchTerm) => {
      setLoading(true);

      try {
        const data =
          await wardService.getWards({
            searchTerm,
          });

        setWards(data.wards || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchStats = useCallback(async () => {
    try {
      const data =
        await wardService.getWardStats();

      setStats(data.stats || null);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchWards(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, fetchWards]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleAddWard = async (newWard) => {
    try{
      const res=await wardService.createWard(newWard);
      toast.success(res?.message  || "Ward added successfully..");

      await Promise.all([
        fetchWards(search),
        fetchStats(),
      ]);
    }catch(error){
      console.error("error:", error);
      
      toast.error(
          error?.response?.data?.message ||
            "Failed to update room"
      );
    }
  };

  const handleUpdateWard = async (
    id,
    updatedWard
  ) => {
    try{
      const res=await wardService.updateWard(
        id,
        updatedWard
      );
      toast.success(res?.message || "Ward updated successfully..");
      await Promise.all([
        fetchWards(search),
        fetchStats(),
      ]);
    }catch(error){
        console.error("error:", error);
        
        toast.error(
            error?.response?.data?.message ||
              "Failed to update ward"
        );
    }
  };

  const handleEditClick = (ward) => {
    setEditingWard(ward);
    setIsAddWardOpen(true);
  };

  const handleDeleteWard = (ward) => {
    setDeletingWard(ward);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteWard = async () => {
    if (!deletingWard?.id) return;

    try {
      setDeleteLoading(true);

      const res=await wardService.deleteWard(
        deletingWard.id
      );
      toast.success(res?.message || "Ward deleteed successfully..");

      await Promise.all([
        fetchWards(search),
        fetchStats(),
      ]);

      setIsDeleteModalOpen(false);
      setDeletingWard(null);

      toast.success(
        "Ward deleted successfully"
      );
    } catch (error) {
      console.error(
        "Error deleting ward:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to delete ward";

      toast.error(message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteModalClose = () => {
    if (deleteLoading) return;

    setIsDeleteModalOpen(false);
    setDeletingWard(null);
  };

  const handleOpenAddModal = () => {
    setEditingWard(null);
    setIsAddWardOpen(true);
  };

  const handleModalClose = () => {
    setIsAddWardOpen(false);
    setEditingWard(null);
  };

  const statCards = stats
    ? [
        {
          heading: "Total Wards",
          value: stats.totalWards,
          subtext: "Across hospital",
        },
        {
          heading: "Total Capacity",
          value: stats.totalCapacity,
          subtext: "Total beds",
        },
        {
          heading: "Available Beds",
          value: stats.availableBeds,
          subtext: "Ready for use",
        },
        {
          heading: "Occupied Beds",
          value: stats.occupiedBeds,
          subtext: "Currently in use",
        },
      ]
    : [];

  const columns = [
    {
      label: "Ward Name",
      field: "wardName",
      headerClassName: "text-left pl-4",
      className: "pl-4 py-3",
    },
    {
      label: "Type",
      field: "wardType",
      headerClassName: "text-left",
      className: "py-3",
    },
    {
      label: "Location",
      field: "location",
      headerClassName: "text-left",
      className: "py-3",
    },
    {
      label: "Room Capacity",
      field: "capacity",
      headerClassName: "text-left",
      className: "py-3",
    },
    
    {
      label: "Room available",
      field: "availableRooms",
      headerClassName: "text-left",
      className: "py-3",
    },
    {
      label: "Total Beds",
      field: "totalBeds",
      headerClassName: "text-left",
      className:
        "py-3  font-semibold",
    },
    // {
    //   label: "Available / Occupied Beds",
    //   field: "",
    //   headerClassName: "text-left",
    //   className:
    //     "py-3  font-semibold",
    //   render: (item) => (
    //     <p>
    //       <span className="text-[#16A34A]">{item.availableBeds}</span> / <span className="text-[#EA580C]">{item.occupiedBeds}</span>
    //     </p>
    //   )
    // },
    {
      label: "Room Occupancy %",
      headerClassName: "text-left",
      className: "py-3 w-[180px]",
      render: (item) => {
        // const percent = item.capacity
        //   ? Math.round(
        //       (item.availableRooms /
        //         item.capacity) 
        //     ) * 100
        //   : 0;
         const percent = item.capacity
        ? Math.round((item.availableRooms /  item.capacity) * 100)
        : 0;


        return (
          <div className="flex flex-col gap-1">
            <span className="text-[13px] font-medium">
              {percent}%
            </span>

            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${percent}%`,
                  backgroundColor:
                    getOccupancyColor(
                      percent
                    ),
                }}
              />
            </div>
          </div>
        );
      },
    },
  ];

  const startIndex =
    (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedData = wards.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-full bg-transparent p-1 flex flex-col gap-4 sm:gap-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#343C6A]">
            Ward Management
          </h1>

          <p className="text-[#8BA3CB] text-xs sm:text-sm mt-1">
            Manage all hospital wards, their
            capacity and occupancy.
          </p>
        </div>

        <Button
          onClick={handleOpenAddModal}
          className="bg-[#521785] text-white flex items-center justify-center gap-1 w-full sm:w-auto px-4 py-2 shrink-0"
        >
          <Plus size={16} />
          Add Ward
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat, index) => {
          const IconComp =
            statIcons[index].icon;

          return (
            <div
              key={index}
              style={{
                background:
                  statIcons[index].bg,
              }}
              className="rounded-lg p-3 sm:p-4 flex items-center gap-3 min-w-0"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: "#ffffff90",
                }}
              >
                <IconComp
                  size={20}
                  color={
                    statIcons[index].color
                  }
                />
              </div>

              <div className="min-w-0">
                <p className="text-[12px] sm:text-[13px] font-medium text-[#343C6A] truncate">
                  {stat.heading}
                </p>

                <p className="text-xl sm:text-[22px] font-bold text-[#343C6A]">
                  {stat.value}
                </p>

                <p className="text-[11px] text-[#8BA3CB]">
                  {stat.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ward List */}
      <div className="bg-white rounded-lg border border-[#e5e5e5] flex flex-col overflow-hidden">
        
        {/* Table Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 p-3 sm:p-4">
          <h2 className="text-base sm:text-lg font-semibold text-[#343C6A]">
            Ward List
          </h2>

          <div className="flex flex-col xs:flex-row sm:flex-row gap-2 w-full md:w-auto">
            
            <div className="flex items-center border border-[#d3cccc] rounded-md px-3 py-2 gap-2 w-full md:w-auto">
              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search ward..."
                className="outline-none text-[13px] sm:text-[14px] w-full md:w-[180px] min-w-0"
              />

              <Search
                size={16}
                className="text-gray-400 shrink-0"
              />
            </div>

            <Button className="border border-[#d3cccc] flex items-center justify-center gap-1 bg-white text-[#343C6A] w-full xs:w-auto sm:w-auto">
              <Filter size={14} />
              Filter
            </Button>
          </div>
        </div>

        {/* Desktop and Laptop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <TableComponent
            columns={columns}
            data={paginatedData}
            loading={loading}
            actions={(item) => (
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() =>
                    handleEditClick(item)
                  }
                  className="p-1.5 rounded-md border border-[#d9d0f7] text-[#7C3AED]"
                >
                  <Pencil size={15} />
                </button>

                <button
                  onClick={() =>
                    handleDeleteWard(item)
                  }
                  className="p-1.5 rounded-md border border-[#fbd5d5] text-[#EF4444]"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            )}
            actionLabel="Actions"
          />
        </div>


        {/* Mobile and Tablet Cards */}
        <div className="lg:hidden flex flex-col gap-3 p-3 sm:p-4">
          
          {loading ? (
            <div className="py-8 text-center text-[13px] text-[#8BA3CB]">
              Loading wards...
            </div>
          ) : paginatedData.length === 0 ? (
            <div className="py-8 text-center text-[13px] text-[#8BA3CB]">
              No wards found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {paginatedData.map((ward) => {
                return (
                  <div
                    key={ward.id}
                    className="border border-[#e5e5e5] rounded-lg p-4 flex flex-col gap-4"
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] text-[#8BA3CB] mb-1">
                          Ward Name
                        </p>

                        <h3 className="text-base font-semibold text-[#343C6A] break-words">
                          {ward.wardName}
                        </h3>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleEditClick(ward)}
                          className="w-9 h-9 flex items-center justify-center rounded-md border border-[#d9d0f7] text-[#7C3AED]"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          onClick={() => handleDeleteWard(ward)}
                          className="w-9 h-9 flex items-center justify-center rounded-md border border-[#fbd5d5] text-[#EF4444]"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Ward Information */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-4">

                      {/* Location */}
                      <div>
                        <p className="text-[11px] text-[#8BA3CB]">
                          Type
                        </p>

                        <p className="text-[13px] font-semibold text-[#343C6A] mt-1 break-words">
                          {ward.wardType || "-"}
                        </p>
                      </div>

                      {/* Location */}
                      <div>
                        <p className="text-[11px] text-[#8BA3CB]">
                          Location
                        </p>

                        <p className="text-[13px] font-semibold text-[#343C6A] mt-1 break-words">
                          {ward.location || "-"}
                        </p>
                      </div>

                      {/* Room Capacity */}
                      <div>
                        <p className="text-[11px] text-[#8BA3CB]">
                          Room Capacity
                        </p>

                        <p className="text-[13px] font-semibold text-[#343C6A] mt-1">
                          {ward.capacity ?? 0}
                        </p>
                      </div>

                      {/* Room Available */}
                      <div>
                        <p className="text-[11px] text-[#8BA3CB]">
                          Room Available
                        </p>

                        <p className="text-[13px] font-semibold text-[#16A34A] mt-1">
                          {ward.availableRooms}
                        </p>
                      </div>

                      {/* Total Beds */}
                      <div>
                        <p className="text-[11px] text-[#8BA3CB]">
                          Total Beds
                        </p>

                        <p className="text-[13px] font-semibold text-[#343C6A] mt-1">
                          {ward.totalBeds ?? 0}
                        </p>
                      </div>

                     
                    </div>

                    {/* Room Occupancy Progress */}
                    <div className="border-t border-[#f1f1f1] pt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[12px] text-[#8BA3CB]">
                          Room Occupancy
                        </span>

                        <span className="text-[12px] font-semibold text-[#343C6A]">
                          {ward.capacity
                            ? Math.round(
                                (ward.availableRooms / ward.capacity) * 100
                              )
                            : 0}
                          %
                        </span>
                      </div>

                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${
                              ward.capacity
                                ? Math.round(
                                    (ward.availableRooms / ward.capacity) * 100
                                  )
                                : 0
                            }%`,
                            backgroundColor: getOccupancyColor(
                              ward.capacity
                                ? Math.round(
                                    (ward.availableRooms / ward.capacity) * 100
                                  )
                                : 0
                            ),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-3 sm:p-4 border-t border-[#F1EDF8]">
          <span className="text-[12px] sm:text-[13px] text-[#8BA3CB] text-center sm:text-left">
            Showing{" "}
            {wards.length === 0
              ? 0
              : startIndex + 1}{" "}
            to{" "}
            {Math.min(
              startIndex + ITEMS_PER_PAGE,
              wards.length
            )}{" "}
            of {wards.length} wards
          </span>

          {wards.length > 0 && (
            <div className="flex justify-center sm:justify-end">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                goToPage={goToPage}
              />
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start sm:items-center gap-2 bg-[#EEF2FF] text-[#4338CA] text-[12px] sm:text-[13px] p-3 rounded-lg">
        <Info
          size={16}
          className="shrink-0 mt-0.5 sm:mt-0"
        />

        <span>
          Ward occupancy is calculated in
          real-time. Click on a ward to view
          more details.
        </span>
      </div>

      {/* Add/Edit Ward Modal */}
      <AddWardModal
        isOpen={isAddWardOpen}
        onClose={handleModalClose}
        onAdd={handleAddWard}
        onUpdate={handleUpdateWard}
        editingWard={editingWard}
      />

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:px-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center gap-3 border-b px-4 sm:px-5 py-4">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-red-100 shrink-0">
                <Trash2
                  size={20}
                  className="text-red-500"
                />
              </div>

              <div>
                <h2 className="text-base sm:text-lg font-semibold text-[#343C6A]">
                  Delete Ward
                </h2>

                <p className="text-xs sm:text-sm text-gray-500">
                  Confirmation required
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="px-4 sm:px-5 py-5">
              <p className="text-[13px] sm:text-[14px] leading-6 text-gray-600">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-[#343C6A] break-words">
                  {deletingWard?.wardName}
                </span>
                ?
              </p>

              <p className="mt-2 text-[12px] sm:text-[13px] text-gray-500">
                This action cannot be undone.
              </p>
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse xs:flex-row justify-end gap-2 sm:gap-3 border-t px-4 sm:px-5 py-4">
              <button
                type="button"
                onClick={handleDeleteModalClose}
                disabled={deleteLoading}
                className="w-full xs:w-auto rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDeleteWard}
                disabled={deleteLoading}
                className="w-full xs:w-auto rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteLoading
                  ? "Deleting..."
                  : "Delete Ward"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WardManagement;









// import React, { useEffect, useState, useCallback } from "react";
// import { toast } from "react-toastify";
// import {
//   Building2,
//   BedDouble,
//   Bed as BedIcon,
//   UserRound,
//   Plus,
//   Search,
//   Filter,
//   Pencil,
//   Trash2,
//   Info,
// } from "lucide-react";
// import TableComponent from "../../commonComponent/TableComponent";
// import Button from "../../commonComponent/Button";
// import AddWardModal from "../../modal/IPD/addWard";
// import { wardService } from "../../services/wardService";
// import Pagination from "../../commonComponent/Pagination";
// import { usePagination } from "../../hooks/usePagination";

// const ITEMS_PER_PAGE = 10;

// const statIcons = [
//   { icon: Building2, bg: "#F3E8FF", color: "#9333EA" },
//   { icon: BedDouble, bg: "#E0F2FE", color: "#2563EB" },
//   { icon: BedIcon, bg: "#DCFCE7", color: "#16A34A" },
//   { icon: UserRound, bg: "#FFEDD5", color: "#EA580C" },
// ];

// const getOccupancyColor = (percent) => {
//   if (percent >= 80) return "#EF4444";
//   if (percent >= 70) return "#F97316";
//   return "#F97316";
// };

// const WardManagement = () => {
//   const [search, setSearch] = useState("");
//   const [wards, setWards] = useState([]);
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [isAddWardOpen, setIsAddWardOpen] = useState(false);
//   const [editingWard, setEditingWard] = useState(null);
//   const { currentPage, totalPages, goToPage, setTotalPages } = usePagination();

// const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
// const [deletingWard, setDeletingWard] = useState(null);
// const [deleteLoading, setDeleteLoading] = useState(false);

//   useEffect(() => {
//     setTotalPages(Math.ceil(wards.length / ITEMS_PER_PAGE) || 1);
//   }, [wards, setTotalPages]);

//   useEffect(() => {
//     goToPage(1);
//   }, [search, goToPage]);

//   const fetchWards = useCallback(async (searchTerm) => {
//     setLoading(true);
//     try {
//       const data = await wardService.getWards({ searchTerm });
//       setWards(data.wards || []);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const fetchStats = useCallback(async () => {
//     try {
//       const data = await wardService.getWardStats();
//       setStats(data.stats || null);
//     } catch (error) {
//       console.error(error);
//     }
//   }, []);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fetchWards(search);
//     }, 300);
//     return () => clearTimeout(timer);
//   }, [search, fetchWards]);

//   useEffect(() => {
//     fetchStats();
//   }, [fetchStats]);

//   const handleAddWard = async (newWard) => {
//     await wardService.createWard(newWard);
//     await Promise.all([fetchWards(search), fetchStats()]);
//   };

//   const handleUpdateWard = async (id, updatedWard) => {
//     await wardService.updateWard(id, updatedWard);
//     await Promise.all([fetchWards(search), fetchStats()]);
//   };

//   const handleEditClick = (ward) => {
//     setEditingWard(ward);
//     setIsAddWardOpen(true);
//   };

// const handleDeleteWard = (ward) => {
//   setDeletingWard(ward);
//   setIsDeleteModalOpen(true);
// };


// const confirmDeleteWard = async () => {
//   if (!deletingWard?.id) return;

//   try {
//     setDeleteLoading(true);

//     await wardService.deleteWard(deletingWard.id);

//     await Promise.all([
//       fetchWards(search),
//       fetchStats(),
//     ]);

//     setIsDeleteModalOpen(false);
//     setDeletingWard(null);

//     // Success toast
//     toast.success("Ward deleted successfully");
//   } catch (error) {
//     console.error("Error deleting ward:", error);

//     const message =
//       error?.response?.data?.message ||
//       error?.response?.data?.error ||
//       "Failed to delete ward";

//     // Show backend error to user
//     toast.error(message);
//   } finally {
//     setDeleteLoading(false);
//   }
// };

// const handleDeleteModalClose = () => {
//   if (deleteLoading) return;

//   setIsDeleteModalOpen(false);
//   setDeletingWard(null);
// };

//   const handleOpenAddModal = () => {
//     setEditingWard(null);
//     setIsAddWardOpen(true);
//   };

//   const handleModalClose = () => {
//     setIsAddWardOpen(false);
//     setEditingWard(null);
//   };

//   const statCards = stats
//     ? [
//         { heading: "Total Wards", value: stats.totalWards, subtext: "Across hospital" },
//         { heading: "Total Capacity", value: stats.totalCapacity, subtext: "Total beds" },
//         { heading: "Available Beds", value: stats.availableBeds, subtext: "Ready for use" },
//         { heading: "Occupied Beds", value: stats.occupiedBeds, subtext: "Currently in use" },
//       ]
//     : [];

//   const columns = [
//     {
//       label: "Ward Name",
//       field: "wardName",
//       headerClassName: "text-left pl-4",
//       className: "pl-4 py-3",
//     },
//     {
//       label: "Location",
//       field: "location",
//       headerClassName: "text-left",
//       className: "py-3",
//     },
//     {
//       label: "Ward Capacity",
//       field: "capacity",
//       headerClassName: "text-left",
//       className: "py-3",
//     },
//     {
//       label: "Available Beds",
//       field: "availableBeds",
//       headerClassName: "text-left",
//       className: "py-3 text-[#16A34A] font-semibold",
//     },
//     {
//       label: "Occupied Beds",
//       field: "occupiedBeds",
//       headerClassName: "text-left",
//       className: "py-3 text-[#EA580C] font-semibold",
//     },
//     {
//       label: "Occupancy %",
//       headerClassName: "text-left",
//       className: "py-3 w-[180px]",
//       render: (item) => {
//         const percent = item.capacity
//           ? Math.round((item.occupiedBeds / item.capacity) * 100)
//           : 0;
//         return (
//           <div className="flex flex-col gap-1">
//             <span className="text-[13px] font-medium">{percent}%</span>
//             <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
//               <div
//                 className="h-full rounded-full"
//                 style={{
//                   width: `${percent}%`,
//                   backgroundColor: getOccupancyColor(percent),
//                 }}
//               />
//             </div>
//           </div>
//         );
//       },
//     },
//   ];

//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const paginatedData = wards.slice(startIndex, startIndex + ITEMS_PER_PAGE);

//   return (
//     <div className="h-full bg-transparent p-6 flex flex-col gap-4">
//       <div className="flex justify-between items-start">
//         <div>
//           <h1 className="text-2xl font-semibold text-[#343C6A]">
//             Ward Management
//           </h1>
//           <p className="text-[#8BA3CB] text-sm mt-1">
//             Manage all hospital wards, their capacity and occupancy.
//           </p>
//         </div>
//         <Button
//           onClick={handleOpenAddModal}
//           className="bg-[#521785] text-white flex items-center justify-center gap-1 w-auto px-4 py-2"
//         >
//           <Plus size={16} />
//           Add Ward
//         </Button>
//       </div>

//       <div className="flex w-full justify-between gap-3">
//         {statCards.map((stat, index) => {
//           const IconComp = statIcons[index].icon;
//           return (
//             <div
//               key={index}
//               style={{ background: statIcons[index].bg }}
//               className="w-[24%] rounded-lg p-4 flex items-center gap-3"
//             >
//               <div
//                 className="w-10 h-10 rounded-full flex items-center justify-center"
//                 style={{ background: "#ffffff90" }}
//               >
//                 <IconComp size={20} color={statIcons[index].color} />
//               </div>
//               <div>
//                 <p className="text-[13px] font-medium text-[#343C6A]">
//                   {stat.heading}
//                 </p>
//                 <p className="text-[22px] font-bold text-[#343C6A]">
//                   {stat.value}
//                 </p>
//                 <p className="text-[11px] text-[#8BA3CB]">{stat.subtext}</p>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <div className="bg-white rounded-lg border border-[#e5e5e5] flex flex-col">
//         <div className="flex justify-between items-center p-4">
//           <h2 className="text-lg font-semibold text-[#343C6A]">Ward List</h2>
//           <div className="flex gap-2">
//             <div className="flex items-center border border-[#d3cccc] rounded-md px-3 py-1.5 gap-2">
//               <input
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search ward..."
//                 className="outline-none text-[14px] w-[180px]"
//               />
//               <Search size={16} className="text-gray-400" />
//             </div>
//             <Button className="border border-[#d3cccc] flex items-center justify-center gap-1 bg-white text-[#343C6A]">
//               <Filter size={14} />
//               Filter
//             </Button>
//           </div>
//         </div>

//         <TableComponent
//           columns={columns}
//           data={paginatedData}
//           loading={loading}
//           actions={(item) => (
//             <div className="flex gap-2 justify-center">
//               <button
//                 onClick={() => handleEditClick(item)}
//                 className="p-1.5 rounded-md border border-[#d9d0f7] text-[#7C3AED]"
//               >
//                 <Pencil size={15} />
//               </button>
//               <button
//                onClick={() => handleDeleteWard(item)}
//                 className="p-1.5 rounded-md border border-[#fbd5d5] text-[#EF4444]"
//               >
//                 <Trash2 size={15} />
//               </button>
//             </div>
//           )}
//           actionLabel="Actions"
//         />

//         <div className="flex justify-between items-center p-4">
//           <span className="text-[13px] text-[#8BA3CB]">
//             Showing {wards.length === 0 ? 0 : startIndex + 1} to{" "}
//             {Math.min(startIndex + ITEMS_PER_PAGE, wards.length)} of{" "}
//             {wards.length} wards
//           </span>
//           {wards.length > 0 && (
//             <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               goToPage={goToPage}
//             />
//           )}
//         </div>
//       </div>

//       <div className="flex items-center gap-2 bg-[#EEF2FF] text-[#4338CA] text-[13px] p-3 rounded-lg">
//         <Info size={16} />
//         Ward occupancy is calculated in real-time. Click on a ward to view
//         more details.
//       </div>

//       <AddWardModal
//         isOpen={isAddWardOpen}
//         onClose={handleModalClose}
//         onAdd={handleAddWard}
//         onUpdate={handleUpdateWard}
//         editingWard={editingWard}
//       />

//       {isDeleteModalOpen && (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
//     <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
      
//       {/* Header */}
//       <div className="flex items-center gap-3 border-b px-5 py-4">
//         <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
//           <Trash2 size={20} className="text-red-500" />
//         </div>

//         <div>
//           <h2 className="text-lg font-semibold text-[#343C6A]">
//             Delete Ward
//           </h2>
//           <p className="text-sm text-gray-500">
//             Confirmation required
//           </p>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="px-5 py-5">
//         <p className="text-[14px] leading-6 text-gray-600">
//           Are you sure you want to delete{" "}
//           <span className="font-semibold text-[#343C6A]">
//           {deletingWard?.wardName}
//           </span>
//           ?
//         </p>

//         <p className="mt-2 text-[13px] text-gray-500">
//           This action cannot be undone.
//         </p>
//       </div>

//       {/* Footer */}
//       <div className="flex justify-end gap-3 border-t px-5 py-4">
//         <button
//           type="button"
//           onClick={handleDeleteModalClose}
//           disabled={deleteLoading}
//           className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
//         >
//           Cancel
//         </button>

//        <button
//   type="button"
//   onClick={confirmDeleteWard}
//   disabled={deleteLoading}
//   className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
// >
//   {deleteLoading ? "Deleting..." : "Delete Ward"}
// </button>
//       </div>
//     </div>
//   </div>
// )}
//     </div>
//   );
// };

// export default WardManagement;