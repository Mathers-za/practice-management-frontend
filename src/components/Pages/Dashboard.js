import { useEffect, useState } from "react";
import axiosRequest from "../../apiRequests/apiRequests";
import defaultData from "../../DefaultData/defaultData";
import { profileIdContext } from "../myContext";
import SideBar from "../SideBar/SideBar";
import { Route, Routes } from "react-router-dom";
import ProfilePage from "./ProfilePage";
import PracticeDetails from "../PracticeDetails";

export default function DashBoard() {
  const [profileId, setProfileId] = useState();
  const [firstTimeAccess, setFirstTimeAccess] = useState(
    localStorage.getItem("firstAccess") === null
  );

  /*setDefaultData initially sets the fields in profileData and practiceDetails tables to null if it is the users first time acessing the app*/
  async function setDefaultData() {
    try {
      const response1 = await axiosRequest("get", "/profile/view");
      console.log(response1.data.exists);

      if (response1.status === 200 && response1.data.exists === false) {
        console.log("no data exists, moving to create");

        const response2 = await axiosRequest(
          "post",
          "/profile/createProfile",
          defaultData.profileData
        );
        console.log(response2.data.data.id);

        if (response2.status === 201) {
          const response3 = await axiosRequest(
            "post",
            `/practiceDetails/create${response2.data.data.id}`,
            defaultData.practiceDetailsData
          );
          if (response3.status === 201) {
            console.log("created practice details");
            localStorage.setItem("firstAccess", "false");
            setFirstTimeAccess(false);
          }
        }
      }
    } catch (error) {
      console.log("handling erros");
      console.error(error);
    }
  }

  firstTimeAccess && setDefaultData();

  useEffect(() => {
    async function getProfileId() {
      try {
        const response = await axiosRequest("get", "/profile/view");
        if (response.status === 200) {
          console.log("aquired profile id in dashboard");

          setProfileId(response.data.data.id);
        }
      } catch (error) {
        console.error(error);
      }
    }

    getProfileId();
  }, []);
  console.log(profileId);

  return (
    <>
      <profileIdContext.Provider value={profileId}>
        <SideBar />
      </profileIdContext.Provider>
    </>
  );
}
