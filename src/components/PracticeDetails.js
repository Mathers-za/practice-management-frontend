import { useEffect, useState } from "react";
import { useFetchData, usePatchData } from "../CustomHooks/serverStateHooks";

import { useGlobalStore } from "../zustandStore/store";
import { Button, TextField } from "@mui/material";

export default function PracticeDetails({ profileId }) {
  const { data: practiceDetailsData } = useFetchData(
    `/practiceDetails/view${profileId}`,
    "practiceDetailsInPracticeComponent"
  );
  const setGlobalPracticeDetailsData = useGlobalStore(
    (state) => state.setGlobalPracticeDetails
  );

  const [practiceData, setPracticeData] = useState({});
  const [changes, setChanges] = useState({});

  const { patchMutation } = usePatchData(
    `/practiceDetails/update${practiceData?.id}`
  );

  async function handleSubmit(event) {
    event.preventDefault();
    const { data } = await patchMutation.mutateAsync(changes);
    setGlobalPracticeDetailsData(data);
    setChanges({});
  }

  useEffect(() => {
    if (practiceDetailsData) {
      setPracticeData(practiceDetailsData);
    }
  }, [practiceDetailsData]);

  function handleChange(event) {
    const { name, value } = event.target;

    setPracticeData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setChanges((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  }

  return (
    <>
      <div className="flex justify-center items-center min-w-full min-h-full overflow-auto ">
        <div className="w-11/12 border  p-4 justify-center bg-white  shadow-md  shadow-slate-600 rounded-md ">
          <form onSubmit={handleSubmit} className="space-y-8">
            <h1 className="text-xl font-semibold  border-b  border-slate-500   pb-3 ">
              Practice Details
            </h1>

            <TextField
              variant="standard"
              fullWidth
              label="Practice name"
              name="practice_name"
              value={practiceData?.practice_name || ""}
              onChange={handleChange}
              type="text"
            />

            <TextField
              variant="standard"
              label="Practice Number"
              fullWidth
              name="practice_num"
              placeholder="Practice name"
              value={practiceData?.practice_num || ""}
              onChange={handleChange}
              type="text"
            />

            <div className="flex gap-4 ">
              <div className="w-1/3">
                <TextField
                  rows={8}
                  fullWidth
                  multiline
                  onChange={handleChange}
                  name="bank_details"
                  value={practiceData?.bank_details || ""}
                  label="Banking Details"
                  sx={{ ".MuiInputBase-input": { boxShadow: "none" } }}
                />
              </div>

              <div className="w-1/3 ">
                <TextField
                  label={"Practice address"}
                  fullWidth
                  multiline
                  rows={8}
                  value={practiceData?.practice_address || ""}
                  name="practice_address"
                  onChange={handleChange}
                  sx={{ ".MuiInputBase-input": { boxShadow: "none" } }}
                />
              </div>
              <div className="w-1/3">
                <TextField
                  label="Billing address"
                  name="billing_address"
                  value={practiceData?.billing_address || ""}
                  onChange={handleChange}
                  multiline
                  rows={8}
                  sx={{ ".MuiInputBase-input": { boxShadow: "none" } }}
                  fullWidth
                />
              </div>
            </div>

            <div className="col-span-6 flex justify-end items-end ">
              <Button
                disabled={Object.keys(changes).length === 0}
                variant="contained"
                fullWidth
                type="submit"
              >
                Save
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
