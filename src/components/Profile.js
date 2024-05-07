import { useEffect, useState } from "react";
import { useFetchData, usePatchData } from "../CustomHooks/serverStateHooks";
import { useAppointmentDataFromCreateAppointment } from "../zustandStore/store";
import Input from "./miscellaneous components/DisplayTextInput";

import GenericButton from "./miscellaneous components/SubmitButton";
import { Button, TextField } from "@mui/material";

export default function Profile() {
  const { data } = useFetchData("/profile/view", "profileData");
  const setGlobalProfileData = useAppointmentDataFromCreateAppointment(
    (state) => state.setProfileData
  );

  const [profileData, setProfileData] = useState({});
  const [changes, setChanges] = useState({});

  const { patchMutation } = usePatchData(`/profile/update${profileData?.id}`);

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
    try {
      const { data } = await patchMutation.mutateAsync(changes);
      setGlobalProfileData(data);
      setChanges({});
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="flex w-full h-full justify-center items-center max-h-full overflow-auto   ">
        <div className="w-11/12  h-fit rounded-md      bg-white">
          <form
            className="min-w-full h-fit px-4 py-6   border   shadow-md  shadow-slate-600 rounded-md relative  "
            onSubmit={handleSubmit}
          >
            {" "}
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
              <div className="col-span-2 flex justify-end items-end ">
                <Button
                  color="primary"
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={Object.keys(changes).length === 0}
                >
                  {" "}
                  Save
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
