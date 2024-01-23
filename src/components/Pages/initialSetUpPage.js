import { useState } from "react";
import Profile from "../Profile";
import PracticeDetails from "../PracticeDetails";

export default function InitialSetUpPage() {
  const [isProfileSetup, setIsProfileSetup] = useState(false);

  function handleProfileSetup() {
    setIsProfileSetup(true);
  }

  return (
    <>
      {!isProfileSetup ? (
        <>
          <h1>Setup profile</h1>
          <Profile profileSetupStatus={handleProfileSetup} />
        </>
      ) : (
        <>
          <h1>setup PraticeDetails</h1>
          <PracticeDetails />
        </>
      )}
    </>
  );
}
