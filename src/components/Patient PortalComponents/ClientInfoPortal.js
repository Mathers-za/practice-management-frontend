import { Outlet, Link } from "react-router-dom";

export default function ClientInfoPortal() {
  return (
    <>
      {" "}
      <div className="w-[95%] h-full mx-auto">
        <div className="flex relative top-5 font-semibold  shadow-md shadow-black/40 rounded-sm  w-[90%] z-10 h-11 mx-auto items-center  bg-sky-400 justify-around">
          <Link to={"patientContactDetails"}>Contact Details</Link>
          <Link to={"medicalAid"}>Medical Aid information</Link>
          <Link>Additional Information</Link>
        </div>
        <div className="   mx-auto h-fit overflow-hidden  p-8 border border-slate-300 shadow-md shadow-black/50">
          <div className="mt-5   ">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
