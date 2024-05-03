import { useEffect, useState } from "react";
import { useFetchData, usePatchData } from "../CustomHooks/serverStateHooks";
import { useAppointmentDataFromCreateAppointment } from "../zustandStore/store";
import Input from "./miscellaneous components/DisplayTextInput";

import GenericButton from "./miscellaneous components/SubmitButton";

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
    await patchMutation.mutateAsync(changes);

    setChanges({});
  }

  useEffect(() => {
    if (patchMutation.isSuccess) {
      setGlobalProfileData(data);
    }
  }, [patchMutation.isSuccess, data]);

  return (
    <>
      <div className="flex min-w-full min-h-full justify-center items-center ">
        <div className="w-11/12  min-h-full     bg-white">
          <form
            className="min-w-full h-fit p-4   border grid  grid-cols-2 gap-y-4 gap-x-2  shadow-md  shadow-slate-600 rounded-md relative  "
            onSubmit={handleSubmit}
          >
            {" "}
            <div className="flex col-span-2  items-center border-b border-slate-600">
              <h1 className="font-medium text-xl  border-black mb-2  ">
                Contact Details
              </h1>
            </div>
            <Input
              name="first_name"
              labelText="First name"
              type="text"
              placeholder="First name"
              onchange={handleChange}
              value={profileData?.first_name || ""}
            />
            <Input
              name="last_name"
              labelText="Last name"
              type="text"
              placeholder="Last name"
              onchange={handleChange}
              value={profileData?.last_name || ""}
            />
            <Input
              name="profile_email"
              labelText="Email Address"
              type="email"
              placeholder="Email Address"
              onchange={handleChange}
              value={profileData?.profile_email || ""}
              dynamicBottomInfo={
                "The email you would like to recieve notifications on."
              }
            />
            <Input
              name="contact_num"
              labelText="Phone number"
              type="tel"
              placeholder="Phone number"
              pattern="^\+27\d{9}$"
              onchange={handleChange}
              value={profileData?.contact_num || ""}
              dynamicBottomInfo="A valid phone number is expected eg: +27814836849"
            />
            <div className="col-span-2 flex items-center border-b border-slate-600 mb-2   ">
              <h1 className="text-xl font-medium mb-2">
                Additional Information
              </h1>
            </div>
            <div className="col-span-2  ">
              <div className="mb-2">
                <Input
                  name="council_reg_num"
                  labelText="Registration Number"
                  type="text"
                  placeholder="Registration number"
                  dynamicBottomInfo="Your personal professional council number"
                  onchange={handleChange}
                  value={profileData?.council_reg_num || ""}
                />
              </div>
              <div>
                <Input
                  labelText="Profession"
                  name="profession"
                  onchange={handleChange}
                  placeholder="Profession"
                  type="text"
                  value={profileData?.profession || ""}
                  dynamicBottomInfo="Your profession ie: chiropractor, doctor, physiotherapist etc"
                />
              </div>
            </div>
            <div className="col-span-2 flex justify-end items-end ">
              <GenericButton
                text="Save"
                disable={Object.keys(changes).length === 0}
                type="submit"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
