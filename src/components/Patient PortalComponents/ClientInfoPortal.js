import { Outlet, Link } from "react-router-dom";
import CustomLinearProgressBar from "../miscellaneous components/CustomLinearProgressBar";
import { useClientInfoPortal } from "../../zustandStore/store";

export default function ClientInfoPortal() {
  const {
    patientContactDetailsPageLoadingState,
    medicalAidLoadingState,
    additionalInformationLoadingState,
  } = useClientInfoPortal();

  return (
    <>
      <div className="w-[95%] h-full mx-auto">
        <div className="flex  relative top-5 font-semibold  shadow-md text-base shadow-black/40 rounded-sm  w-[90%] z-10 h-11 mx-auto items-center  bg-sky-400 justify-around">
          <Link to={"patientContactDetails"}>Contact Details</Link>
          <Link to={"medicalAid"}>Medical Aid information</Link>
          <Link to={"additionalInformation"}>Additional Information</Link>
          <Link to={"jotform"}>Send Form</Link>
          <CustomLinearProgressBar
            className="absolute left-0 -bottom-1 w-full"
            isLoading={
              patientContactDetailsPageLoadingState ||
              medicalAidLoadingState ||
              additionalInformationLoadingState
            }
          />
        </div>
        <div className="   mx-auto h-fit overflow-hidden p-8 border border-slate-300 shadow-md shadow-black/30">
          <div className="mt-5   ">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
