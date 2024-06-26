import { useEffect, useState } from "react";

import {
  usePatchData,
  usePostData,
} from "../../../CustomHooks/serverStateHooks";
import { Button } from "@mui/material";
import { useGlobalStore, useIcd10Component } from "../../../zustandStore/store";

export default function CodeLineItem({
  codeData,
  refetchIcd10TableData,
  hideComponent,
  QueryKeyToInvalidate = "",
}) {
  const [lineItemData, setLineItemData] = useState();
  const { globalAppointmentData } = useGlobalStore();
  const [changes, setChanges] = useState({});

  useEffect(() => {
    if (codeData) {
      setLineItemData(codeData);
    } else {
      setLineItemData();
    }
  }, [codeData]);

  const { createMutation } = usePostData(
    `/icd10Codes/create${globalAppointmentData?.id}`,
    QueryKeyToInvalidate
  );

  const { patchMutation } = usePatchData(
    `/icd10Codes/update${lineItemData?.id}`,
    QueryKeyToInvalidate
  );

  const {
    setIsSuccessfullMutation,
    setError,
    setSuccessfullMutationFeedbackMessage,
  } = useIcd10Component();

  function handleChange(event) {
    const { name, value } = event.target;

    setLineItemData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));

    setChanges((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  }

  useEffect(() => {
    setIsSuccessfullMutation(false);
    let timeout = "";
    if (patchMutation.isSuccess || createMutation.isSuccess) {
      //TODO instead of havung this ugy usefecct with this logic rather place it within the handlesubmit fucntion to make it cleaner. add it will be 10 times easier to set errors this way
      setIsSuccessfullMutation(true);
      setSuccessfullMutationFeedbackMessage(
        patchMutation.isSuccess ? "code updated" : "code created"
      );
      timeout = setTimeout(() => {
        setIsSuccessfullMutation(false);
        patchMutation.isSuccess
          ? patchMutation.reset()
          : createMutation.reset();
      }, 2000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [
    patchMutation.isSuccess,
    patchMutation.isIdle,
    createMutation.isSuccess,
    createMutation.error,
    patchMutation.error,
    createMutation.isIdle,
  ]);

  async function handleSubmit() {
    if (codeData) {
      await patchMutation.mutateAsync(changes);
      refetchIcd10TableData();
      setChanges({});
      setTimeout(() => {
        hideComponent();
      }, 2100);
    } else {
      await createMutation.mutateAsync(lineItemData);
      refetchIcd10TableData();
      setTimeout(() => {
        hideComponent();
      }, 2100);
    }
  }

  return (
    <>
      <div
        className="w-fit
       h-fit bg-white p-8"
      >
        <table className=" text-wrap table-fixed">
          <thead>
            <tr>
              <th>ICD10-Code</th>
              <th>Procedural-Code</th>
              <th>Price </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  className="border-none focus:ring-transparent"
                  onChange={handleChange}
                  type="text"
                  name="icd_10_code"
                  value={lineItemData?.icd_10_code || ""}
                />
              </td>
              <td>
                <input
                  className="border-none focus:ring-transparent"
                  onChange={handleChange}
                  type="text"
                  name="procedural_codes"
                  value={lineItemData?.procedural_codes || ""}
                />
              </td>
              <td>
                <input
                  className="border-none focus:ring-transparent"
                  onChange={handleChange}
                  type="text"
                  name="price"
                  value={lineItemData?.price || ""}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-between min-w-full mt-2">
          <Button onClick={hideComponent} color="inherit" variant="contained">
            Close
          </Button>
          <div className="flex gap-2">
            {!codeData && (
              <Button
                onClick={() => {
                  createMutation.mutate(lineItemData);
                  setLineItemData({});
                  setChanges({});
                  refetchIcd10TableData();
                }}
                type="submit"
                variant="contained"
                color="primary"
                disabled={Object.keys(changes).length === 0}
              >
                Add & Add more
              </Button>
            )}
            <Button
              disabled={Object.keys(changes).length === 0}
              onClick={handleSubmit}
              variant="contained"
              color="primary"
            >
              {codeData ? "Save" : "Add"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
