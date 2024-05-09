import DivSvgDisplayCombo from "../miscellaneous components/DivSvgLabelCombo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MenuDivsWithIcon from "../miscellaneous components/MenuListDivsWithIcon";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function MainOptionsMenu({ hideComponent }) {
  return (
    <>
      <div className="min-h-1/2 min-w-full border-b bg-slate-600  border-slate-500">
        <div className="h-14 pl-4 pr-3 flex font-semibold items-center justify-between  bg-sky-500">
          <p>Daniel Mathers follow up appointment with Dan at Dans practice</p>
          <IconButton onClick={() => hideComponent()}>
            <CloseIcon color="inherit" />
          </IconButton>
        </div>
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
        <MenuDivsWithIcon
          icon={
            <FontAwesomeIcon
              icon="fa-regular fa-credit-card"
              size="lg"
              style={{ color: "#0284C7" }}
            />
          }
          text="Invoice"
        />
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
        <MenuDivsWithIcon
          icon={
            <FontAwesomeIcon
              icon="fa-regular fa-clipboard"
              size="lg"
              style={{ color: "#0284C7" }}
            />
          }
          text="Add a note"
        />
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
    </>
  );
}
