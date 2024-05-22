import { useState } from "react";
import TextContent from "../TextContentComponent/TextContent";
import MenuDivsWithIcon from "../../../miscellaneous components/MenuListDivsWithIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ReminderCustomization({
  profileId,
  emailNotificationData,
  refetch,
}) {
  const [showReminderSubject, setShowReminderSubject] = useState(false);
  const [showReminderBody, SetShowReminderBody] = useState(false);

  return (
    <>
      <div className="h-full w-full  mt-3  ">
        <MenuDivsWithIcon
          className="pr-10"
          text=" Customize reminder email subject"
          onclick={() => {
            setShowReminderSubject(!showReminderSubject);
            SetShowReminderBody(false);
          }}
          iconEnd={
            <FontAwesomeIcon
              icon={`fa-solid fa-circle-chevron-${
                showReminderSubject ? "up" : "down"
              }`}
              size="xl"
            />
          }
        />
        <MenuDivsWithIcon
          className="pr-10"
          text=" Customize reminder email body"
          onclick={() => {
            SetShowReminderBody(!showReminderBody);
            setShowReminderSubject(false);
          }}
          iconEnd={
            <FontAwesomeIcon
              icon={`fa-solid fa-circle-chevron-${
                showReminderBody ? "up" : "down"
              }`}
              size="xl"
            />
          }
        />

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
              label="Subject"
            />
          )}
        </div>

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
              label="Body"
            />
          )}
        </div>
      </div>
    </>
  );
}
