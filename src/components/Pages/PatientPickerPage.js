import PatientSearch from "../PatientSearch";

export default function PatientPicker({ onclick, profileId }) {
  //navbar home, new pt, refresh

  return (
    <>
      <PatientSearch onclick={onclick} profileId={profileId} />
    </>
  );
}
