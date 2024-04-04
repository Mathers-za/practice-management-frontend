import { useState } from "react";
import TextContent from "../TextContentComponent/TextContent";

export default function ReminderCustomization({
  profileId,
  emailNotificationData,
  refetch,
}) {
  const [showReminderSubject, setShowReminderSubject] = useState(false);
  const [showReminderBody, SetShowReminderBody] = useState(false);

  return (
    <>
      <div onClick={() => setShowReminderSubject(!showReminderSubject)}>
        Subject
      </div>
      <div>
        {showReminderSubject && (
          <TextContent
            data={{
              reminder_subject: emailNotificationData?.reminder_subject,
              id: emailNotificationData?.id,
            }}
            refetch={refetch}
            profileId={profileId}
            columnName="reminder_subject"
          />
        )}
      </div>
      <div onClick={() => SetShowReminderBody(!showReminderBody)}>Body</div>
      <div>
        {showReminderBody && (
          <TextContent
            data={{
              reminder_body: emailNotificationData?.reminder_body,
              id: emailNotificationData?.id,
            }}
            refetch={refetch}
            profileId={profileId}
            columnName="reminder_body"
          />
        )}
      </div>
    </>
  );
}
