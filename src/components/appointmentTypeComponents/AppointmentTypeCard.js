import { useEffect, useState } from "react";

import {
  useGlobalStore,
  useAppointmentTypeAndIcdAutomationsPage,
} from "../../zustandStore/store";

import ApptypeEditsAndIcdAutomationsPage from "./ApptypeUpdateAndIcdAutomations{age";

export default function AppointmentTypeCard({
  appointmentTypeData,
  predefinedIcdcodes,
}) {
  console.log(predefinedIcdcodes);
  const { globalPracticeDetailsData } = useGlobalStore();
  const resetAppointmentTypeUpdateAndAutomationsZustandStore =
    useAppointmentTypeAndIcdAutomationsPage((state) => state.resetAll);
  const [showApptypeEdit, setShowAppTypeEdit] = useState(false);
  console.log(globalPracticeDetailsData);
  const [total, setTotal] = useState();

  useEffect(() => {
    let sum = 0;
    if (
      predefinedIcdcodes &&
      predefinedIcdcodes.some((price) => price != null)
    ) {
      predefinedIcdcodes.forEach((code) => (sum += parseInt(code.price)));
    }
    setTotal(sum);
  }, [predefinedIcdcodes, appointmentTypeData]);

  return (
    <>
      <div className=" h-97 overflow-auto  min-w-full bg-white border shadow-md shadow-gray-600/75  ">
        <div className="relative">
          {" "}
          <img src="../images/qb0FeYn.jpeg" alt="working" />
          <button
            onClick={() => {
              setShowAppTypeEdit(!showApptypeEdit);
              resetAppointmentTypeUpdateAndAutomationsZustandStore();
            }}
            className="px-2 py-1 bg-slate-300 text-back hover:bg-slate-400 absolute top-1 right-1"
          >
            Edit
          </button>
        </div>

        <div>
          <div className="flex justify-between items-center p-2">
            <div>
              <p className="text-base">
                {appointmentTypeData.appointment_name}{" "}
              </p>
              <p className="text-sm text-slate-500 mt-0">
                {appointmentTypeData?.duration || ""} minutes
              </p>
            </div>
            <div>
              <p>
                {total
                  ? `R${total.toFixed(2)}`
                  : appointmentTypeData?.price || ""}{" "}
              </p>

              <p className="text-sm text-slate-500">
                {total ? "Automated price" : "Price"}
              </p>
            </div>
          </div>
          {globalPracticeDetailsData.practice_address && (
            <div className="space-y-2">
              <p className="  px-2 py-1 bg-slate-400   ">Location</p>
              <div className="px-1 rounded-md bg-slate-400 w-3/4 mx-auto text-white text-sm text-center">
                {globalPracticeDetailsData.practice_address}
              </div>
            </div>
          )}
          {predefinedIcdcodes && predefinedIcdcodes.length > 0 ? (
            <div>
              <p className="p-1 bg-slate-400 ">Coding</p>
              <table className="  w-full ">
                <tbody className="border-none">
                  {predefinedIcdcodes.map((code) => (
                    <div className="flex justify-around columns-3 border-b border-slate-500 py-1">
                      {" "}
                      <td className="border-none  ">{code.icd10_code || ""}</td>
                      <td className="border-none">
                        {code?.procedural_code || ""}
                      </td>
                      <td className="border-none ">
                        {code.price ? `R${code.price}` : ""}
                      </td>
                    </div>
                  ))}
                </tbody>
              </table>
              {total || total === 0 ? (
                <p className="text-end px-2">
                  <span className="font-bold">Total</span>: R{total || "0"}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
        {showApptypeEdit && (
          <div className="z-10 fixed left-0 top-0 w-full h-screen max-h-screen overflow-auto bg-black bg-opacity-80 ">
            <ApptypeEditsAndIcdAutomationsPage
              appointmentTypeId={appointmentTypeData.id}
              hideComponent={() => setShowAppTypeEdit(!showApptypeEdit)}
              icd10Total={total && total}
            />
          </div>
        )}
      </div>
    </>
  );
}
