import { useEffect, useState } from "react";
import { useFetchData, usePatchData } from "../CustomHooks/serverStateHooks";
import Input from "./miscellaneous components/DisplayTextInput";
import SubmitButton from "./miscellaneous components/SubmitButton";
import CustomTextArea from "./miscellaneous components/CustomTextArea";
import { useAppointmentDataFromCreateAppointment } from "../zustandStore/store";

export default function PracticeDetails({ profileId }) {
  const { data: practiceDetailsData } = useFetchData(
    `/practiceDetails/view${profileId}`,
    "practiceDetails"
  );
  const setGlobalPracticeDetailsData = useAppointmentDataFromCreateAppointment(
    (state) => state.setPracticeDetails
  );

  const [practiceData, setPracticeData] = useState({});
  const [changes, setChanges] = useState({});

  const { patchMutation } = usePatchData(
    `/practiceDetails/update${practiceData?.id}`,
    "practiceDetails"
  );

  async function handleSubmit(event) {
    event.preventDefault();
    const { data } = await patchMutation.mutateAsync(changes);
    setGlobalPracticeDetailsData(data);
    setPracticeData({});
  }

  useEffect(() => {
    if (practiceDetailsData) {
      setPracticeData(practiceDetailsData);
    }
  }, [practiceDetailsData]);

  function handleChange(event) {
    const { name, value } = event.target;

    setPracticeData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setChanges((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  }

  return (
    <>
      <div className="flex justify-center items-center min-w-full min-h-full overflow-auto ">
        <div className="w-11/12 border  p-4 justify-center bg-white  shadow-md  shadow-slate-600 rounded-md ">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-6  gap-x-2 gap-y-4"
          >
            <div className="col-span-6  border-b border-black  ">
              <h1 className="text-xl font-semibold   mb-2 ">
                Practice Details
              </h1>
            </div>
            <div className="col-span-3">
              <Input
                labelText="Practice name"
                name="practice_name"
                placeholder="Practice name"
                value={practiceData?.practice_name || ""}
                onchange={handleChange}
                type="text"
                dynamicBottomInfo="Business name you would liketo display on invoices"
              />
            </div>
            <div className="col-span-3">
              <Input
                labelText="Practice Number"
                name="practice_num"
                placeholder="Practice name"
                value={practiceData?.practice_num || ""}
                onchange={handleChange}
                type="text"
                dynamicBottomInfo="Practice number to be displayed on your invoices"
              />
            </div>

            <div className="col-span-2">
              <CustomTextArea
                onchange={handleChange}
                name="bank_details"
                placeholder="Bank Details"
                value={practiceData?.bank_details || ""}
                labelText="Banking Details"
                bottomInfo="These banking details will show on invoices"
              />
            </div>

            <div className="col-span-2">
              <CustomTextArea
                labelText={"Practice address"}
                placeholder="Practice address"
                bottomInfo="Your practice/business address that will appear in the appointment email notifications."
                value={practiceData?.practice_address || ""}
                name="practice_address"
                onchange={handleChange}
              />
            </div>
            <div className="col-span-2">
              <CustomTextArea
                labelText="Billing address"
                bottomInfo={
                  "This billiing address will appear on your invoices"
                }
                name="billing_address"
                value={practiceData?.billing_address || ""}
                onchange={handleChange}
                placeholder="Billing adress"
              />
            </div>

            <div className="col-span-6 flex justify-end items-end ">
              <SubmitButton
                disable={Object.keys(changes).length === 0}
                text="Save"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
