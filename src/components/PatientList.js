import { useNavigate } from "react-router-dom";

import PatientPickerComponent from "./miscellaneous components/PatientPicker";
export default function PatientList({ profileId, setPatientId }) {
  const navigate = useNavigate();

  function handleClickProp(id) {
    navigate(`/patientPortal`);
    setPatientId(id);
  }

  return (
    <>
      <div className="h-full w-full">
        <PatientPickerComponent
          showTopBar={false}
          profileId={profileId}
          onclick={handleClickProp}
        />
      </div>
    </>
  );
}
