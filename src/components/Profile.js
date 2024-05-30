import { useEffect, useState } from "react";
import { useFetchData, usePatchData } from "../CustomHooks/serverStateHooks";
import { useGlobalStore } from "../zustandStore/store";
import { profileValidationSchema } from "../form validation Schemas/validationSchemas";
import { Button, TextField } from "@mui/material";
import Alert from "@mui/material/Alert";

export default function Profile() {
  const { data } = useFetchData("/profile/view", "profileData");
  const {
    globalProfileData,

    setGlobalProfileData,
  } = useGlobalStore();
  const [error, setError] = useState();
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
      await profileValidationSchema.validate(profileData);

      const { data } = await patchMutation.mutateAsync(changes);
      setGlobalProfileData(data);
      setError();
      setChanges({});
    } catch (error) {
      setError(error.message);
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
                  required
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
              {error && <Alert severity="warning">{error}</Alert>}
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
