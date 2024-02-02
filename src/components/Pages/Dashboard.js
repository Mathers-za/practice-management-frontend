import { useEffect, useState } from "react";
import defaultData from "../../DefaultData/defaultData";
import SideBar from "../SideBar/SideBar";
import { Outlet } from "react-router-dom";
import { useFetchData, usePostData } from "../../CustomHooks/serverStateHooks";

export default function DashBoard({ profileIdStateSetter }) {
  const { data, httpStatus } = useFetchData(
    `/profile/view`,
    "profileDataDashboard"
  );
  const { createMutation: profileMutation } = usePostData(
    `/profile/createProfile`
  );
  const { createMutation: practiceMutation } = usePostData(
    `/practiceDetails/create`
  );

  console.log(httpStatus);
  console.log(data?.id);

  useEffect(() => {
    async function createInitialRowProfileAndPractice() {
      try {
        const data = await profileMutation.mutateAsync(defaultData.profileData);
        console.log("profile created");
        console.log(data);
        profileIdStateSetter(data.id);

        practiceMutation.mutate({ profile_id: data.id });
        sessionStorage.setItem("initialLogin", "false");
        console.log("made it past practice creation");
      } catch (error) {
        console.log(error.message);
        throw error;
      }
    }
    console.log("just before http status");
    console.log(httpStatus && httpStatus);

    if (httpStatus && httpStatus === 204) {
      console.log("made it here");
      createInitialRowProfileAndPractice();
    }

    if (httpStatus === 200) {
      profileIdStateSetter(data.id);
    }
  }, [data, httpStatus]);

  return (
    <>
      <SideBar />
      <Outlet />
    </>
  );
}
