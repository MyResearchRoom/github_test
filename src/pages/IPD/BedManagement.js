
import React, { useState, useMemo, useEffect, useCallback } from "react";
import DeleteConfirmationModal from "../../modal/IPD/DeleteConfirmationModal";
import { toast } from "react-toastify";
import {
BedDouble,
UserRound,
Wrench,
Plus,
Search,
Filter,
ChevronDown,
ChevronUp,
BedSingle,
Pencil,
Trash2,
} from "lucide-react";
import Button from "../../commonComponent/Button";
import AddBedModal from "../../modal/IPD/addBed";
import AssignPatientModal from "../../modal/IPD/AssignPatientModal";
import ViewBedDetailsModal from "../../modal/IPD/ViewBedDetailsModal";
import { bedService } from "../../services/bedService";
import { ipdService } from "../../services/ipdService";
import { patientService } from "../../services/patientService";
import {
bedTypeFilterOptions,
statusFilterOptions,
} from "../../data/bedData";

const statIcons = [
{ icon: BedDouble, color: "#9333EA" },
{ icon: UserRound, color: "#16A34A" },
{ icon: UserRound, color: "#2563EB" },
{ icon: Wrench, color: "#EA580C" },
];

const statusConfig = {
available: {
label: "Available",
dot: "#22C55E",
iconBg: "#DCFCE7",
iconColor: "#16A34A",
icon: BedSingle,
numberColor: "#7C3AED",
buttonLabel: "Assign Patient",
buttonClass: "border border-[#86EFAC] text-[#16A34A] bg-white",
},
occupied: {
label: "Occupied",
dot: "#521785",
iconBg: "#F3E8FF",
iconColor: "#9333EA",
icon: UserRound,
numberColor: "#7C3AED",
buttonLabel: "View Details",
buttonClass: "border border-[#D9D0F7] text-[#7C3AED] bg-white",
},
maintenance: {
label: "Maintenance",
dot: "#F97316",
iconBg: "#FFEDD5",
iconColor: "#EA580C",
icon: Wrench,
numberColor: "#EA580C",
buttonLabel: "Under Maintenance",
buttonClass: "border border-[#FED7AA] text-[#EA580C] bg-white",
},
discharged: {
label: "Discharged",
dot: "#EF4444",
iconBg: "#FEE2E2",
iconColor: "#EF4444",
icon: UserRound,
numberColor: "#EF4444",
buttonLabel: "View Details",
buttonClass: "border border-[#FBD5D5] text-[#EF4444] bg-white",
},
};

