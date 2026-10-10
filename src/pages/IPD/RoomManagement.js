import React, { useEffect, useState, useCallback } from "react";
import DeleteConfirmationModal from "../../modal/IPD/DeleteConfirmationModal";
import { toast } from "react-toastify";
import {
DoorOpen,
BedDouble,
Bed as BedIcon,
UserRound,
Plus,
Search,
Filter,
Pencil,
Trash2,
Info,
ChevronDown,
} from "lucide-react";
import TableComponent from "../../commonComponent/TableComponent";
import Button from "../../commonComponent/Button";
import AddRoomModal from "../../modal/IPD/addRoom";
import { roomService } from "../../services/roomService";
import { wardService } from "../../services/wardService";
import Pagination from "../../commonComponent/Pagination";
import { usePagination } from "../../hooks/usePagination";

const ITEMS_PER_PAGE = 10;

const statIcons = [
{ icon: DoorOpen, bg: "#F3E8FF", color: "#9333EA" },
{ icon: BedDouble, bg: "#E0F2FE", color: "#2563EB" },
{ icon: BedIcon, bg: "#DCFCE7", color: "#16A34A" },
{ icon: UserRound, bg: "#FFEDD5", color: "#EA580C" },
];

const getOccupancyColor = (percent) => {
if (percent >= 80) return "#EF4444";
if (percent >= 70) return "#F97316";
return "#F97316";
};

const RoomManagement = () => {
const [search, setSearch] = useState("");
const [selectedWard, setSelectedWard] = useState("All Wards");
const [rooms, setRooms] = useState([]);
const [wards, setWards] = useState([]);
const [stats, setStats] = useState(null);
const [loading, setLoading] = useState(false);

const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
const [editingRoom, setEditingRoom] = useState(null);

const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [roomToDelete, setRoomToDelete] = useState(null);
const [deleteLoading, setDeleteLoading] = useState(false);

const { currentPage, totalPages, goToPage, setTotalPages } =
usePagination();

useEffect(() => {
setTotalPages(Math.ceil(rooms.length / ITEMS_PER_PAGE) || 1);
}, [rooms, setTotalPages]);

useEffect(() => {
goToPage(1);
}, [search, selectedWard, goToPage]);

const wardOptions = ["All Wards", ...wards.map((w) => w.wardName)];

const fetchWards = useCallback(async () => {
try {
const data = await wardService.getWards();
setWards(data.wards || []);
} catch (error) {
console.error(error);
}
}, []);

const fetchRooms = useCallback(async (searchTerm, wardName) => {
  setLoading(true);


  try {
    const data = await roomService.getRooms({
      searchTerm,
      wardName,
    });

    setRooms(data.rooms || []);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }


}, []);

const fetchStats = useCallback(async () => {
  try {
  const data = await roomService.getRoomStats();
  setStats(data.stats || null);
  } catch (error) {
  console.error(error);
  }
}, []);

useEffect(() => {
  fetchWards();
  fetchStats();
}, [fetchWards, fetchStats]);

useEffect(() => {
  const timer = setTimeout(() => {
  fetchRooms(search, selectedWard);
  }, 300);


  return () => clearTimeout(timer);

}, [search, selectedWard, fetchRooms]);

const handleAddRoom = async (newRoom) => {
  try{
    const res=await roomService.createRoom(newRoom);
    toast.success(res?.message || "Room Added successfully..")
    await Promise.all([
      fetchRooms(search, selectedWard),
      fetchStats(),
    ]);
  } catch(error){
    console.error("error:", error);
    
    toast.error(
        error?.response?.data?.message ||
          "Failed to add room"
    );
  }

};

const handleUpdateRoom = async (id, updatedRoom) => {
  try{
    const res = await roomService.updateRoom(id, updatedRoom);
    toast.success(res?.message || "Room updated successfully..");

    await Promise.all([
      fetchRooms(search, selectedWard),
      fetchStats(),
    ]);
  } catch(error){
    console.error("error:", error);
    
    toast.error(
        error?.response?.data?.message ||
          "Failed to update room"
    );
  }

};

const handleEditClick = (room) => {
  setEditingRoom(room);
  setIsAddRoomOpen(true);
};

const handleDeleteClick = (room) => {
  setRoomToDelete(room);
  setIsDeleteModalOpen(true);
};

const handleConfirmDelete = async () => {
  if (!roomToDelete) return;

  try {
    setDeleteLoading(true);

    const res=await roomService.deleteRoom(roomToDelete.id);
    console.log(res?.message || "Room deleted successfully..");
    
    await Promise.all([
      fetchRooms(search, selectedWard),
      fetchStats(),
    ]);

    setIsDeleteModalOpen(false);
    setRoomToDelete(null);

    toast.success("Room deleted successfully");
  } catch (error) {
    console.error("Error deleting room:", error);

    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Failed to delete room";

    toast.error(message);
  } finally {
    setDeleteLoading(false);
  }

};

const handleCloseDeleteModal = () => {
if (deleteLoading) return;


setIsDeleteModalOpen(false);
setRoomToDelete(null);


};

const handleOpenAddModal = () => {
setEditingRoom(null);
setIsAddRoomOpen(true);
};

const handleModalClose = () => {
  setIsAddRoomOpen(false);
  setEditingRoom(null);
};

const statCards = stats
? [
{
heading: "Total Rooms",
value: stats.totalRooms,
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
label: "Room Number",
field: "roomNumber",
headerClassName: "text-left pl-4",
className: "pl-4 py-3",
},
{
label: "Ward Name",
field: "wardName",
headerClassName: "text-left",
className: "py-3",
},
{
label: "Room Type",
field: "roomType",
headerClassName: "text-left",
className: "py-3",
},
{
label: "Capacity",
field: "capacity",
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
{
label: "Available Beds",
field: "availableBeds",
headerClassName: "text-left",
className: "py-3 font-semibold",
render: (item) => (
<span
className="font-semibold"
style={{
color:
item.availableBeds === 0 ? "#EF4444" : "#16A34A",
}}
>
{item.availableBeds} </span>
),
},
{
label: "Occupied Beds",
field: "occupiedBeds",
headerClassName: "text-left",
className: "py-3 font-semibold",
render: (item) => (
<span
className="font-semibold"
style={{
color:
item.occupiedBeds === 0 ? "#16A34A" : "#EA580C",
}}
>
{item.occupiedBeds} </span>
),
},
{
label: "Occupancy %",
headerClassName: "text-left",
className: "py-3 w-[180px]",
render: (item) => {
const percent = item.occupiedBeds
? Math.round(
(item.occupiedBeds / item.totalBeds) * 100
)
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
              backgroundColor: getOccupancyColor(percent),
            }}
          />
        </div>
      </div>
    );
  },
},


];

