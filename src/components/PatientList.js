import { useNavigate } from "react-router-dom";
import PatientSearch from "./PatientSearch";
export default function PatientList({ profileId, setPatientId }) {
  const navigate = useNavigate();

  function handleClickProp(id) {
    navigate(`/patientPortal`);
    setPatientId(id);
  }

  return (
    <>
      <PatientSearch profileId={profileId} onclick={handleClickProp} />
    </>
  );
}
