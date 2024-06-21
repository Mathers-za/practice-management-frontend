import { IconButton } from "@mui/material";
import { Outlet } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import InvoicesAndPaymentsPortalDropDownMenu from "./InvoicesAndPaymentsPortalDropDownMenu";

export default function InvoicesAndPaymentsPortal() {
  const [showDropDownMenu, setShowDropDownMenu] = useState(false);
  return (
    <>
      <div className="relative h-screen">
        <div className="absolute top-2 left-2 z-10 ">
          <IconButton
            size="small"
            sx={{
              "&:hover": {
                backgroundColor: "transparent",
              },
              marginBottom: "0px",
            }}
            onClick={() => setShowDropDownMenu(!showDropDownMenu)}
          >
            <MoreVertIcon />
          </IconButton>
          <div className=" ml-0.5 w-fit  ">
            <InvoicesAndPaymentsPortalDropDownMenu
              onclick={() => setShowDropDownMenu(false)}
              showComponent={showDropDownMenu}
            />
          </div>
        </div>
        <Outlet />
      </div>
    </>
  );
}
