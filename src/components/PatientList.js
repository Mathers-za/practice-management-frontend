import { useNavigate } from "react-router-dom";

import PatientPickerComponent from "./miscellaneous components/PatientPicker";
import { useGlobalStore, usePatientPortalStore } from "../zustandStore/store";
import { useEffect } from "react";
export default function PatientList({ profileId, setPatientId }) {
  const navigate = useNavigate();
  const setPatientIdForPatientPortal = usePatientPortalStore(
    (state) => state.setPatientId
  );
  const setPatientData = usePatientPortalStore((state) => state.setPatientData);

  function handleClickProp(patientObj) {
    navigate(`/patientPortal`);
    setPatientId(patientObj.id);
    setPatientIdForPatientPortal(patientObj.id);
    setPatientData(patientObj);
  }

  return (
    <>
      <div className="h-full  overflow-y-scroll bg-white w-full">
        <PatientPickerComponent
          showTopBar={false}
          profileId={profileId}
          onclick={handleClickProp}
        />
      </div>
    </>
  );
}
