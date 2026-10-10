import { useEffect, useRef, useState } from "react";
import { myImg } from "../assets/Images";
import { MdOutlineEdit } from "react-icons/md";
import { toast } from "react-toastify";
import { useAppointmentsStats } from "../context/AppointmentStats";
import { Button } from "@mui/material";
import { capitalizeWords } from "../utils/capitalizeWords";
import apiClient from "../api/apiClient";
import { DOCTOR, RECEPTIONIST, SUB_DOCTOR } from "../Constants";

export const ProfileCard = ({
  label,
  type = "text",
  name,
  inputValue,
  value,
  handleChange,
  placeholder,
  isEdit,
  readOnly = false,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start  justify-between gap-2 sm:gap-4 py-3 border-b border-gray-200">
      {/* Label */}
      <label className="sm:w-[40%] text-sm lg:text-base font-medium text-gray-600">
        {label}
      </label>

      {/* Input or Value */}
      {isEdit ? (
        <input
          name={name}
          type={type}
          value={inputValue}
          onChange={handleChange}
          className="w-full sm:w-[60%] px-3 py-2 text-sm lg:text-base rounded-md border border-gray-300 focus:ring-[0.5] focus:ring-[#8856b2] focus:border-[#8856b2] outline-none placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder={placeholder}
          readOnly={readOnly}
        />
      ) : (
        <p className="w-full sm:w-[60%] text-sm lg:text-base text-gray-800 font-semibold break-words">
          {value || "-"}
        </p>
      )}
    </div>
  );
};

export const DetailsCard = ({ label, value }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start justify-between border-b border-gray-200  gap-2 sm:gap-4 py-3">
      <span className="text-[#343c6a] text-[14px] lg:text-[16px] sm:w-[40%] font-medium">
        {label}
      </span>
      <span className="text-[#343c6a] sm:w-[60%] text-[14px] lg:text-[16px] font-semibold">
        {value || "--"}
      </span>
    </div>
  );
};


