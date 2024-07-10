import { Link } from "react-router-dom";

import { Tooltip } from "@mui/material";

export default function TopBarItemsLink({
  linkTo,
  icon,
  toolTipText,
  toolTipUnqiueId,
}) {
  //TODO sync data in invoice progress. update invoice status as sent if invoice is sent but not full piad. also sync when fully paid.
  return (
    <>
      <div className="group flex flex-col items-center ">
        <Tooltip title={toolTipText}>
          <Link
            data-tooltip-id={toolTipUnqiueId}
            className="w-fit block max-h-fit p-3 bg-inherit hover:rounded-full hover:bg-neutral-400 ease-in group: duration-75 relative "
            to={linkTo}
          >
            {icon}
          </Link>
        </Tooltip>
      </div>
    </>
  );
}
