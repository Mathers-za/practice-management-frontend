import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SideBarItemsWithIconDiv from "../miscellaneous components/SideBarItemsWithIcon";
import TopBarItemsLink from "../miscellaneous components/TopBarItemsLink";

export default function MainMenuTopBar({ toggleSideBar }) {
  return (
    <>
      <div
        className="h-full w-full bg-sky-600 flex  items-center pl-7  justify-start gap-6
       text-white  "
      >
        <button onClick={() => toggleSideBar()}>click me</button>
        <TopBarItemsLink
          toolTipText="Calendar"
          icon={<FontAwesomeIcon icon="fa-regular fa-calendar" size="xl" />}
          linkTo={"calendar"}
          toolTipUnqiueId={"calendar"}
        />
        <TopBarItemsLink
          icon={<FontAwesomeIcon icon="fa-solid fa-rectangle-list" size="xl" />}
          linkTo={"patient/search"}
          toolTipText={"Patient List"}
          toolTipUnqiueId={"patientList"}
        />

        <TopBarItemsLink
          linkTo={"invoiceProgress"}
          icon={<FontAwesomeIcon icon="fa-solid fa-receipt" size="xl" />}
          toolTipText={"invoices"}
          toolTipUnqiueId={"invoices"}
        />

        <TopBarItemsLink
          toolTipText={"Appointments"}
          toolTipUnqiueId={"appointmentsSearch"}
          icon={<FontAwesomeIcon icon="fa-brands fa-old-republic" size="xl" />}
        />
      </div>
    </>
  );
}
