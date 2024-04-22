import { Link } from "react-router-dom";

export default function TopBarItemsLink({ linkTo, icon, toolTipText }) {
  //TODO finish topbar including the tooltips
  return (
    <>
      <div className="group flex flex-col items-center ">
        <Link
          className="w-fit block max-h-fit p-3 bg-inherit hover:rounded-full hover:bg-neutral-400 ease-in group: duration-75 relative "
          to={linkTo}
        >
          {icon}
        </Link>
        {toolTipText && (
          <div className=" absolute top-3/4 group-hover:inline-block group-hover:opacity-100 text-sm min-w-fit p-2 ease-in duration-300 opacity-0 bg-slate-500  ">
            {toolTipText}
          </div>
        )}
      </div>
    </>
  );
}
