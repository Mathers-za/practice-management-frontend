import { useFetchData } from "../../../../CustomHooks/serverStateHooks";

export default function MedicalAidDetailsDisplayComponent({
  patientId,
  invoiceData,
}) {
  const { data: patientMedicalAIdData } = useFetchData(
    `/medicalAid/view${patientId}`,
    ["ptMedAidData", patientId]
  );
  return (
    <>
      <div className="w-full h-fit border p-3 border-black">
        <p>
          Patient full name:{" "}
          {invoiceData.patient_first_name +
            " " +
            (invoiceData.patient_last_name || "")}
          <br />
          Medical Aid name: {patientMedicalAIdData?.medaid_name || ""}
          <br />
          Scheme: {patientMedicalAIdData?.medaid_scheme || ""}
          <br />
          Medical Aid number: {patientMedicalAIdData?.medaid_number || ""}
          <br />
          ID Number: {patientMedicalAIdData?.gov_id || ""}
          <br />
          {patientMedicalAIdData && patientMedicalAIdData.is_dependant
            ? "Patient is a dependant"
            : "Patient is the main member"}
          {patientMedicalAIdData && patientMedicalAIdData.is_dependant ? (
            <p>
              Main Member Fullname:
              {(patientMedicalAIdData?.mainmem_name || "") +
                " " +
                (patientMedicalAIdData?.mainmem_surname || "")}
              <br />
              Main member ID number:{" "}
              {patientMedicalAIdData?.mainmem_gov_id || ""}
            </p>
          ) : null}
        </p>
      </div>
    </>
  );
}
