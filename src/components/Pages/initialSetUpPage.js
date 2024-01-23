import { useState } from "react";
import Profile from "../Profile";
import PracticeDetails from "../PracticeDetails";
import { useNavigate } from "react-router-dom";

export default function InitialSetUpPage() {
  const [isProfileSetup, setIsProfileSetup] = useState(false);
  const [profileId, setProfileId] = useState();
  const [isPracticeSetup, setIsPracticeSetup] = useState(false);
  const navigate = useNavigate();

  function handleProfileSetup() {
    setIsProfileSetup(true);
  }

  function handlePracticeSetup() {
    setIsPracticeSetup(true);
    if (isPracticeSetup && isProfileSetup) {
      navigate("/", { replace: true });
    }
  }

  function getProfileIdState(profileId) {
    setProfileId(profileId);
    console.log(profileId);
  }

  return (
    <>
      {!isProfileSetup ? (
        <>
          <h1>Setup profile</h1>
          <Profile
            profileSetupStatus={handleProfileSetup}
            passState={getProfileIdState}
          />
        </>
      ) : (
        <>
          <h1>setup PraticeDetails</h1>
          <PracticeDetails
            profile_id={profileId}
            practiceSetupStatus={handlePracticeSetup}
          />
        </>
      )}
    </>
  );
}
