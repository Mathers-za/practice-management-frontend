import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MenuDivsWithIcon from "../miscellaneous components/MenuListDivsWithIcon";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useGlobalStore } from "../../zustandStore/store";
import { format, setHours, setMinutes } from "date-fns";
import { useState } from "react";
import InvoicePortal from "../Pages/ICD10/InvoicePage";

export default function MainOptionsMenu({ hideComponent }) {
  const [showInvoicePage, setShowInvoicePage] = useState(false);
  const {
    globalPatientData,
    globalAppointmentTypeData,
    globalAppointmentData,
    globalProfileData,
    globalPracticeDetailsData,
  } = useGlobalStore();
  return (
    <>
      <div className="min-h-1/2 min-w-full border-b bg-slate-600  border-slate-500">
        <div className="h-14 pl-4 pr-3 flex font-semibold items-center justify-between  bg-sky-500">
          <p>
            {globalPatientData.first_name +
              " " +
              globalPatientData?.last_name || ""}
            .
            {format(
              new Date(globalAppointmentData.appointment_date),
              "eee dd MMM yyyy"
            )}
            Daniel Mathers follow up appointment with Dan at Dans practice
          </p>
          <IconButton onClick={() => hideComponent()}>
            <CloseIcon color="inherit" />
          </IconButton>
        </div>
        <div>
          <MenuDivsWithIcon
            text="Manage codes"
            icon={
              <FontAwesomeIcon
                icon="fa-regular fa-file-lines"
                size="xl"
                style={{ color: "#0284C7" }}
              />
            }
            displayText="Manage codes"
          />
        </div>

        <MenuDivsWithIcon
          onclick={() => setShowInvoicePage(!showInvoicePage)}
          icon={
            <FontAwesomeIcon
              icon="fa-regular fa-credit-card"
              size="lg"
              style={{ color: "#0284C7" }}
            />
          }
          text="Invoice"
        />

        <div>
          <MenuDivsWithIcon
            icon={
              <FontAwesomeIcon
                icon="fa-solid fa-coins"
                size="lg"
                style={{ color: "#0284C7" }}
              />
            }
            text="Add payment"
          />
        </div>
        <div>
          <MenuDivsWithIcon
            icon={
              <FontAwesomeIcon
                icon="fa-solid fa-xmark"
                size="lg"
                style={{ color: "#0284C7" }}
              />
            }
            text="Cancel"
          />
        </div>

        <div>
          <MenuDivsWithIcon
            icon={
              <FontAwesomeIcon
                icon="fa-solid fa-trash"
                size="lg"
                style={{ color: "#0284C7" }}
              />
            }
            text="Delete"
          />
        </div>
        {showInvoicePage && (
          <div>
            <InvoicePortal />
          </div>
        )}
      </div>
    </>
  );
}
