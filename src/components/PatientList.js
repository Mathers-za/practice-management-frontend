import { useNavigate } from "react-router-dom";

import PatientPickerComponent from "./miscellaneous components/PatientPicker";
import { usePatientPortalStore } from "../zustandStore/store";
export default function PatientList({ profileId, setPatientId }) {
  const navigate = useNavigate();
  const setPatientIdForPatientPortal = usePatientPortalStore(
    (state) => state.setPatientId
  );
  function handleClickProp(id) {
    navigate(`/patientPortal`);
    setPatientId(id);
    setPatientIdForPatientPortal(id);
  }

  return (
    <>
      <div className="h-full overflow-y-scroll bg-white w-full">
        <PatientPickerComponent
          showTopBar={false}
          profileId={profileId}
          onclick={handleClickProp}
        />
      </div>
    </>
  );
}
