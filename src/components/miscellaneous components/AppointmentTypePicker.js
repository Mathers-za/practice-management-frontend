import { useFetchData } from "../../CustomHooks/serverStateHooks";
import GenericTopBar from "./GenericTopBar";

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
      <div className="fixed left-0 top-0 min-w-full min-h-screen bg-slate-400 bg-opacity-50 z-10">
        <GenericTopBar
          label="Select an appointment type"
          onclick={hideComponent}
        />
        <div className="w-2/5 border border-black rounded-sm relative h-2/5 ">
          <div className=" absolute right-0 top-0 p-2 rounded-full bg-sky-400 text-white hover:bg-sky-300 cursor-pointer">
            add
          </div>
          {appointTypeData && appointTypeData.length > 0 ? (
            appointTypeData.map((appType) => {
              <div
                onClick={() => onclick(appType)}
                className="border-b border-slate-400 p-1"
              >
                {appType.name}
              </div>;
            })
          ) : (
            <div>No content to display. Please create an appoitnment Type</div>
          )}
        </div>
      </div>
    </>
  );
}
