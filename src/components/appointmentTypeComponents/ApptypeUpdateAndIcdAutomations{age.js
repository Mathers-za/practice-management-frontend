import { useEffect } from "react";
import {
  useAppointmentTypeAndIcdAutomationsPage,
  useAppointmentTypeListComponenet,
} from "../../zustandStore/store";
import PreDefinedIcdCoding from "../PreDefinedIcd10";
import GenericTopBar from "../miscellaneous components/GenericTopBar";
import UpdateAppointmentType from "./appointmentTypeUpdate";

export default function ApptypeEditsAndIcdAutomationsPage({
  appointmentTypeId,

  hideComponent,
}) {
  const refetchAppointmentTypeListData = useAppointmentTypeListComponenet(
    (state) => state.refetchAppointmentListTypeData
  );

  return (
    <>
      <GenericTopBar
        label="Appointment Type settings and Icd automations"
        onclick={() => {
          hideComponent();

          refetchAppointmentTypeListData();
        }}
      />

      <div className="bg-white flex flex-col justify-evenly p-2 h-screen overflow-y-auto ">
        <div className="bg-white  border-b border-slate-600">
          <h1 className="text-xl font-semibold mb-3">Edit Appoinment Type</h1>
        </div>
        <div className="border border-slate-600 p-4 shadow-md ">
          <UpdateAppointmentType
            hideComponent={hideComponent}
            appointmentTypeId={appointmentTypeId}
          />
        </div>

        <div className="flex items-center border-b border-slate-600">
          <h1 className=" pl-4 text-xl font-semibold mb-3">Automations</h1>
        </div>
        <div className="border border-slate-600 p-4 shadow-md ">
          <PreDefinedIcdCoding
            appTypeId={appointmentTypeId}
            hideComponent={hideComponent}
          />
        </div>
      </div>
    </>
  );
}
