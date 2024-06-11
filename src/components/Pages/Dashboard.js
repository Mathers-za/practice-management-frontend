import { useEffect, useState } from "react";
import defaultData from "../../DefaultData/defaultData";
import SideBar from "../SideBar/SideBar";
import { Outlet } from "react-router-dom";
import { useFetchData, usePostData } from "../../CustomHooks/serverStateHooks";
import MainMenuSideBar from "../mainMenuSideBar/MainMenuSideBar";
import MainMenuTopBar from "../MainMenuTopBar/MainMenuTopBar";
import {
  useGlobalStore,
  useGlobalSubmissionAert,
} from "../../zustandStore/store";
import { motion, AnimatePresence } from "framer-motion";
import axiosRequest from "../../apiRequests/apiRequests";

export default function DashBoard({ profileIdStateSetter }) {
  const [showSideBar, setShowSideBar] = useState(true);

  const { setGlobalProfileData, setGlobalPracticeDetails } = useGlobalStore();
  const { data, httpStatus } = useFetchData(
    `/profile/view`,
    "profileDataDashboard"
  );

  async function setGlobalProfileAndPracticeData(
    userProfileData,
    profileDataSetterFn,
    practiceDetailsSetterFn
  ) {
    try {
      profileDataSetterFn(userProfileData);
      const { data: practiceDetailsData } = await axiosRequest(
        "get",
        `/practiceDetails/view${userProfileData.id}`
      );

      practiceDetailsSetterFn(practiceDetailsData);
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  function toggleSideBar() {
    setShowSideBar(!showSideBar);
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
        setGlobalPracticeDetails(practiceDetailsData);
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
      setGlobalProfileAndPracticeData(
        data,
        setGlobalProfileData,
        setGlobalPracticeDetails
      );
      profileIdStateSetter(data.id);
    }
  }, [data, httpStatus]);

  return (
    <>
      <div className="flex  w-full h-screen   ">
        <AnimatePresence>
          {showSideBar && (
            <motion.div
              initial={{ width: "0px" }}
              animate={{ width: "384px" }}
              exit={{ width: "0px" }}
              className="h-full w-96 max-h-screen overflow-y-auto  "
            >
              <MainMenuSideBar />
            </motion.div>
          )}
        </AnimatePresence>
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
