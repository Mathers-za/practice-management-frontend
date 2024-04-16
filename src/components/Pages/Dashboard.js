import { useEffect, useState } from "react";
import defaultData from "../../DefaultData/defaultData";
import SideBar from "../SideBar/SideBar";
import { Outlet } from "react-router-dom";
import { useFetchData, usePostData } from "../../CustomHooks/serverStateHooks";
import MainMenuSideBar from "../mainMenuSideBar/MainMenuSideBar";
import MainMenuTopBar from "../MainMenuTopBar/MainMenuTopBar";
import { useAppointmentDataFromCreateAppointment } from "../../zustandStore/store";

export default function DashBoard({ profileIdStateSetter }) {
  const setGlobalProfileData = useAppointmentDataFromCreateAppointment(
    (state) => state.setProfileData
  );
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
      setGlobalProfileData(data);
    }
  }, [data, httpStatus]);

  return (
    <>
      <div className="min-h-screen  grid grid-cols-12 grid-rows-12 min-w-full  ">
        <div className="col-start-3 col-end-13 row-start-1 row-end-2 sticky top-0 left-0 right-0 z-10 ">
          <MainMenuTopBar />
        </div>
        <div className="col-start-1 col-end-3 row-start-1 row-end-13   ">
          <MainMenuSideBar />
        </div>
        <div className="col-start-3 col-end-13 row-start-2 row-end-13 p-2  ">
          <Outlet />
        </div>
      </div>
    </>
  );
}
