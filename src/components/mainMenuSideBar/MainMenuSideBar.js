import SideBarItemsWithIconDiv from "../miscellaneous components/SideBarItemsWithIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalStore } from "../../zustandStore/store";
import { duration } from "@mui/material";

export default function MainMenuSideBar() {
  const [showDropDownSettings, setShowDropDownSettings] = useState(false);
  const { globalProfileData } = useGlobalStore();
  return (
    <>
      <div className="min-w-full bg-slate-500 h-full  sticky left-0 top-0 bottom-0 flex flex-col text-nowrap  ">
        <div className=" flex items-center pl-4  mb-5  py-2">
          <h2 className="text-2xl text-white">
            Welcome{" "}
            {(globalProfileData?.first_name || "") +
              " " +
              (globalProfileData?.last_name || "")}
          </h2>
        </div>
        <SideBarItemsWithIconDiv
          linkText={"Patient List"}
          linkTo={"patient/search"}
          icon={<FontAwesomeIcon icon="fa-solid fa-rectangle-list" size="lg" />}
        />
        <div
          className="relative"
          onClick={() => setShowDropDownSettings(!showDropDownSettings)}
        >
          <SideBarItemsWithIconDiv
            icon={<SettingsIcon />}
            linkText="Profile settings"
          />
          <div className="absolute right-3  top-1/2 transform -translate-y-1/2">
            <FontAwesomeIcon
              icon={`fa-solid ${
                showDropDownSettings ? "fa-chevron-up" : "fa-chevron-down"
              } `}
              style={{ color: "white" }}
              size="lg"
            />
          </div>
        </div>
        <AnimatePresence>
          {showDropDownSettings && (
            <motion.div
              initial={{ height: 0, zIndex: -1 }}
              animate={{
                height: "auto",
                zIndex: 1,
              }}
              transition={{ duration: 0.1 }}
              className="flex flex-col justify-center border-b border-white pb-2 "
            >
              <SideBarItemsWithIconDiv
                icon={<FontAwesomeIcon icon="fa-solid fa-user" size="lg" />}
                linkText="Profile"
                linkTo="profile"
              />

              <SideBarItemsWithIconDiv
                icon={
                  <FontAwesomeIcon icon="fa-solid fa-house-medical" size="lg" />
                }
                linkText="Practice"
                linkTo={"practice"}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <SideBarItemsWithIconDiv
          linkText={"Appointment Type Portal"}
          linkTo={"appointmentTypePortal"}
          icon={<FontAwesomeIcon icon="fa-solid fa-list-check" size="lg" />}
        />
        <SideBarItemsWithIconDiv
          linkText={"View Appointments"}
          linkTo={"appointmentPortal"}
          icon={<i class="fa-regular fa-calendar-check fa-lg"></i>}
        />
        <SideBarItemsWithIconDiv
          linkText={"Payments Tracker"}
          linkTo={"paymentsTracker"}
          icon={<FontAwesomeIcon icon="fa-solid fa-chart-column" size="lg" />}
        />
        <SideBarItemsWithIconDiv
          linkText={`Email Notification Customization`}
          linkTo={"emailNotifications"}
          icon={<FontAwesomeIcon icon="fa-solid fa-envelope" size="lg" />}
        />
        <SideBarItemsWithIconDiv
          linkText={"Calendar"}
          linkTo={"calendar"}
          icon={<FontAwesomeIcon icon="fa-regular fa-calendar" size="lg" />}
        />
        <SideBarItemsWithIconDiv
          linkText={"Custom Component styling"}
          linkTo={"componentStyling"}
          icon={<FontAwesomeIcon icon="fa-solid fa-mortar-pestle" size="lg" />}
        />
        <SideBarItemsWithIconDiv
          linkText={"Invoice Progress"}
          linkTo={"invoiceProgress"}
          icon={<FontAwesomeIcon icon="fa-solid fa-receipt" size="lg" />}
        />
        <SideBarItemsWithIconDiv
          linkTo={"invoicesPastDue"}
          linkText={"Invoice past due"}
        />
      </div>
    </>
  );
}
