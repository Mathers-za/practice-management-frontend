import { useEffect, useState } from "react";
import defaultData from "../../DefaultData/defaultData";
import SideBar from "../SideBar/SideBar";
import { Outlet } from "react-router-dom";
import { useFetchData, usePostData } from "../../CustomHooks/serverStateHooks";
import MainMenuSideBar from "../mainMenuSideBar/MainMenuSideBar";
import MainMenuTopBar from "../MainMenuTopBar/MainMenuTopBar";
import { useAppointmentDataFromCreateAppointment } from "../../zustandStore/store";
import { animated, useSpring } from "react-spring";

export default function DashBoard({ profileIdStateSetter }) {
  const setGlobalProfileData = useAppointmentDataFromCreateAppointment(
    (state) => state.setProfileData
  );
  const [toggleSlider, setToggleSlider] = useState(false);
  const sideBarAnimation = useSpring({
    from: { width: "18rem" },
    width: toggleSlider ? "0px" : "18rem",
    
  });

  const setGlobalPracticeDetailsData = useAppointmentDataFromCreateAppointment(
    (state) => state.setPracticeDetails
  );
  const { data, httpStatus } = useFetchData(
    `/profile/view`,
    "profileDataDashboard"
  );

  function toggleSideBar() {
    setToggleSlider(!toggleSlider);
  }

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

        const { data: practiceDetailsData } =
          await practiceMutation.mutateAsync({ profile_id: data.id });
        setGlobalPracticeDetailsData(practiceDetailsData);
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
      <div className="flex  w-full h-screen   ">
        <animated.div
          style={sideBarAnimation}
          className="h-full w-72 max-h-screen overflow-y-auto  "
        >
          <MainMenuSideBar />
        </animated.div>
        <div className="w-full flex flex-col h-full">
          <div className="w-full h-16">
            <MainMenuTopBar toggleSideBar={toggleSideBar} />
          </div>

          <div className=" w-full p-2 h-full max-h-full overflow-auto  bg-slate-200 ">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
