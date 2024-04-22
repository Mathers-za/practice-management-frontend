import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SideBarItemsWithIconDiv from "../miscellaneous components/SideBarItemsWithIcon";
import TopBarItemsLink from "../miscellaneous components/TopBarItemsLink";

export default function MainMenuTopBar() {
  return (
    <>
      <div
        className="min-h-full min-w-full bg-sky-600 flex gap-2 box-border items-center justify-center justify-around
       text-white  "
      >
        <TopBarItemsLink
          toolTipText="Calendar"
          icon={<FontAwesomeIcon icon="fa-regular fa-calendar" size="xl" />}
          linkTo={"calendar"}
        />
        <TopBarItemsLink
          icon={<FontAwesomeIcon icon="fa-solid fa-rectangle-list" size="xl" />}
          linkTo={"patient/search"}
        />

        <TopBarItemsLink
          linkTo={"invoiceProgress"}
          icon={<FontAwesomeIcon icon="fa-solid fa-receipt" size="xl" />}
        />

        <p>ICON</p>
        <p>ICON</p>
        <p>ICON</p>
      </div>
    </>
  );
}
