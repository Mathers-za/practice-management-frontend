import { usePagination } from "../../../CustomHooks/serverStateHooks";
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
import { usePatientPortalStore } from "../../../zustandStore/store";
import { Pagination, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useSetLoadingStates } from "../../../CustomHooks/otherHooks";

export default function PatientTreatmentNotesList() {
  const { patientId } = usePatientPortalStore();
  const [showCreateTreatmentNote, setShowCreateTreatmentNote] = useState(false);
  const [showPatchTreatmentNote, setShowPatchTreatmentNote] = useState(false);
  const treatmentNoteIdForEdit = useRef();
  const [page, setPage] = useState(1);

  const { data: treatmentNotesArrayAndMetaData, isLoading } = usePagination(
    `/treatmentNotes/viewAll${patientId}`,
    ["patientTreatmentNotes", patientId, page],
    page,
    6
  );
  const { setTreatmentNotesTabLoadingState } = usePatientPortalStore();
  useSetLoadingStates(isLoading, setTreatmentNotesTabLoadingState);

  return (
    <>
      <div className=" h-screen flex flex-col  bg-white w-full max-w-full overflow-y-auto">
        <div className="absolute right-5 top-9">
          <Fab
            sx={{ zIndex: "10" }}
            type="button"
            onClick={() => setShowCreateTreatmentNote(!showCreateTreatmentNote)}
            color="primary"
            size="small"
          >
            <AddIcon />
          </Fab>
        </div>

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
          {treatmentNotesArrayAndMetaData &&
          treatmentNotesArrayAndMetaData?.data?.length > 0 ? (
            treatmentNotesArrayAndMetaData.data.map((treatmentNote) => (
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
        <div className=" flex-grow flex justify-end items-end">
          <Pagination
            onChange={(event, newPage) => setPage(newPage)}
            count={treatmentNotesArrayAndMetaData?.metaData?.totalPages}
          />
        </div>
      </div>

      {showCreateTreatmentNote && (
        <div className="fixed bg-white left-0 top-0 w-full h-screen max-h-screen overflow-auto z-10">
          <CreateTreatmentNote
            queryKeyToInvalidate={["patientTreatmentNotes", patientId, page]}
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
            queryKeyToInValidate={["patientTreatmentNotes", patientId, page]}
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