const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

const paginatedData = rooms.slice(
startIndex,
startIndex + ITEMS_PER_PAGE
);

return ( <div className="h-full bg-transparent p-1 flex flex-col gap-4">


  {/* Page Header */}
  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

    <div className="min-w-0">
      <h1 className="text-xl sm:text-2xl font-semibold text-[#343C6A]">
        Room Management
      </h1>

      <p className="text-[#8BA3CB] text-xs sm:text-sm mt-1">
        Manage rooms under wards and track availability.
      </p>
    </div>

    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      <div className="relative w-full sm:w-auto">
        <select
          value={selectedWard}
          onChange={(e) =>
            setSelectedWard(e.target.value)
          }
          className="appearance-none w-full sm:w-auto border border-[#d3cccc] rounded-md pl-3 pr-8 py-2 text-[14px] text-[#343C6A] bg-white outline-none"
        >
          {wardOptions.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>

        <ChevronDown
          size={14}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>

      <Button
        onClick={handleOpenAddModal}
        className="bg-[#521785] text-white flex items-center justify-center gap-1 w-full sm:w-auto px-4 py-2"
      >
        <Plus size={16} />
        Add Room
      </Button>
    </div>
  </div>

  {/* Statistics */}
  <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3">
    {statCards.map((stat, index) => {
      const IconComp = statIcons[index].icon;

      return (
        <div
          key={index}
          style={{
            background: statIcons[index].bg,
          }}
          className="rounded-lg p-3 sm:p-4 flex items-center gap-3 min-w-0"
        >
          <div
            className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center"
            style={{
              background: "#ffffff90",
            }}
          >
            <IconComp
              size={20}
              color={statIcons[index].color}
            />
          </div>

          <div className="min-w-0">
            <p className="text-[12px] sm:text-[13px] font-medium text-[#343C6A] truncate">
              {stat.heading}
            </p>

            <p className="text-[20px] sm:text-[22px] font-bold text-[#343C6A]">
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

  {/* Room List */}
  <div className="bg-white rounded-lg border border-[#e5e5e5] flex flex-col">

    {/* Search and Filters */}
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center p-3 sm:p-4 gap-3">

      <div className="relative w-full lg:w-[180px]">
        <select
          value={selectedWard}
          onChange={(e) =>
            setSelectedWard(e.target.value)
          }
          className="appearance-none w-full border border-[#d3cccc] rounded-md pl-3 pr-8 py-2 text-[14px] text-[#343C6A] bg-white outline-none"
        >
          {wardOptions.map((w) => (
            <option key={w} value={w}>
              {w === "All Wards"
                ? "Select Ward"
                : w}
            </option>
          ))}
        </select>

        <ChevronDown
          size={14}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full lg:flex-1 lg:justify-end">

        <div className="flex items-center border border-[#d3cccc] rounded-md px-3 py-2 gap-2 w-full lg:max-w-md">
          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search room number or type..."
            className="outline-none text-[14px] w-full min-w-0"
          />

          <Search
            size={16}
            className="text-gray-400 shrink-0"
          />
        </div>

        <Button className="border border-[#d3cccc] flex items-center justify-center gap-1 bg-white text-[#343C6A] w-full sm:w-auto">
          <Filter size={14} />
          Filter
        </Button>
      </div>
    </div>

    {/* Desktop and Laptop Table */}
    <div className="hidden lg:block">
      <TableComponent
        columns={columns}
        data={paginatedData}
        loading={loading}
        actions={(item) => (
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => handleEditClick(item)}
              className="p-1.5 rounded-md border border-[#d9d0f7] text-[#7C3AED]"
            >
              <Pencil size={15} />
            </button>

            <button
              onClick={() => handleDeleteClick(item)}
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
    <div className="lg:hidden p-3 sm:p-4 border-t border-[#e5e5e5]">

      {loading ? (
        <div className="py-10 text-center text-sm text-[#8BA3CB]">
          Loading rooms...
        </div>
      ) : paginatedData.length === 0 ? (
        <div className="py-10 text-center text-sm text-[#8BA3CB]">
          No rooms found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">

          {paginatedData.map((room) => {
            const percent = room.occupiedBeds
              ? Math.round(
                  (room.occupiedBeds / room.totalBeds) *
                    100
                )
              : 0;

            return (
              <div
                key={room.id}
                className="border border-[#e5e5e5] rounded-lg p-4 flex flex-col gap-4"
              >

                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">

                  <div className="min-w-0">
                    <p className="text-[11px] text-[#8BA3CB] mb-1">
                      Room Number
                    </p>

                    <h3 className="text-base font-semibold text-[#343C6A] break-words">
                      {room.roomNumber}
                    </h3>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() =>
                        handleEditClick(room)
                      }
                      className="w-9 h-9 flex items-center justify-center rounded-md border border-[#d9d0f7] text-[#7C3AED]"
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteClick(room)
                      }
                      className="w-9 h-9 flex items-center justify-center rounded-md border border-[#fbd5d5] text-[#EF4444]"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Room Information */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-4">

                  <div>
                    <p className="text-[11px] text-[#8BA3CB]">
                      Ward Name
                    </p>

                    <p className="text-[13px] font-semibold text-[#343C6A] mt-1 break-words">
                      {room.wardName || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-[#8BA3CB]">
                      Room Type
                    </p>

                    <p className="text-[13px] font-semibold text-[#343C6A] mt-1 break-words">
                      {room.roomType || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-[#8BA3CB]">
                      Capacity
                    </p>

                    <p className="text-[13px] font-semibold text-[#343C6A] mt-1">
                      {room.capacity}
                    </p>
                  </div>

                  <div>
                      <p className="text-[11px] text-[#8BA3CB]">
                        Total Beds
                      </p>

                      <p className="text-[13px] font-semibold text-[#343C6A] mt-1">
                        {room.totalBeds ?? 0}
                      </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-[#8BA3CB]">
                      Available Beds
                    </p>

                    <p
                      className="text-[13px] font-semibold mt-1"
                      style={{
                        color:
                          room.availableBeds === 0
                            ? "#EF4444"
                            : "#16A34A",
                      }}
                    >
                      {room.availableBeds}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-[#8BA3CB]">
                      Occupied Beds
                    </p>

                    <p
                      className="text-[13px] font-semibold mt-1"
                      style={{
                        color:
                          room.occupiedBeds === 0
                            ? "#16A34A"
                            : "#EA580C",
                      }}
                    >
                      {room.occupiedBeds}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-[#8BA3CB]">
                      Occupancy
                    </p>

                    <p className="text-[13px] font-semibold text-[#343C6A] mt-1">
                      {percent}%
                    </p>
                  </div>
                </div>

                {/* Occupancy Progress */}
                <div className="border-t border-[#f1f1f1] pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] text-[#8BA3CB]">
                      Bed Occupancy
                    </span>

                    <span className="text-[12px] font-semibold text-[#343C6A]">
                      {percent}%
                    </span>
                  </div>

                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${percent}%`,
                        backgroundColor:
                          getOccupancyColor(percent),
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
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-3 sm:p-4 border-t border-[#e5e5e5]">

      <span className="text-[12px] sm:text-[13px] text-[#8BA3CB]">
        Showing{" "}
        {rooms.length === 0
          ? 0
          : startIndex + 1}{" "}
        to{" "}
        {Math.min(
          startIndex + ITEMS_PER_PAGE,
          rooms.length
        )}{" "}
        of {rooms.length} rooms
      </span>

      {rooms.length > 0 && (
        <div className="w-full sm:w-auto overflow-x-auto">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            goToPage={goToPage}
          />
        </div>
      )}
    </div>
  </div>

  {/* Information Box */}
  <div className="flex items-start sm:items-center gap-2 bg-[#EEF2FF] text-[#4338CA] text-[12px] sm:text-[13px] p-3 rounded-lg">
    <Info
      size={16}
      className="shrink-0 mt-0.5 sm:mt-0"
    />

    <span>
      Rooms are grouped under wards. Manage beds from the{" "}
      <span className="font-semibold">Beds</span> section.
    </span>
  </div>

  <AddRoomModal
    isOpen={isAddRoomOpen}
    onClose={handleModalClose}
    onAdd={handleAddRoom}
    onUpdate={handleUpdateRoom}
    editingRoom={editingRoom}
    wardChoices={wards.map((w) => w.wardName)}
  />

  <DeleteConfirmationModal
    isOpen={isDeleteModalOpen}
    onClose={handleCloseDeleteModal}
    onConfirm={handleConfirmDelete}
    title="Delete Room"
    message={
      roomToDelete
        ? `Are you sure you want to delete room "${roomToDelete.roomNumber}"? This action cannot be undone.`
        : "Are you sure you want to delete this room?"
    }
    loading={deleteLoading}
  />
</div>


);
};

export default RoomManagement;













// import React, { useEffect, useState, useCallback } from "react";
// import DeleteConfirmationModal from "../../modal/IPD/DeleteConfirmationModal";
// import { toast } from "react-toastify";
// import {
//   DoorOpen,
//   BedDouble,
//   Bed as BedIcon,
//   UserRound,
//   Plus,
//   Search,
//   Filter,
//   Pencil,
//   Trash2,
//   Info,
//   ChevronDown,
// } from "lucide-react";
// import TableComponent from "../../commonComponent/TableComponent";
// import Button from "../../commonComponent/Button";
// import AddRoomModal from "../../modal/IPD/addRoom";
// import { roomService } from "../../services/roomService";
// import { wardService } from "../../services/wardService";
// import Pagination from "../../commonComponent/Pagination";
// import { usePagination } from "../../hooks/usePagination";

// const ITEMS_PER_PAGE = 10;

// const statIcons = [
//   { icon: DoorOpen, bg: "#F3E8FF", color: "#9333EA" },
//   { icon: BedDouble, bg: "#E0F2FE", color: "#2563EB" },
//   { icon: BedIcon, bg: "#DCFCE7", color: "#16A34A" },
//   { icon: UserRound, bg: "#FFEDD5", color: "#EA580C" },
// ];

// const getOccupancyColor = (percent) => {
//   if (percent >= 80) return "#EF4444";
//   if (percent >= 70) return "#F97316";
//   return "#F97316";
// };

// const RoomManagement = () => {
//   const [search, setSearch] = useState("");
//   const [selectedWard, setSelectedWard] = useState("All Wards");
//   const [rooms, setRooms] = useState([]);
//   const [wards, setWards] = useState([]);
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(false);

// const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
// const [editingRoom, setEditingRoom] = useState(null);

// const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
// const [roomToDelete, setRoomToDelete] = useState(null);
// const [deleteLoading, setDeleteLoading] = useState(false);

//   const { currentPage, totalPages, goToPage, setTotalPages } = usePagination();

//   useEffect(() => {
//     setTotalPages(Math.ceil(rooms.length / ITEMS_PER_PAGE) || 1);
//   }, [rooms, setTotalPages]);

//   useEffect(() => {
//     goToPage(1);
//   }, [search, selectedWard, goToPage]);

//   const wardOptions = ["All Wards", ...wards.map((w) => w.wardName)];

//   const fetchWards = useCallback(async () => {
//     try {
//       const data = await wardService.getWards();
//       setWards(data.wards || []);
//     } catch (error) {
//       console.error(error);
//     }
//   }, []);

//   const fetchRooms = useCallback(async (searchTerm, wardName) => {
//     setLoading(true);
//     try {
//       const data = await roomService.getRooms({ searchTerm, wardName });
//       setRooms(data.rooms || []);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const fetchStats = useCallback(async () => {
//     try {
//       const data = await roomService.getRoomStats();
//       setStats(data.stats || null);
//     } catch (error) {
//       console.error(error);
//     }
//   }, []);

//   useEffect(() => {
//     fetchWards();
//     fetchStats();
//   }, [fetchWards, fetchStats]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fetchRooms(search, selectedWard);
//     }, 300);
//     return () => clearTimeout(timer);
//   }, [search, selectedWard, fetchRooms]);

//   const handleAddRoom = async (newRoom) => {
//     await roomService.createRoom(newRoom);
//     await Promise.all([fetchRooms(search, selectedWard), fetchStats()]);
//   };

//   const handleUpdateRoom = async (id, updatedRoom) => {
//     await roomService.updateRoom(id, updatedRoom);
//     await Promise.all([fetchRooms(search, selectedWard), fetchStats()]);
//   };

//   const handleEditClick = (room) => {
//     setEditingRoom(room);
//     setIsAddRoomOpen(true);
//   };

// const handleDeleteClick = (room) => {
//   setRoomToDelete(room);
//   setIsDeleteModalOpen(true);
// };

// const handleConfirmDelete = async () => {
//   if (!roomToDelete) return;

//   try {
//     setDeleteLoading(true);

//     await roomService.deleteRoom(roomToDelete.id);

//     await Promise.all([
//       fetchRooms(search, selectedWard),
//       fetchStats(),
//     ]);

//     setIsDeleteModalOpen(false);
//     setRoomToDelete(null);

//     toast.success("Room deleted successfully");
//   } catch (error) {
//     console.error("Error deleting room:", error);

//     const message =
//       error?.response?.data?.message ||
//       error?.response?.data?.error ||
//       "Failed to delete room";

//     toast.error(message);
//   } finally {
//     setDeleteLoading(false);
//   }
// };

// const handleCloseDeleteModal = () => {
//   if (deleteLoading) return;

//   setIsDeleteModalOpen(false);
//   setRoomToDelete(null);
// };

//   const handleOpenAddModal = () => {
//     setEditingRoom(null);
//     setIsAddRoomOpen(true);
//   };

//   const handleModalClose = () => {
//     setIsAddRoomOpen(false);
//     setEditingRoom(null);
//   };

//   const statCards = stats
//     ? [
//         { heading: "Total Rooms", value: stats.totalRooms, subtext: "Across hospital" },
//         { heading: "Total Capacity", value: stats.totalCapacity, subtext: "Total beds" },
//         { heading: "Available Beds", value: stats.availableBeds, subtext: "Ready for use" },
//         { heading: "Occupied Beds", value: stats.occupiedBeds, subtext: "Currently in use" },
//       ]
//     : [];

//   const columns = [
//     {
//       label: "Room Number",
//       field: "roomNumber",
//       headerClassName: "text-left pl-4",
//       className: "pl-4 py-3",
//     },
//     {
//       label: "Ward Name",
//       field: "wardName",
//       headerClassName: "text-left",
//       className: "py-3",
//     },
//     {
//       label: "Room Type",
//       field: "roomType",
//       headerClassName: "text-left",
//       className: "py-3",
//     },
//     {
//       label: "Capacity",
//       field: "capacity",
//       headerClassName: "text-left",
//       className: "py-3",
//     },
//     {
//       label: "Available Beds",
//       field: "availableBeds",
//       headerClassName: "text-left",
//       className: "py-3 font-semibold",
//       render: (item) => (
//         <span
//           className="font-semibold"
//           style={{ color: item.availableBeds === 0 ? "#EF4444" : "#16A34A" }}
//         >
//           {item.availableBeds}
//         </span>
//       ),
//     },
//     {
//       label: "Occupied Beds",
//       field: "occupiedBeds",
//       headerClassName: "text-left",
//       className: "py-3 font-semibold",
//       render: (item) => (
//         <span
//           className="font-semibold"
//           style={{ color: item.occupiedBeds === 0 ? "#16A34A" : "#EA580C" }}
//         >
//           {item.occupiedBeds}
//         </span>
//       ),
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
//   const paginatedData = rooms.slice(startIndex, startIndex + ITEMS_PER_PAGE);

//   return (
//     <div className="h-full bg-transparent p-6 flex flex-col gap-4">
//       <div className="flex justify-between items-start">
//         <div>
//           <h1 className="text-2xl font-semibold text-[#343C6A]">
//             Room Management
//           </h1>
//           <p className="text-[#8BA3CB] text-sm mt-1">
//             Manage rooms under wards and track availability.
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <div className="relative">
//             <select
//               value={selectedWard}
//               onChange={(e) => setSelectedWard(e.target.value)}
//               className="appearance-none border border-[#d3cccc] rounded-md pl-3 pr-8 py-2 text-[14px] text-[#343C6A] bg-white outline-none"
//             >
//               {wardOptions.map((w) => (
//                 <option key={w} value={w}>
//                   {w}
//                 </option>
//               ))}
//             </select>
//             <ChevronDown
//               size={14}
//               className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//             />
//           </div>
//           <Button
//             onClick={handleOpenAddModal}
//             className="bg-[#521785] text-white flex items-center justify-center gap-1 w-auto px-4 py-2"
//           >
//             <Plus size={16} />
//             Add Room
//           </Button>
//         </div>
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
//         <div className="flex justify-between items-center p-4 gap-3">
//           <div className="relative w-[180px]">
//             <select
//               value={selectedWard}
//               onChange={(e) => setSelectedWard(e.target.value)}
//               className="appearance-none w-full border border-[#d3cccc] rounded-md pl-3 pr-8 py-1.5 text-[14px] text-[#343C6A] bg-white outline-none"
//             >
//               {wardOptions.map((w) => (
//                 <option key={w} value={w}>
//                   {w === "All Wards" ? "Select Ward" : w}
//                 </option>
//               ))}
//             </select>
//             <ChevronDown
//               size={14}
//               className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//             />
//           </div>

//           <div className="flex items-center border border-[#d3cccc] rounded-md px-3 py-1.5 gap-2 flex-1">
//             <input
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search room number or type..."
//               className="outline-none text-[14px] w-full"
//             />
//             <Search size={16} className="text-gray-400" />
//           </div>

//           <Button className="border border-[#d3cccc] flex items-center justify-center gap-1 bg-white text-[#343C6A]">
//             <Filter size={14} />
//             Filter
//           </Button>
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
//              <button
//   onClick={() => handleDeleteClick(item)}
//   className="p-1.5 rounded-md border border-[#fbd5d5] text-[#EF4444]"
// >
//   <Trash2 size={15} />
// </button>
//             </div>
//           )}
//           actionLabel="Actions"
//         />

//         <div className="flex justify-between items-center p-4">
//           <span className="text-[13px] text-[#8BA3CB]">
//             Showing {rooms.length === 0 ? 0 : startIndex + 1} to{" "}
//             {Math.min(startIndex + ITEMS_PER_PAGE, rooms.length)} of{" "}
//             {rooms.length} rooms
//           </span>
//           {rooms.length > 0 && (
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
//         Rooms are grouped under wards. Manage beds from the{" "}
//         <span className="font-semibold">Beds</span> section.
//       </div>

//       <AddRoomModal
//         isOpen={isAddRoomOpen}
//         onClose={handleModalClose}
//         onAdd={handleAddRoom}
//         onUpdate={handleUpdateRoom}
//         editingRoom={editingRoom}
//         wardChoices={wards.map((w) => w.wardName)}
//       />

//       <DeleteConfirmationModal
//   isOpen={isDeleteModalOpen}
//   onClose={handleCloseDeleteModal}
//   onConfirm={handleConfirmDelete}
//   title="Delete Room"
//   message={
//     roomToDelete
//       ? `Are you sure you want to delete room "${roomToDelete.roomNumber}"? This action cannot be undone.`
//       : "Are you sure you want to delete this room?"
//   }
//   loading={deleteLoading}
// />

//     </div>
//   );
// };

// export default RoomManagement;