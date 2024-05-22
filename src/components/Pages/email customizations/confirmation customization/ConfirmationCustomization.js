import { useState } from "react";
import TemplateOptions from "../templatingOptions/TemplateOptions";

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
      <div className="min-h-full w-full ">
        <div onClick={() => setShowSubjectContent(!showSubjectContent)}>
          Email Subject
        </div>

        {showSubjectContent && (
          <TextContent
            refetch={() => refetch()}
            data={{
              confirmation_subject: emailNotificationData?.confirmation_subject,
              id: emailNotificationData?.id,
            }}
            columnName="confirmation_subject"
            profileId={profileId}
          />
        )}

        <div onClick={() => setShowBodyContent(!showBodyContent)}>
          Email body
        </div>
        {showBodyContent && (
          <TextContent
            refetch={() => refetch()}
            data={{
              confirmation_body: emailNotificationData?.confirmation_body,
              id: emailNotificationData?.id,
            }}
            profileId={profileId}
            columnName="confirmation_body"
          />
        )}
      </div>
    </>
  );
}
