import { useNavigate } from "react-router-dom";

import PatientPickerComponent from "./miscellaneous components/PatientPicker";
import { usePatientPortalStore } from "../zustandStore/store";
export default function PatientList({ profileId, setPatientId }) {
  const navigate = useNavigate();
  const setPatientIdForPatientPortal = usePatientPortalStore(
    (state) => state.setPatientId
  );
  function handleClickProp(patientObj) {
    navigate(`/patientPortal`);
    setPatientId(patientObj.id);
    setPatientIdForPatientPortal(patientObj.id);
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
