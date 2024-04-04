import { useState } from "react";
import ConfirmationCustomization from "../confirmation customization/ConfirmationCustomization";
import ReminderCustomization from "../email reminder customization/ReminderCustomization";
import { useFetchData } from "../../../../CustomHooks/serverStateHooks";

export default function EmailCustomizationPage({ profileId }) {
  const [showConfirmationContent, setShowConfirmationContent] = useState(false);
  const [showReminderContent, setShowReminderContent] = useState(false);

  const { data: emailNotificationData, refetch } = useFetchData(
    `/emailNotifications/view${profileId}`,
    "customEmailConfirmation"
  );

  return (
    <>
      <div className="customEmail-container">
        <h2>
          You have full control over custmozing what your cnfimration and
          reminder emails look like
        </h2>
        <h3>Click on the message you wish to custmoize below:</h3>
        <div className="customEmail-dropdownsContainer">
          <div
            onClick={() => setShowConfirmationContent(!showConfirmationContent)}
            className="customEmail-confirmationDropDown"
          >
            Confirmation message
          </div>
          {showConfirmationContent && (
            <ConfirmationCustomization
              profileId={profileId}
              emailNotificationData={emailNotificationData}
              refetch={() => refetch()}
            />
          )}
          <div
            onClick={() => setShowReminderContent(!showReminderContent)}
            className="customEmail-reminderDropDown"
          >
            Reminder
          </div>
          {showReminderContent && (
            <ReminderCustomization
              profileId={profileId}
              emailNotificationData={emailNotificationData}
              refetch={() => refetch()}
            />
          )}
        </div>
      </div>
    </>
  );
}
