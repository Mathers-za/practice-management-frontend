import { format } from "date-fns";
import { useAppointmentDataFromCreateAppointment } from "../../../zustandStore/store";

export default function TreatmentNoteListItem({
  treatmentNoteData,
  editButtonclickFn,
}) {
  const globalProfileData = useAppointmentDataFromCreateAppointment(
    (state) => state.profileData
  );
  return (
    <>
      <div className="flex max-w-full text-wrap gap-10 relative">
        <div className="space-y-2 text-nowrap">
          <p className="text-lg font-semibold">
            {format(new Date(treatmentNoteData.date), "eee d MMM yyyy")}
          </p>
          {treatmentNoteData.created_at && (
            <p>
              Created on:{" "}
              {format(new Date(treatmentNoteData.created_at), "eee d MMM yyyy")}
            </p>
          )}
          {globalProfileData && (
            <p>
              {globalProfileData.first_name +
                " " +
                globalProfileData.last_name ?? ""}
            </p>
          )}
        </div>
        <div className="space-y-2  text-wrap ">
          <p className="font-semibold text-lg ">{treatmentNoteData.title}</p>
          {treatmentNoteData?.subjective && (
            <p className=" whitespace-normal">
              Subjective: {treatmentNoteData.subjective}
            </p>
          )}
          {treatmentNoteData?.objective && (
            <p className="whitespace-normal">
              Objective: {treatmentNoteData.objective}
            </p>
          )}
          {treatmentNoteData?.assessment && (
            <p className="w-full whitespace-normal">
              Assessment: {treatmentNoteData.assessment}
            </p>
          )}
          {treatmentNoteData?.plan && (
            <p className="w-full whitespace-normal">
              Plan: {treatmentNoteData.plan}
            </p>
          )}
        </div>
        <button
          onClick={() => editButtonclickFn(treatmentNoteData.id)}
          className="px-2 py-1 bg-slate-300 text-back  hover:bg-slate-400 absolute top-1 right-1"
        >
          View/Edit
        </button>
      </div>
    </>
  );
}