const Profile = () => {
  const profileRef = useRef(null);
  const role = localStorage.getItem("role");
  const isDoctor = role === DOCTOR ? true : false;
  const isReceptionist = role === RECEPTIONIST ? true : false;
  const isSubdoctor = role === SUB_DOCTOR ? true : false

  const [isEdit, setEdit] = useState(false);
  const { user, updateUser, getUser } = useAppointmentsStats();
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    address: "",
    email: "",
    dateOfBirth: "",
    age: "",
    gender: "",
    clinicName: "",
    medicalLicenceNumber: "",
    medicalDegree: "",
    clinicAddress: "",
    specialization: "",
    experience: "",
  });

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // Adjust if birth month and day haven't occurred yet this year
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "dateOfBirth") {
      const age = calculateAge(value);

      if (age < 18 || age > 120) {
        return toast.error("Age must be 18 or older");
      }
      setFormData((prevData) => ({
        ...prevData,
        dateOfBirth: value,
        age: age.toString(), // Update age automatically based on DOB
      }));
      return;
    }

    if (name === "mobileNumber") {
      if (!/^\d*$/.test(value)) {
        return toast.error("Invalid Input");
      }
      if (value.length > 10) {
        return toast.error("mobile Number  cannot be more than 10 digits");
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    try {
      const roleConfig={
        doctor:{
          api:`/api/receptionists/change-profile`,
          method:'post'
        },
        receptionist : {
          api:`/api/receptionists/change-profile`,
          method:'post'
        },
        subDoctor:{
          api:`/api/receptionists/change-profile`,
          method:'post'
        }
      }
      const config=roleConfig[role];
      
       if (!config) {
      toast.error("Invalid role or endpoint not found");
      return;
    }

     // Use FormData
    const formData = new FormData();
    formData.append("profile", file);

      const response=await apiClient[config.method](config.api,formData,{
         headers: {
            "Content-Type": "multipart/form-data",
          },
      })
      // const response = await apiClient.post(
      //   `/api/receptionists/change-profile`,
      //   {
      //     profile: file,
      //   },
      //   {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //   }
      // );

      if (response.status === 200) {
        updateUser({
          profile: response.data.profile,
          contentType: response.data.contentType,
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occured");
    }
  };

  const openPDFInNewTab = (document) => {
    const newTab = window.open();
    newTab.document.write(`
    <iframe 
      src="${document}" 
      style="border:0; top:0; left:0; bottom:0; right:0; padding:0; width:100%; height:100%;" 
      allowfullscreen>
    </iframe>
  `);
    newTab.document.close();
  };

  const handleSave = async () => {
    if (!isEdit) {
      setEdit(true);
    } else {
      const { mobileNumber, age } = formData;
      // Validate mobile number (10 digits)
      if (mobileNumber.length < 10) {
        toast.error("Mobile number must be 10 digits.");
        return false;
      }
      if (age < 0) {
        toast.error("Enter Valid Age");
        return false;
      }

      try {
        const response = await apiClient.put(`/api/doctors/`, formData);

        if (response.status === 200) {
          toast.success("Profile updated successfully");
          getUser();
          setEdit(false);
        }
      } catch (error) {
        toast.error(error?.response?.data?.error || "An error occured.");
      }
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        doctorId: user.doctorId,
        name: user.name || "",
        mobileNumber: user.mobileNumber || "",
        address: user.address || "",
        email: user.email || "",
        dateOfBirth: user.dateOfBirth
          ? new Date(user.dateOfBirth).toISOString().split("T")[0]
          : "",
        age: user.age || "",
        gender: user.gender || "",
        clinicName: user.clinicName || "",
        medicalLicenceNumber: user.medicalLicenceNumber || "",
        medicalDegree: user.medicalDegree || "",
        clinicAddress: user.clinicAddress || "",
        experience: user.experience || "",
        specialization: user.specialization || "",
      });
    }
  }, [user]);

  return (
    <div className="w-[100%] mx-auto  bg-white px-10 min-h-[100%] h-auto rounded-lg mb-4 shadow-md">
      <div className="text-[#343c6a] flex flex-col justify-center items-center  mb-4  w-full">
  {/* Profile Image */}
  <div className="mb-3 relative rounded-full border-4 border-[#f2e2ff] shadow-md">
    <img
      src={user?.profile || myImg.userIcon}
      alt="profile"
      className="h-20 w-20 rounded-full object-cover"
    />

    {/* Edit Icon */}
    {(
      <span className="absolute -right-2 bottom-0 flex justify-center items-center p-1.5 bg-[#f2e2ff] rounded-full shadow cursor-pointer hover:bg-[#e5d0fa] transition">
        <input
          type="file"
          className="hidden"
          ref={profileRef}
          onChange={handleFileChange}
          accept="image/*"
        />
        <MdOutlineEdit
          size={18}
          color="#343c6a"
          onClick={() => profileRef.current.click()}
        />
      </span>
    )}
  </div>

  {/* User Name */}
  {isEdit ? (
    <input
      name="name"
      value={formData.name}
      onChange={handleChange}
      className="outline-none border border-gray-300 focus:border-[#8659ad] rounded-md placeholder:font-normal px-2 py-1 mb-2 text-center w-48"
      placeholder="Enter Name"
    />
  ) : (
    <p className="text-[16px] font-bold mb-2 lg:text-[18px] text-center">
      {capitalizeWords(user?.name)}
    </p>
  )}

  {/* User ID */}
  <p className="border px-3 py-1 rounded-md border-gray-400 bg-gray-50 text-[#343c6a] text-[14px] lg:text-[16px] font-medium">
    ID: <span className="font-bold">{isReceptionist ? user.receptionistId : isDoctor ?  user.doctorId : user?.id}</span>
  </p>
</div>

      <div className=" space-y-8 text-[#343c6a] pb-3">
  {/* =================== Personal Info =================== */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <h1 className="col-span-1 lg:col-span-2 font-semibold md:text-lg text-base text-[#343c6a] bg-gray-50 px-3 py-2 rounded-md">
      Personal Information
    </h1>

    <ProfileCard
      isEdit={isEdit}
      label="Mobile Number"
      placeholder="Enter Mobile Number"
      name="mobileNumber"
      inputValue={formData.mobileNumber}
      value={user?.mobileNumber}
      handleChange={handleChange}
    />

    <ProfileCard
      isEdit={isEdit}
      label="Address"
      placeholder="Enter Address"
      name="address"
      inputValue={formData.address}
      value={user?.address}
      handleChange={handleChange}
    />

    <DetailsCard label="Email Id" value={user?.email} />

    <ProfileCard
      isEdit={isEdit}
      label="Date of Birth"
      type="date"
      name="dateOfBirth"
      inputValue={formData.dateOfBirth}
      value={user?.dateOfBirth?.slice(0, 10)}
      handleChange={handleChange}
    />

    <ProfileCard
      isEdit={isEdit}
      type="number"
      label="Age"
      name="age"
      inputValue={formData.age}
      value={user?.age}
      readOnly={true}
    />

    <ProfileCard
      isEdit={isEdit}
      label="Gender"
      name="gender"
      inputValue={formData.gender}
      value={capitalizeWords(user?.gender)}
      handleChange={handleChange}
    />
  </div>

  {/* =================== Professional Info =================== */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <h1 className="col-span-1 lg:col-span-2 font-semibold md:text-lg text-base text-[#343c6a] bg-gray-50 px-3 py-2 rounded-md">
      Professional Information
    </h1>

    {isDoctor && (
      <ProfileCard
        isEdit={isEdit}
        label="Clinic Name"
        name="clinicName"
        inputValue={formData.clinicName}
        value={capitalizeWords(user?.clinicName)}
        handleChange={handleChange}
      />
    )}

    {isDoctor && (
      <ProfileCard
        isEdit={isEdit}
        label="Medical License No"
        name="medicalLicenceNumber"
        inputValue={formData.medicalLicenceNumber}
        value={user?.medicalLicenceNumber}
        handleChange={handleChange}
      />
    )}

    {(isDoctor || isSubdoctor) && (
      <>
        <ProfileCard
          isEdit={isEdit}
          label="Specialization"
          name="specialization"
          inputValue={formData.specialization}
          value={user?.specialization}
          handleChange={handleChange}
        />

        <ProfileCard
          isEdit={isEdit}
          label="Experience (In Years)"
          type="number"
          name="experience"
          inputValue={formData.experience}
          value={user?.experience}
          handleChange={handleChange}
        />
      </>
    )}

    {isDoctor && (
      <ProfileCard
        isEdit={isEdit}
        label="Clinic Address"
        name="clinicAddress"
        inputValue={formData.clinicAddress}
        value={user?.clinicAddress}
        handleChange={handleChange}
      />
    )}

    {isReceptionist && (
      <DetailsCard
        label="Date of Joining"
        value={user?.dateOfJoining?.slice(0, 10)}
      />
    )}

    {(isReceptionist || isSubdoctor) && (
      <DetailsCard label="Qualification" value={user?.qualification} />
    )}

    {isReceptionist && (
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 py-3 border-b border-gray-200">
        <label className="sm:w-[40%] text-gray-500 font-medium text-sm">
          All Documents
        </label>
        <div className="sm:w-[60%] relative">
          <select
            onChange={(e) => {
              const selectedDoc = user?.documents?.[e.target.value];
              if (selectedDoc) {
                openPDFInNewTab(selectedDoc.document);
              }
            }}
            className="bg-gray-50 outline-none rounded-md border border-gray-300 p-2 w-full text-sm font-medium cursor-pointer"
          >
            <option value="">Select Document</option>
            {user?.documents?.map((document, index) => (
              <option key={index} value={index}>
                {document?.fileName ? document.fileName : "Document"}
              </option>
            ))}
          </select>
        </div>
      </div>
    )}

    {isDoctor && (
      <ProfileCard
        isEdit={isEdit}
        label="Qualification"
        name="medicalDegree"
        inputValue={formData.medicalDegree}
        value={user?.medicalDegree}
        handleChange={handleChange}
      />
    )}
  </div>
</div>


      {isDoctor && (
        <center className="h-14 mt-4 mb-4">
          <Button
            variant="outlined"
            onClick={handleSave}
            className="!btn_bg !border-none !capitalize !text-white font-semibold text-[14px]"
          >
            {isEdit ? "Save Changes" : "Edit Details"}
          </Button>
        </center>
      )}
    </div>
  );
};

export default Profile;
