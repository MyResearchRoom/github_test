import React, { useEffect, useState } from "react";
import ShowCard from "../../../commonComponent/ShowCard";
import {
  BookAppointmentModal,
  MedicineModal,
  PatientRegistrationForm,
} from "../../../modal/ReceptionistModal";

import { FaCalendarPlus } from "react-icons/fa6";
import { HiUserAdd } from "react-icons/hi";
import { myIcon } from "../../../assets/img";
import { useFetch } from "../../../hooks/useFetch";

const DashCountComponent = () => {
  const [isPatientForm, setIsPatientForm] = useState(false);
  const [openMedicineModal, setOpenMedicineModal] = useState(false);
  const [openAppointmentModal, setOpenAppointmentModal] = useState(false);
  const [counts, setCounts] = useState({});

  const { data } = useFetch("/api/patients/getCounts");
  useEffect(() => {
    if (data?.data) {
      setCounts(data?.data);
    }
  }, [data]);

  return (
    <>
      {isPatientForm && (
        <PatientRegistrationForm
          isPatientForm={isPatientForm}
          setIsPatientForm={setIsPatientForm}
        />
      )}
      {openMedicineModal && (
        <MedicineModal
          openMedicineModal={openMedicineModal}
          setOpenMedicineModal={setOpenMedicineModal}
        />
      )}
      {openAppointmentModal && (
        <BookAppointmentModal
          openAppointmentModal={openAppointmentModal}
          setOpenAppointmentModal={setOpenAppointmentModal}
        />
      )}
      <div className="w-full  h-auto xl:h-[15%] grid md:grid-cols-6 grid-cols-3 gap-3 mb-2 ">
        <ShowCard
          value={counts?.todaysPatients}
          color={
            "linear-gradient(180deg, rgba(38, 112, 237, 0.32) 2%, rgba(170, 139, 224, 0.36) 100%)"
          }
          heading="Today's Patients"
          className={"w-full"}
        />
        <ShowCard
          value={counts?.completedPatients}
          color={
            "linear-gradient(180deg, rgba(213, 255, 73, 0.32) 0%, rgba(151, 255, 142, 0.35) 100%)"
          }
          heading="Completed Patients"
          className={"w-full"}
        />
        <ShowCard
          value={counts?.waitingPatients}
          color={
            "linear-gradient(180deg, rgba(255, 128, 128, 0.48) 0%, rgba(255, 168, 246, 0.24) 100%)"
          }
          heading="Waiting Patients"
          className={"w-full"}
        />

        <div
          onClick={() => setIsPatientForm(!isPatientForm)}
          style={{
            background: "linear-gradient(90deg, #835AA6 0%, #322340 100%)",
          }}
          className="w-[100%%] h-full rounded-lg  flex justify-center items-center flex-col p-2 cursor-pointer"
        >
          <HiUserAdd size={24} color="white" />
          <p className="text-white text-sm font-semibold text-center">
            Add New Registration
          </p>
        </div>

        <div
          onClick={() => setOpenAppointmentModal(!openAppointmentModal)}
          style={{
            background: "linear-gradient(270deg, #5A317D 0%, #7B34B8 100%)",
          }}
          className="w-[100%] h-full rounded-lg  flex justify-center items-center flex-col p-2 cursor-pointer"
        >
          <FaCalendarPlus size={18} color="white" />
          <p className="text-white text-sm font-semibold text-center">
            Book Appointment
          </p>
        </div>

        <div
          onClick={() => setOpenMedicineModal(!openMedicineModal)}
          style={{
            background: "linear-gradient(360deg, #63A0CF 0%, #325169 100%)",
          }}
          className="w-[100%] h-full rounded-lg  flex justify-center items-center flex-col p-2 cursor-pointer"
        >
          <img src={myIcon.medicine} className="h-6 w-6" />
          <p className="text-white text-sm font-semibold text-center">
            Medicine List
          </p>
        </div>
      </div>
    </>
  );
};

export default DashCountComponent;
