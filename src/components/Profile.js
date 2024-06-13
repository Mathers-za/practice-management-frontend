import { useEffect, useState } from "react";
import { useFetchData, usePatchData } from "../CustomHooks/serverStateHooks";
import { useGlobalStore } from "../zustandStore/store";
import { profileValidationSchema } from "../form validation Schemas/validationSchemas";
import { Button, TextField } from "@mui/material";

import { useOnSubmitButtonTextstateManager } from "../CustomHooks/otherHooks";

import CustomAlertMessage from "./miscellaneous components/CustomAlertMessage";
import CustomLinearProgressBar from "./miscellaneous components/CustomLinearProgressBar";

export default function Profile() {
  const [profileData, setProfileData] = useState({});
  const { data, isLoading } = useFetchData("/profile/view", "userProfileData");
  const { setGlobalProfileData } = useGlobalStore();
  const { patchMutation } = usePatchData(`/profile/update${data?.id}`);
  const [error, setError] = useState();

  const [changes, setChanges] = useState({});
  const saveButtonText = useOnSubmitButtonTextstateManager(
    "Save",
    undefined,
    patchMutation
  );

  useEffect(() => {
    if (data) {
      setProfileData(data);
    }
  }, [data]);

  function handleChange(event) {
    const { name, value } = event.target;

    setProfileData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));

    setChanges((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    console.log("fired patch");
    setError();
    try {
      await profileValidationSchema.validate(profileData);

      const { data } = await patchMutation.mutateAsync(changes);
      setGlobalProfileData(data);
    } catch (error) {
      setError(error.message);
    }
  }
  useEffect(() => {
    if (patchMutation.isSuccess) {
      setChanges({});
    }
    console.log("is idle is " + patchMutation.isIdle);
    console.log(patchMutation.isSuccess);
  }, [patchMutation.isSuccess]);

  return (
    <>
      <div className="flex w-full h-full justify-center relative items-center max-h-full overflow-auto   ">
        <div className="w-11/12  h-fit rounded-md bg-white">
          <form
            className="min-w-full h-fit px-4 py-6    border   shadow-md  shadow-slate-600 rounded-md relative  "
            onSubmit={handleSubmit}
          >
            <div className="top-0 left-0 w-full  absolute "> </div>
            <div className="space-y-8">
              <h1 className="text-xl font-medium mb-2 border-b border-slate-500 pb-3">
                Details
              </h1>

              <div className="flex gap-3 ">
                <TextField
                  fullWidth
                  variant="standard"
                  name="first_name"
                  label="First name"
                  type="text"
                  onChange={handleChange}
                  value={profileData?.first_name || ""}
                  helperText="First name is required"
                />
                <TextField
                  fullWidth
                  variant="standard"
                  name="last_name"
                  label="Last name"
                  type="text"
                  onChange={handleChange}
                  value={profileData?.last_name || ""}
                />
              </div>

              <div className="flex gap-3">
                <TextField
                  fullWidth
                  variant="standard"
                  name="profile_email"
                  label="Email Address"
                  type="email"
                  onChange={handleChange}
                  value={profileData?.profile_email || ""}
                  helperText="Valid email fomrmat expected ie example@mail.com"
                />
                <TextField
                  fullWidth
                  variant="standard"
                  name="contact_num"
                  label="Phone number"
                  type="tel"
                  pattern="^\+27\d{9}$"
                  onChange={handleChange}
                  value={profileData?.contact_num || ""}
                  helperText="Valid format expected ie +27716489364"
                />
              </div>

              <h1 className="text-xl font-medium mb-2 border-b pb-3 border-slate-500 ">
                Additional Information
              </h1>

              <div className="mb-2">
                <TextField
                  fullWidth
                  variant="standard"
                  name="council_reg_num"
                  label="Registration Number"
                  type="text"
                  onChange={handleChange}
                  value={profileData?.council_reg_num || ""}
                  helperText="Your council registration number if applicable"
                />
              </div>
              <div>
                <TextField
                  fullWidth
                  variant="standard"
                  label="Profession"
                  name="profession"
                  onChange={handleChange}
                  type="text"
                  value={profileData?.profession || ""}
                />
              </div>

              <CustomAlertMessage
                successFlag={patchMutation.isSuccess}
                errorMessage={error}
                severityOnError="error"
                severityOnSuccess="success"
                successMessage="Successfully updated"
                errorFlag={error}
              />

              <div className="col-span-2 flex justify-end items-end ">
                <Button
                  color="primary"
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={Object.keys(changes).length === 0}
                >
                  {saveButtonText}
                </Button>
              </div>
            </div>
            <CustomLinearProgressBar isLoading={isLoading} />
          </form>
        </div>
      </div>
    </>
  );
}
