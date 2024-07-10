import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, transform } from "framer-motion";
import TopBarItemsLink from "../miscellaneous components/TopBarItemsLink";
import { IconButton } from "@mui/material";
import InputIcon from "@mui/icons-material/Input";

export default function MainMenuTopBar({ toggleSideBar }) {
  return (
    <>
      <div
        className="h-full w-full bg-sky-600 flex  items-center pl-7  justify-start gap-6
       text-white  "
      >
        <motion.div>
          <IconButton
            sx={{ "&:hover": { backgroundColor: "transparent" } }}
            size="large"
            onClick={() => toggleSideBar()}
          >
            <InputIcon fontSize="large" sx={{ color: "white" }} />
          </IconButton>
        </motion.div>

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
          linkTo={"invoicesAndpaymentsPortal"}
          icon={<FontAwesomeIcon icon="fa-solid fa-receipt" size="xl" />}
          toolTipText={"invoices"}
          toolTipUnqiueId={"invoices"}
        />

        <TopBarItemsLink
          toolTipText={"Appointments"}
          toolTipUnqiueId={"appointmentsSearch"}
          icon={<FontAwesomeIcon icon="fa-brands fa-old-republic" size="xl" />}
          linkTo={"appointmentPortal"}
        />
      </div>
    </>
  );
}
