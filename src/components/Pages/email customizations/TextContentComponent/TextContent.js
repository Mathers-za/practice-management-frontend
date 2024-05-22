import { useEffect, useState } from "react";
import {
  usePatchData,
  usePostData,
} from "../../../../CustomHooks/serverStateHooks";
import { TextField, Button } from "@mui/material";

import TemplateOptions from "../templatingOptions/TemplateOptions";

export default function TextContent({ columnName, data, refetch }) {
  const [content, setContent] = useState({
    id: data.id,
  });

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

  const [isUpdate, setIsUpdate] = useState(true);

  const [changes, setChanges] = useState({});

  useEffect(() => {
    if (data) {
      setContent(data);
      setIsUpdate(true);
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

  async function handleSubmission() {
    if (isUpdate) {
      try {
        await errorCheck.mutateAsync(changes);
        setError();
      } catch (error) {
        console.error(error);
        setError(error.response.data);
        setChanges({});
        return;
      }

      await patchMutation.mutateAsync(changes);

      await refetch();
      setChanges({});
    }

    if (!isUpdate) {
      createMutation.mutate(content);
      setChanges({});
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
        <div className="flex gap-3  mt-3  ">
          <div className="w-3/4 space-y-3 ">
            <TextField
              fullWidth
              label={columnName}
              multiline
              rows={10}
              value={content?.[columnName] || ""}
              name={columnName}
              onChange={handleChange}
              sx={{ ".MuiInputBase-input": { boxShadow: "none" } }}
            />
            <div className="text-end">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmission}
                disabled={Object.keys(changes).length === 0}
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
