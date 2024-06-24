import { useEffect, useState } from "react";
import {
  usePatchData,
  usePostData,
} from "../../../../CustomHooks/serverStateHooks";
import { TextField, Button, Chip, CircularProgress } from "@mui/material";
import { defaultNotfications } from "./defaultNotifications";
import CustomAlertMessage from "../../../miscellaneous components/CustomAlertMessage";
import TemplateOptions from "../templatingOptions/TemplateOptions";
import {
  getSaveButtonDisabledState,
  showDefaultLabel,
} from "../email customization page/emailNotificationHelperFns";
import { useOnSubmitButtonTextstateManager } from "../../../../CustomHooks/otherHooks";
import { useTextContentComponent } from "../../../../zustandStore/store";

export default function TextContent({ columnName, data, refetch, label }) {
  const [content, setContent] = useState({
    id: data.id,
  });

  const [isResetToDefault, setIsResetToDefault] = useState(false);
  const { textContentLoadingState } = useTextContentComponent();
  const [error, setError] = useState();

  const { patchMutation } = usePatchData(
    `/emailNotifications/update${content.id}`
  );

  const { createMutation: errorCheck } = usePostData(
    `/emailNotifications//customizationErrorCheck`
  );
  const saveButtonText = useOnSubmitButtonTextstateManager(
    "Save",
    undefined,
    patchMutation
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
      setError("");
      await errorCheck.mutateAsync(changes);
      setChanges({});
      setIsResetToDefault(false);

      await patchMutation.mutateAsync(changes);

      await refetch();
    } catch (error) {
      console.error(error);
      setError(error.response.data);
      setChanges({});
      return;
    }
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
            <div className="shadow-md  relative">
              <TextField
                inputProps={{ style: { fontSize: 14 } }}
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
              {textContentLoadingState && (
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <CircularProgress />
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
                {saveButtonText}
              </Button>
            </div>
          </div>
          <TemplateOptions addToStringFn={(string) => addToStringFn(string)} />
        </div>
      </div>

      <CustomAlertMessage
        errorFlag={error}
        successFlag={patchMutation.isSuccess}
        errorMessage={error}
        successMessage="Updated successfully"
        errorDisplayDuration="7000"
      />
    </>
  );
}
