import { useFetchData } from "../../../CustomHooks/serverStateHooks";
import { format } from "date-fns";
import CreateTreatmentNote from "./CreateTreatmentNote";
import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";

import { useRef, useState } from "react";
import EditTreatmentNote from "./EditTreatmentNotes";
import TreatmentNoteListItem from "./TreatmentNoteListItem";

export default function PatientTreatmentNotesList({ patientId }) {
  const [showCreateTreatmentNote, setShowCreateTreatmentNote] = useState(false);
  const [showPatchTreatmentNote, setShowPatchTreatmentNote] = useState(false);
  const treatmentNoteIdForEdit = useRef();
  const { data } = useFetchData(
    `/treatmentNotes/viewAll${patientId}`,
    "treatmentNoteData"
  );

  return (
    <>
      <div className="h-screen max-h-screen w-full max-w-full overflow-y-auto">
        <button
          onClick={() => setShowCreateTreatmentNote(!showCreateTreatmentNote)}
          type="button"
        >
          {" "}
          Add note{" "}
        </button>

        <Timeline
          position="right"
          sx={{
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
              padding: 1,
              width: "100%",
            },
            width: "100%",
          }}
        >
          {data && data.length > 0 ? (
            data.map((treatmentNote) => (
              <TimelineItem key={treatmentNote.id}>
                <TimelineSeparator>
                  <TimelineDot
                    color="primary"
                    variant="filled"
                    sx={{ width: "16px", height: "16px" }}
                  />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <TreatmentNoteListItem
                    editButtonclickFn={(id) => {
                      treatmentNoteIdForEdit.current = id;
                      setShowPatchTreatmentNote(!showPatchTreatmentNote);
                    }}
                    treatmentNoteData={treatmentNote}
                  />
                </TimelineContent>
              </TimelineItem>
            ))
          ) : (
            <p>no content</p>
          )}
        </Timeline>
      </div>

      {showCreateTreatmentNote && (
        <div className="fixed bg-white left-0 top-0 w-full h-screen max-h-screen overflow-auto z-10">
          {" "}
          <CreateTreatmentNote
            patientId={patientId}
            hideComponent={() =>
              setShowCreateTreatmentNote(!showCreateTreatmentNote)
            }
          />
        </div>
      )}

      {showPatchTreatmentNote && (
        <div className="fixed bg-white left-0 top-0 w-full h-screen max-h-screen overflow-auto z-10">
          <EditTreatmentNote
            treatmentNoteId={treatmentNoteIdForEdit.current}
            hideComponent={() =>
              setShowPatchTreatmentNote(!showPatchTreatmentNote)
            }
          />
        </div>
      )}
    </>
  );
}
