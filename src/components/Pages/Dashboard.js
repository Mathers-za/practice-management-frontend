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

  useEffect(() => {
    async function createInitialRowProfileAndPractice() {
      try {
        const data = await profileMutation.mutateAsync(defaultData.profileData);

        profileIdStateSetter(data.id);

        practiceMutation.mutate({ profile_id: data.id });
        sessionStorage.setItem("initialLogin", "false");
      } catch (error) {
        throw error;
      }
    }

    if (httpStatus && httpStatus === 204) {
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
