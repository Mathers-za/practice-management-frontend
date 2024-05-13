import { Link } from "react-router-dom";
export default function SideBarItemsWithIconDiv({ icon, linkTo, linkText }) {
  return (
    <>
      <Link
        className=" text-nowrap  min-w-full  gap-3 py-3.5 bg-inherit select-none flex    text-white font-semibold items-center cursor-pointer hover:bg-slate-700 pl-4 lg:text-base md:text-sm  "
        to={linkTo}
      >
        {icon} {linkText}
      </Link>
    </>
  );
}
