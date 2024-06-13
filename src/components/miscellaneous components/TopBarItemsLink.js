import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";

export default function TopBarItemsLink({
  linkTo,
  icon,
  toolTipText,
  toolTipUnqiueId,
}) {
  return (
    <>
      <div className="group flex flex-col items-center ">
        <Link
          data-tooltip-id={toolTipUnqiueId}
          className="w-fit block max-h-fit p-3 bg-inherit hover:rounded-full hover:bg-neutral-400 ease-in group: duration-75 relative "
          to={linkTo}
        >
          {icon}
        </Link>
        <Tooltip
          place="bottom"
          content={toolTipText}
          id={toolTipUnqiueId}
          delayShow={"500ms"}
          style={{
            backgroundColor: "grey",
            color: "white",
            fontSize: "0.8rem",
            padding: "8px",
          }}
          offset={"10"}
          opacity={"1"}
        />
      </div>
    </>
  );
}
