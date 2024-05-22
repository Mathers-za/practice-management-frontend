import { useState } from "react";
import ConfirmationCustomization from "../confirmation customization/ConfirmationCustomization";
import ReminderCustomization from "../email reminder customization/ReminderCustomization";
import { useFetchData } from "../../../../CustomHooks/serverStateHooks";
import EmailNotificationTypeTile from "./EmailTypeSelectorTile";
import { handleTileColorChange } from "./emailNotificationHelperFns";

export default function EmailCustomizationPage({ profileId }) {
  const [tileColor, setTileColor] = useState(Array(2).fill("bg-white"));
  const { data: emailNotificationData, refetch } = useFetchData(
    `/emailNotifications/view${profileId}`,
    "customEmailConfirmation"
  );
  const [showConfirmationCustomization, setShowConfirmationCustomization] =
    useState(false);
  const [showReminderCustomization, setShowReminderCustomization] =
    useState(false);

  function handleTileClick(id) {
    setTileColor(handleTileColorChange(id, "bg-sky-400"));
    id == 0 && setShowConfirmationCustomization(!showConfirmationCustomization);
    id == 1 && setShowReminderCustomization(!showReminderCustomization);
  }

  return (
    <>
      <div className="h-full w-full p-4 bg-white">
        <div className="flex justify-evenly gap-5 min-h-[20%]">
          <EmailNotificationTypeTile
            id={0}
            heading="Confirmation message"
            textContent="  A confirmation message sent to the client when you create a new
              appointment"
            className={`${tileColor[0]}`}
            onclick={handleTileClick}
          />
          <EmailNotificationTypeTile
            id={1}
            heading="Reminder message"
            textContent="A reminder sent to the client one day before the appointment"
            className={`${tileColor[1]}`}
            onclick={handleTileClick}
          />
        </div>
        {showConfirmationCustomization && (
          <ConfirmationCustomization
            profileId={profileId}
            emailNotificationData={emailNotificationData}
            refetch={() => refetch()}
          />
        )}
        {showReminderCustomization && (
          <ReminderCustomization
            profileId={profileId}
            emailNotificationData={emailNotificationData}
            refetch={() => refetch()}
          />
        )}
      </div>
    </>
  );
}
