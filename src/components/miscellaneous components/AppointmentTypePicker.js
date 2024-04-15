import { useFetchData } from "../../CustomHooks/serverStateHooks";
import GenericTopBar from "./GenericTopBar";
import SubmitButton from "./SubmitButton";

export default function AppointmentTypePicker({
  profileId,
  hideComponent,
  onclick,
}) {
  const { data: appointTypeData } = useFetchData(
    `/appointmentTypes/viewAll${profileId}`,
    "appointmentTypeDataAppTypePicker"
  );

  return (
    <>
      <div className=" w-3/5 min-h-[30em] bg-blue-600 relative ">
        <GenericTopBar
          label="Select an appointment type"
          onclick={hideComponent}
        />
        <div className="flex justify-center">
          <div className="w-11/12 h-80 border-black rounded-sm shadow- shadow-current relative bg-slate-200 flex  mt-3 ">
            <div className=" absolute right-[-10px]  p-2 top-[-10px]   rounded-full select-none bg-sky-400 text-center text-white hover:bg-sky-300 cursor-pointer">
              Add
            </div>
            {appointTypeData && appointTypeData.length > 0
              ? appointTypeData.map((appType) => {
                  <div
                    key={appType.id}
                    onClick={() => onclick(appType)}
                    className="border-b border-slate-400 p-2   "
                  >
                    {appType.name}
                  </div>;
                })
              : " No content to display. Please create an appoitnment Type"}
          </div>
        </div>
        <SubmitButton
          text="Cancel"
          className=" absolute bottom-0 left-0 z-10"
          onclick={() => hideComponent()}
        />
      </div>
    </>
  );
}
