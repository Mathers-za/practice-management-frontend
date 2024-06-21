import { CircularProgress } from "@mui/material";
import GenericTopBar from "./GenericTopBar";
import { useGlobalStore } from "../../zustandStore/store";

export default function WelcomingMessageAndSpinner({ showComponent }) {
  const { globalProfileData } = useGlobalStore();
  return (
    <>
      <div className="fixed left-0 top-0 w-full h-screen flex justify-center z-0 items-center ">
        <div className="w-1/3 h-1/3 flex flex-col bg-white shadow-md   ">
          <div className="text-lg flex text-white font-semibold justify-center items-center h-14 bg-sky-600">
            Welcome{" "}
            {(globalProfileData?.first_name || "") +
              " " +
              (globalProfileData?.last_name || "")}
          </div>

          <div className=" flex-grow w-full   flex justify-center items-center  ">
            <div className="w-fit  -translate-x-6 flex gap-4 items-center ">
              <CircularProgress />
              <p>...Loading data</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