const FilterDropdown = ({ options, value, onChange }) => (

  <div className="relative w-full">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none border border-[#d3cccc] rounded-md pl-3 pr-8 py-2 text-[14px] text-[#343C6A] bg-white outline-none w-full"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>


<ChevronDown
  size={14}
  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
/>


  </div>
);

const WardTabs = ({ options, value, onChange }) => (

  <div className="w-full overflow-x-auto scrollbar-hide">
    <div className="flex items-center gap-2 min-w-max pb-1">
      {options.map((ward) => {
        const isActive = ward === value;


    return (
      <button
        key={ward}
        type="button"
        onClick={() => onChange(ward)}
        className={`px-3 sm:px-4 py-2 rounded-full text-[12px] sm:text-[13px] font-medium border transition-colors whitespace-nowrap ${
          isActive
            ? "bg-white text-[#343C6A] border-[#d3cccc] shadow-sm"
            : "bg-transparent text-[#8BA3CB] border-transparent hover:text-[#343C6A]"
        }`}
      >
        {ward}
      </button>
    );
  })}
</div>


  </div>
);

const BedCard = ({
bed,
wardGroup,
onEdit,
onDelete,
onAssign,
onViewDetails,
}) => {
const config = statusConfig[bed.status];
const StatusIcon = config.icon;

const handleActionClick = () => {
if (bed.status === "available") {
onAssign(bed);
} else {
onViewDetails(bed, wardGroup);
}
};

return ( 

<div className="w-full min-w-0 rounded-xl border border-[#E5E7EB] bg-white p-3">

      {/* Status + Action Buttons */} 
<div className="flex items-center justify-between gap-2 sm:gap-4">

  <span className="flex min-w-0 items-center gap-1 text-[12px] text-[#343C6A]">

<span
className="h-2 w-2 shrink-0 rounded-full"
style={{ background: config.dot }}
/> 

<span className="truncate">{config.label}</span>

 </span>


    <div className="flex shrink-0 items-center gap-1">
      <button
        type="button"
        onClick={() => onEdit(bed)}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-[#d9d0f7] bg-white text-[#7C3AED] transition-colors hover:bg-[#f5f0ff]"
        title="Edit bed"
      >
        <Pencil size={12} />
      </button>

      <button
        type="button"
        onClick={() => onDelete(bed)}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-[#fbd5d5] bg-white text-[#EF4444] transition-colors hover:bg-[#fff1f1]"
        title="Delete bed"
      >
        <Trash2 size={12} />
      </button>
    </div>
  </div>

  {/* Bed Number */}
  <div className="mt-2 flex justify-center">
    <span
      className="max-w-full truncate text-center text-[15px] font-bold leading-5"
      style={{ color: config.numberColor }}
      title={bed.bedCode}
    >
      {bed.bedCode}
    </span>
  </div>

  {/* Bed Information */}
  <div className="mt-4 flex items-center gap-3">
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
      style={{ background: config.iconBg }}
    >
      <StatusIcon size={17} color={config.iconColor} />
    </div>

    <div className="min-w-0 flex-1">
      {bed.status === "occupied" || bed.status === "discharged" ? (
        <>
          <span className="block text-[11px] text-[#8BA3CB]">
            Current Patient
          </span>

          <span
            className="block truncate text-[13px] font-semibold text-[#343C6A]"
            title={bed.patient?.name}
          >
            {bed.patient?.name}
          </span>

          <span className="block truncate text-[11px] text-[#8BA3CB]">
            MRN: {bed.patient?.mrn}
          </span>
        </>
      ) : (
        <>
          <span className="block text-[11px] text-[#8BA3CB]">
            Bed Type
          </span>

          <span
            className="block truncate text-[13px] font-semibold text-[#343C6A]"
            title={bed.bedType}
          >
            {bed.bedType}
          </span>
        </>
      )}
    </div>
  </div>

  {/* Action Button */}
  <div className="mt-4">
    <Button
      className={`w-full whitespace-nowrap py-2 text-[13px] ${config.buttonClass}`}
      disabled={bed.status === "maintenance"}
      onClick={handleActionClick}
    >
      {config.buttonLabel}
    </Button>
  </div>
</div>


);
};

const WardGroup = ({
group,
expanded,
onToggle,
onEditBed,
onDeleteBed,
onAssignBed,
onViewDetailsBed,
}) => (

  <div className="rounded-lg border border-[#E5E7EB] bg-white">
    {/* Room Header */}
    <div
      className="flex cursor-pointer items-center justify-between gap-4 p-3 sm:p-4"
      onClick={onToggle}
    >
      <div className="min-w-0">
        <p className="truncate font-semibold text-[#343C6A]">
          {group.wardName}
        </p>


    <p className="text-sm text-[#8BA3CB]">
      Room {group.roomNumber}
    </p>
  </div>

  <div className="shrink-0">
    {expanded ? (
      <ChevronUp size={18} />
    ) : (
      <ChevronDown size={18} />
    )}
  </div>
</div>

{/* Beds */}
{expanded && (
  <div className="grid grid-cols-1 gap-3 border-t border-[#F1F1F1] p-3 sm:grid-cols-3 sm:p-4 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
    {group.beds.map((bed) => (
      <BedCard
        key={bed.id}
        bed={bed}
        wardGroup={group}
        onEdit={(bed) => onEditBed(group, bed)}
        onDelete={(bed) => {
          console.log("WARDGROUP DELETE BED:", bed);
          onDeleteBed(bed);
        }}
        onAssign={onAssignBed}
        onViewDetails={onViewDetailsBed}
      />
    ))}
  </div>
)}


  </div>
);

const BedManagement = () => {
const [search, setSearch] = useState("");
const [wardFilter, setWardFilter] = useState("All Wards");
const [roomFilter, setRoomFilter] = useState("All Rooms");
const [bedTypeFilter, setBedTypeFilter] = useState("All Bed Types");
const [statusFilter, setStatusFilter] = useState("All Status");

const [isAddBedOpen, setIsAddBedOpen] = useState(false);
const [editingBed, setEditingBed] = useState(null);
const [editingGroup, setEditingGroup] = useState(null);

const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [bedToDelete, setBedToDelete] = useState(null);
const [deleteLoading, setDeleteLoading] = useState(false);

const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
const [assigningBed, setAssigningBed] = useState(null);

const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
const [viewingBed, setViewingBed] = useState(null);
const [viewingGroup, setViewingGroup] = useState(null);

const [hierarchy, setHierarchy] = useState([]);
const [admittedPatients, setAdmittedPatients] = useState([]);
const [stats, setStats] = useState(null);
const [loading, setLoading] = useState(false);
const [expandedWards, setExpandedWards] = useState({});
const [opdPatients, setOpdPatients] = useState([]);

const fetchHierarchy = useCallback(async () => {
setLoading(true);


try {
  const data = await bedService.getBedHierarchy();
  const nextHierarchy = data.hierarchy || [];

  setHierarchy(nextHierarchy);

  setExpandedWards((prev) => {
    const next = { ...prev };

    nextHierarchy.forEach((g) => {
      if (!(g.roomId in next)) {
        next[g.roomId] = g.defaultExpanded;
      }
    });

    return next;
  });
} catch (error) {
  console.error(error);
} finally {
  setLoading(false);
}


}, []);

const fetchStats = useCallback(async () => {
try {
const data = await bedService.getBedStats();
setStats(data.stats || null);
} catch (error) {
console.error(error);
}
}, []);

const fetchOpdPatients = useCallback(async () => {
try {
const data = await patientService.getPatientsForAppointment();
setOpdPatients(data.patients || []);
} catch (error) {
setOpdPatients([]);
}
}, []);

const fetchAdmissions = useCallback(async () => {
try {
const data = await ipdService.getAdmissions({
status: "admitted",
});


  setAdmittedPatients(data.admissions || []);
} catch (error) {
  setAdmittedPatients([]);
}


}, []);

useEffect(() => {
fetchHierarchy();
fetchStats();
fetchAdmissions();
fetchOpdPatients();
}, [
fetchHierarchy,
fetchStats,
fetchAdmissions,
fetchOpdPatients,
]);

const bedStats = stats
? [
{
heading: "Total Beds",
value: stats.totalBeds,
subtext: "Across hospital",
color: "#F3E8FF",
},
{
heading: "Available",
value: stats.availableBeds,
subtext: "Ready to assign",
color: "#DCFCE7",
},
{
heading: "Occupied",
value: stats.occupiedBeds,
subtext: "Patient admitted",
color: "#E0F2FE",
},
{
heading: "Maintenance",
value: stats.maintenanceBeds,
subtext: "Under repair",
color: "#FFEDD5",
},
]
: [];

const toggleWard = (roomId) => {
setExpandedWards((prev) => ({
...prev,
[roomId]: !prev[roomId],
}));
};

const wardRoomOptions = useMemo(
() =>
hierarchy.map((g) => ({
wardId: g.wardId,
roomId: g.roomId,
wardName: g.wardName,
roomNumber: g.roomNumber,
})),
[hierarchy]
);

const wardFilterOptions = useMemo(
() => [
"All Wards",
...Array.from(new Set(hierarchy.map((g) => g.wardName))),
],
[hierarchy]
);

const roomFilterOptions = useMemo(
() => [
"All Rooms",
...Array.from(new Set(hierarchy.map((g) => g.roomNumber))),
],
[hierarchy]
);

useEffect(() => {
if (
wardFilter !== "All Wards" &&
!wardFilterOptions.includes(wardFilter)
) {
setWardFilter("All Wards");
}
}, [wardFilterOptions, wardFilter]);

const filteredHierarchy = useMemo(() => {
return hierarchy
.filter(
(group) =>
wardFilter === "All Wards" ||
group.wardName === wardFilter
)
.filter(
(group) =>
roomFilter === "All Rooms" ||
group.roomNumber === roomFilter
)
.map((group) => ({
...group,
beds: group.beds.filter((bed) => {
const matchesType =
bedTypeFilter === "All Bed Types" ||
bed.bedType === bedTypeFilter;


      const matchesStatus =
        statusFilter === "All Status" ||
        bed.status === statusFilter.toLowerCase();

      const matchesSearch = bed.bedCode
        .toLowerCase()
        .includes(search.toLowerCase());

      return (
        matchesType &&
        matchesStatus &&
        matchesSearch
      );
    }),
  }));


}, [
hierarchy,
wardFilter,
roomFilter,
bedTypeFilter,
statusFilter,
search,
]);

const handleAddBed = async (newBed) => {
  try{
    const res=await bedService.createBed(newBed);
    toast.success(res?.message || "Bed Added sucessfully...")
    
    await Promise.all([
      fetchHierarchy(),
      fetchStats(),
      fetchAdmissions(),
    ]);
  } catch(error){
    toast.error(
    error?.response?.data?.message ||
      "Failed to add bed."
  );
  }

};

const handleUpdateBed = async (id, updatedBed) => {
  try{
    const res =  await bedService.updateBed(id, updatedBed);
    toast.success(res?.message || "Bed updated successfully..")
    await Promise.all([
      fetchHierarchy(),
      fetchStats(),
      fetchAdmissions(),
    ]);
  }catch (error) {
    toast.error(
      error?.response?.data?.message ||
        "Failed to edit bed."
    );
  }

};

const handleDeleteBed = (bed) => {
  console.log("BED SELECTED FOR DELETE:", bed);
  console.log("BED ID:", bed?.id);
  console.log("BED CODE:", bed?.bedCode);


  setBedToDelete(bed);
  setIsDeleteModalOpen(true);
};

const handleConfirmDeleteBed = async () => {
if (!bedToDelete) return;


try {
  setDeleteLoading(true);

  console.log("DELETING BED:", bedToDelete);
  console.log("DELETING BED ID:", bedToDelete.id);

  const res = await bedService.deleteBed(bedToDelete.id);
  console.log(res?.message || "Bed deleted successfullyy//");
  

  await Promise.all([
    fetchHierarchy(),
    fetchStats(),
  ]);

  toast.success("Bed deleted successfully");

  setIsDeleteModalOpen(false);
  setBedToDelete(null);
} catch (error) {
  console.error("Delete bed error:", error);

  toast.error(
    error?.response?.data?.message ||
      "Failed to delete bed"
  );
} finally {
  setDeleteLoading(false);
}


};

const handleCloseDeleteModal = () => {
if (deleteLoading) return;


setIsDeleteModalOpen(false);
setBedToDelete(null);


};

const handleEditBed = (group, bed) => {
setEditingGroup(group);
setEditingBed(bed);
setIsAddBedOpen(true);
};

const handleOpenAddModal = () => {
setEditingGroup(null);
setEditingBed(null);
setIsAddBedOpen(true);
};

const handleModalClose = () => {
setIsAddBedOpen(false);
setEditingBed(null);
setEditingGroup(null);
};

const handleOpenAssignModal = (bed) => {
setAssigningBed(bed);
setIsAssignModalOpen(true);
};

const handleAssignModalClose = () => {
setIsAssignModalOpen(false);
setAssigningBed(null);
};

const handleOpenViewDetails = (bed, group) => {
setViewingBed(bed);
setViewingGroup(group);
setIsViewDetailsOpen(true);
};

const handleCloseViewDetails = () => {
setIsViewDetailsOpen(false);
setViewingBed(null);
setViewingGroup(null);
};

const handleAssignPatient = async () => {
try {
  // const response=await bedService.assignPatient(bed.id, patientId);
  // toast.success(response?.message || "Patient assign succesfullyy");

  await Promise.all([
    fetchHierarchy(),
    fetchStats(),
    fetchAdmissions(),
    fetchOpdPatients(),
  ]);
} catch (error) {
  // toast.error(
  //   error?.response?.data?.message ||
  //     "Failed to assign patient to bed."
  // );

  throw error;
}


};

return ( <div className="h-full w-full bg-transparent p-1 flex flex-col gap-4 overflow-x-hidden">
{/* Header */}
 <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
   <div className="min-w-0"> 
    <h1 className="text-xl sm:text-2xl font-semibold text-[#343C6A]">
            Bed Management 
    </h1>


      <p className="text-[#8BA3CB] text-xs sm:text-sm mt-1">
        Manage hospital beds, track occupancy and maintenance status.
      </p>
    </div>

    <Button
      onClick={handleOpenAddModal}
      className="bg-[#521785] text-white flex items-center justify-center gap-1 w-full sm:w-auto px-4 py-2 shrink-0"
    >
      <Plus size={16} />
      Add Bed
    </Button>
  </div>

  {/* Stat Cards */}
  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
    {bedStats.map((stat, index) => {
      const IconComp = statIcons[index].icon;

      return (
        <div
          key={index}
          style={{ background: stat.color }}
          className="rounded-lg p-3 sm:p-4 flex items-center gap-3 min-w-0"
        >
          <div
            className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center"
            style={{ background: "#ffffff90" }}
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

  {/* Ward Tabs */}
  <WardTabs
    options={wardFilterOptions}
    value={wardFilter}
    onChange={setWardFilter}
  />

  {/* Filters */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
    <div className="w-full">
      <FilterDropdown
        options={roomFilterOptions}
        value={roomFilter}
        onChange={setRoomFilter}
      />
    </div>

    <div className="w-full">
      <FilterDropdown
        options={bedTypeFilterOptions}
        value={bedTypeFilter}
        onChange={setBedTypeFilter}
      />
    </div>

    <div className="w-full">
      <FilterDropdown
        options={statusFilterOptions}
        value={statusFilter}
        onChange={setStatusFilter}
      />
    </div>

    <div className="flex items-center border border-[#d3cccc] rounded-md px-3 py-2 gap-2 w-full lg:col-span-1">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search bed number..."
        className="outline-none text-[14px] w-full min-w-0"
      />

      <Search
        size={16}
        className="text-gray-400 shrink-0"
      />
    </div>

    <Button className="border border-[#d3cccc] flex items-center justify-center gap-1 bg-white text-[#343C6A] w-full lg:w-auto px-4 py-2">
      <Filter size={14} />
      Filter
    </Button>
  </div>

  {/* Ward -> Room -> Bed Groups */}
  <div className="flex flex-col gap-4 w-full">
    {!loading && filteredHierarchy.length === 0 && (
      <div className="text-center text-[13px] text-[#8BA3CB] py-6">
        No beds found.
      </div>
    )}

    {filteredHierarchy.map((group) => (
      <WardGroup
        key={group.roomId}
        group={group}
        expanded={expandedWards[group.roomId]}
        onToggle={() => toggleWard(group.roomId)}
        onEditBed={handleEditBed}
        onDeleteBed={handleDeleteBed}
        onAssignBed={handleOpenAssignModal}
        onViewDetailsBed={handleOpenViewDetails}
      />
    ))}
  </div>

  {/* Legend */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 bg-white border border-[#e5e5e5] rounded-lg p-3 sm:p-4">
    {Object.values(statusConfig).map((cfg) => (
      <div
        key={cfg.label}
        className="flex items-center gap-2 min-w-0"
      >
        <span
          className="w-2.5 h-2.5 shrink-0 rounded-full"
          style={{ background: cfg.dot }}
        />

        <div className="flex flex-col min-w-0">
          <span className="text-[13px] font-semibold text-[#343C6A]">
            {cfg.label}
          </span>

          <span className="text-[11px] text-[#8BA3CB]">
            {cfg.label === "Available" && "Ready to assign"}
            {cfg.label === "Occupied" && "Patient admitted"}
            {cfg.label === "Maintenance" && "Under repair"}
            {cfg.label === "Discharged" && "Recently vacated"}
          </span>
        </div>
      </div>
    ))}
  </div>

  {/* Add / Edit Bed Modal */}
  <AddBedModal
    isOpen={isAddBedOpen}
    onClose={handleModalClose}
    onAdd={handleAddBed}
    onUpdate={handleUpdateBed}
    editingBed={editingBed}
    editingGroup={editingGroup}
    wardRoomOptions={wardRoomOptions}
    admittedPatients={admittedPatients}
  />

  {/* Assign Patient Modal */}
  <AssignPatientModal
    isOpen={isAssignModalOpen}
    onClose={handleAssignModalClose}
    onAssign={handleAssignPatient}
    bed={assigningBed}
  />

  {/* View Bed Details Modal */}
  <ViewBedDetailsModal
    isOpen={isViewDetailsOpen}
    onClose={handleCloseViewDetails}
    bed={viewingBed}
    wardGroup={viewingGroup}
  />

  {/* Delete Confirmation Modal */}
  <DeleteConfirmationModal
    isOpen={isDeleteModalOpen}
    onClose={handleCloseDeleteModal}
    onConfirm={handleConfirmDeleteBed}
    title="Delete Bed"
    message={
      bedToDelete
        ? `Are you sure you want to delete bed "${bedToDelete.bedCode}"? This action cannot be undone.`
        : "Are you sure you want to delete this bed?"
    }
    loading={deleteLoading}
  />
</div>


);
};

export default BedManagement;





