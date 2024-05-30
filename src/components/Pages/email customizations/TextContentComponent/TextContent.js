import { useEffect, useState } from "react";
import {
  usePatchData,
  usePostData,
} from "../../../../CustomHooks/serverStateHooks";
import { TextField, Button, Chip } from "@mui/material";
import { defaultNotfications } from "./defaultNotifications";

import TemplateOptions from "../templatingOptions/TemplateOptions";
import {
  getSaveButtonDisabledState,
  showDefaultLabel,
} from "../email customization page/emailNotificationHelperFns";

export default function TextContent({ columnName, data, refetch, label }) {
  const [content, setContent] = useState({
    id: data.id,
  });

  const [isResetToDefault, setIsResetToDefault] = useState(false);

  const [error, setError] = useState();

  const [showTemplateOptions, setShowTemPlateOptions] = useState(false);

  const { patchMutation } = usePatchData(
    `/emailNotifications/update${content.id}`
  );
  const { createMutation } = usePostData(
    `/emailNotifications/create`,
    "customEmailConfirmation"
  );

  const { createMutation: errorCheck } = usePostData(
    `/emailNotifications//customizationErrorCheck`
  );

  const [changes, setChanges] = useState({});

  useEffect(() => {
    if (data) {
      setContent(data);
    }
  }, [data, columnName]);

  function handleChange(event) {
    const { name, value } = event.target;

    setContent((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));

    setChanges((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  }

  function handleResetToDefault() {
    setIsResetToDefault(true);
    setContent((prev) => ({
      ...prev,
      [columnName]: defaultNotfications[columnName],
    }));

    setChanges((prev) => ({
      ...prev,
      id: data.id,
      [columnName]: defaultNotfications[columnName],
    }));
  }

  //TODO handle empty customizations thrigh validation.

  async function handleSubmission() {
    try {
      await errorCheck.mutateAsync(changes);
      setError();
    } catch (error) {
      console.error(error);
      setError(error.response.data);
      setChanges({});
      return;
    }
    setChanges({});
    setIsResetToDefault(false);

    await patchMutation.mutateAsync(changes);

    await refetch();
  }

  function addToStringFn(string) {
    setContent((prev) => ({
      ...prev,
      [columnName]: prev?.[columnName] + " " + string,
    }));
    setChanges((prev) => ({
      ...prev,
      [columnName]: content[columnName] + " " + string,
    }));
  }

  return (
    <>
      <div>
        <div className="flex gap-3  mt-4  ">
          <div className="w-3/4 space-y-3 ">
            <div className="shadow-md relative">
              <TextField
                required
                fullWidth
                label={label}
                multiline
                rows={10}
                value={content?.[columnName] || ""}
                name={columnName}
                onChange={handleChange}
                sx={{ ".MuiInputBase-input": { boxShadow: "none" } }}
              />
              {showDefaultLabel(content[columnName], defaultNotfications) && (
                <div className="absolute select-none bg-white rounded-full h-fit w-fit z-10 -top-3.5 right-1">
                  <Chip
                    label="Default Message"
                    variant="outlined"
                    color="secondary"
                    size="small"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <Button
                variant="contained"
                color="primary"
                onClick={handleResetToDefault}
              >
                Reset to default
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmission}
                disabled={getSaveButtonDisabledState(changes, isResetToDefault)}
              >
                Save Changes
              </Button>
            </div>
          </div>
          <TemplateOptions addToStringFn={(string) => addToStringFn(string)} />
        </div>
      </div>

      {error && (
        <div>
          <textarea value={error || ""} cols="80" rows="10"></textarea>
        </div>
      )}
    </>
  );
}
