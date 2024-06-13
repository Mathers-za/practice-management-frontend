import { useEffect, useState } from "react";
import ConfirmationCustomization from "../confirmation customization/ConfirmationCustomization";
import ReminderCustomization from "../email reminder customization/ReminderCustomization";
import { useFetchData } from "../../../../CustomHooks/serverStateHooks";
import EmailNotificationTypeTile from "./EmailTypeSelectorTile";
import { handleTileColorChange } from "./emailNotificationHelperFns";
import { useTextContentComponent } from "../../../../zustandStore/store";

export default function EmailCustomizationPage({ profileId }) {
  const [tileColor, setTileColor] = useState(Array(2).fill("bg-white"));
  const {
    data: emailNotificationData,
    refetch,
    isLoading,
  } = useFetchData(
    `/emailNotifications/view${profileId}`,
    "customEmailConfirmation"
  );

  const { setTextContentLoadingState } = useTextContentComponent();

  useEffect(() => {
    setTextContentLoadingState(isLoading);
  }, [isLoading]);
  const [showConfirmationCustomization, setShowConfirmationCustomization] =
    useState(false);
  const [showReminderCustomization, setShowReminderCustomization] =
    useState(false);

  function handleTileClick(id) {
    setTileColor(handleTileColorChange(id, "bg-sky-400"));
    if (id == 0) {
      setShowConfirmationCustomization(!showConfirmationCustomization);
      setShowReminderCustomization(false);
    }
    if (id == 1) {
      setShowReminderCustomization(!showReminderCustomization);
      setShowConfirmationCustomization(false);
    }
  }

  return (
    <>
      <div className="min-h-full w-full p-4 bg-white">
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
