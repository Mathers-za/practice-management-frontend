import { format } from "date-fns";
import { useGlobalStore } from "../../../zustandStore/store";
import { Button } from "@mui/material";

export default function TreatmentNoteListItem({
  treatmentNoteData,
  editButtonclickFn,
}) {
  const globalProfileData = useGlobalStore((state) => state.profileData);
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
        <div className="absolute top-1 right-1">
          <Button
            sx={{
              padding: "4px 6px",
              color: "white",
              backgroundColor: "#64748b",
            }}
            size="small"
            variant="contained"
            onClick={() => editButtonclickFn(treatmentNoteData?.id)}
            color="warning"
          >
            Edit/view
          </Button>
        </div>
      </div>
    </>
  );
}
