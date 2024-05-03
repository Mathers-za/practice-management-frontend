import { useFetchData } from "../../CustomHooks/serverStateHooks";
import GenericTopBar from "./GenericTopBar";
import GenericButton from "./SubmitButton";

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
      <div className=" w-2/6 min-h-[30em] bg-white relative ">
        <GenericTopBar
          label="Select an appointment type"
          onclick={hideComponent}
        />
        <div className="flex justify-center">
          <div className="w-11/12 h-80 border-black rounded-sm overflow-auto flex-col relative bg-slate-200 flex  mt-3 ">
            <div className=" absolute z-20 right-[-10px]  p-2 top-[-10px]   rounded-full select-none bg-sky-400 text-center text-white hover:bg-sky-300 cursor-pointer">
              Add
            </div>
            {appointTypeData && appointTypeData.length > 0
              ? appointTypeData.map((appType) => {
                  return (
                    <div
                      key={appType.id}
                      onClick={() => onclick(appType)}
                      className="border-b border-slate-400 p-2  hover:bg-slate-500  "
                    >
                      {appType.appointment_name}
                    </div>
                  );
                })
              : " No content to display. Please create an appoitnment Type"}
          </div>
        </div>
        <div className="absolute bottom-2 left-2 ">
          <GenericButton text="Cancel" onclick={() => hideComponent()} />
        </div>
      </div>
    </>
  );
}
