import { Link } from "react-router-dom";
import SideBarItemsWithIconDiv from "../miscellaneous components/SideBarItemsWithIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function MainMenuSideBar({ itemsArray }) {
  return (
    <>
      <div className="min-w-full bg-slate-500 h-fit  sticky left-0 top-0 bottom-0 flex flex-col flex-wrap justify-center   ">
        <div className=" pl-4 flex items-center space-x-1 ">
          <p>
            <FontAwesomeIcon
              icon="fa-solid fa-bars"
              size="2xl"
              style={{ color: "whitesmoke" }}
            />
          </p>
          <h1 className="text-2xl text-white p-3 ">Schedule Sensai</h1>
        </div>
        <SideBarItemsWithIconDiv
          icon={<FontAwesomeIcon icon="fa-solid fa-user" size="lg" />}
          linkText="Profile"
          linkTo="profile"
        />

        <SideBarItemsWithIconDiv
          icon={<FontAwesomeIcon icon="fa-solid fa-house-medical" size="lg" />}
          linkText="Practice"
          linkTo={"practice"}
        />
        <SideBarItemsWithIconDiv
          linkText={"Patient List"}
          linkTo={"patient/search"}
          icon={<FontAwesomeIcon icon="fa-solid fa-rectangle-list" size="lg" />}
        />
        <SideBarItemsWithIconDiv
          linkText={"Create Patient"}
          linkTo={"patientCreate"}
          icon={<FontAwesomeIcon icon="fa-solid fa-square-plus" size="lg" />}
        />
        <SideBarItemsWithIconDiv
          linkText={"Create appointment"}
          linkTo={"createAppointment"}
          icon={<i class="fa-solid fa-circle-plus fa-lg"></i>}
        />
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
          linkText={"Email Notification Customization"}
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
        <SideBarItemsWithIconDiv linkText={"invoicesPastDue"} />
      </div>
    </>
  );
}
