import { useState } from "react";

import MenuDivsWithIcon from "../../../miscellaneous components/MenuListDivsWithIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextContent from "../TextContentComponent/TextContent";

export default function ConfirmationCustomization({
  profileId,
  emailNotificationData,
  refetch,
}) {
  const [showSubjectContent, setShowSubjectContent] = useState(false);
  const [showBodyContent, setShowBodyContent] = useState(false);

  return (
    <>
      <div className="h-full w-full  mt-3  ">
        <MenuDivsWithIcon
          className="pr-10"
          text=" Customize Subject"
          onclick={() => {
            setShowSubjectContent(!showSubjectContent);
            setShowBodyContent(false);
          }}
          iconEnd={
            <FontAwesomeIcon
              icon={`fa-solid fa-circle-chevron-${
                showSubjectContent ? "up" : "down"
              }`}
              size="xl"
            />
          }
        />

        {showSubjectContent && (
          <TextContent
            refetch={() => refetch()}
            data={{
              confirmation_subject: emailNotificationData?.confirmation_subject,
              id: emailNotificationData?.id,
            }}
            columnName="confirmation_subject"
            profileId={profileId}
            label="subject"
          />
        )}
        <MenuDivsWithIcon
          className="pr-10"
          text=" Customizae Body"
          onclick={() => {
            setShowSubjectContent(false);
            setShowBodyContent(!showBodyContent);
          }}
          iconEnd={
            <FontAwesomeIcon
              icon={`fa-solid fa-circle-chevron-${
                showBodyContent ? "up" : "down"
              }`}
              size="xl"
            />
          }
        />

        {showBodyContent && (
          <TextContent
            refetch={() => refetch()}
            data={{
              confirmation_body: emailNotificationData?.confirmation_body,
              id: emailNotificationData?.id,
            }}
            profileId={profileId}
            columnName="confirmation_body"
            label="body"
          />
        )}
      </div>
    </>
  );
}
