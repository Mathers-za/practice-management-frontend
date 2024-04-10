import { useEffect, useState } from "react";
import defaultData from "../../DefaultData/defaultData";
import SideBar from "../SideBar/SideBar";
import { Outlet } from "react-router-dom";
import { useFetchData, usePostData } from "../../CustomHooks/serverStateHooks";
import MainMenuSideBar from "../mainMenuSideBar/MainMenuSideBar";
import MainMenuTopBar from "../MainMenuTopBar/MainMenuTopBar";

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

  const { createMutation: emailNotificationMutation } = usePostData(
    `/emailNotifications/create`
  );

  useEffect(() => {
    async function createInitialRowProfileAndPractice() {
      try {
        const data = await profileMutation.mutateAsync(defaultData.profileData);

        profileIdStateSetter(data.id);

        practiceMutation.mutate({ profile_id: data.id });
        emailNotificationMutation.mutate({ profile_id: data.id });
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
      <div>
        <div className=" left-0 top-0 min-w-full ">
          <MainMenuTopBar />
        </div>
        <div className=" flex gap-10 left-0 top-0 bottom-0 max-h-full">
          <MainMenuSideBar />
          <Outlet />
        </div>
      </div>
    </>
  );
}
