import { useEffect, useRef, useState } from "react";
import {
  useFetchData,
  usePatchData,
  usePostData,
} from "../../../CustomHooks/serverStateHooks";
import styles from "./ICDTable.module.css";
import CodeLineItem from "./LineItemSelection";
import { checkAndSetIcds } from "../../../apiRequests/apiRequests";

export default function ICD10Table({
  appointmentId,
  appointmentTypeId,
  financialsDataRefetch,
}) {
  const passCodeData = useRef(null);
  const { data: ICD10Data } = useFetchData(
    `/icd10Codes/view${appointmentId}`,
    "PatientICD10Data"
  );

  const { data: predefinedICDCData } = useFetchData(
    `/predefinedIcd10/view${appointmentTypeId}`,
    "predefinedICDData"
  );
  const { patchMutation } = usePatchData(
    `/icd10Codes/update${passCodeData.current?.id}`,
    "PatientICD10Data"
  );

  console.log(
    " appointmentId and appointmentTypeId in icd10 table comp is " +
      appointmentId +
      " " +
      appointmentTypeId
  );

  const [codesForMapping, setCodesForMapping] = useState();

  const { createMutation } = usePostData(
    `/icd10Codes/create${appointmentId}`,
    "PatientICD10Data"
  );
  const [showLineItem, setShowLineItem] = useState(false);
  const [createMode, setCreateMode] = useState();

  useEffect(() => {
    if (ICD10Data) {
      setCodesForMapping(ICD10Data);
    } else if (!ICD10Data && !predefinedICDCData) {
      setCodesForMapping([]);
    }
  }, [ICD10Data, predefinedICDCData]);

  function toggleLineItemFlag() {
    setShowLineItem(false);
  }

  async function postData(data) {
    await createMutation.mutateAsync(data);
    financialsDataRefetch();
  }

  async function patchData(data) {
    await patchMutation.mutateAsync(data);
    financialsDataRefetch();
  }

  return (
    <>
      <div className={styles.container}>
        <table className={styles.tableContainer}>
          <button
            onClick={() => {
              setShowLineItem(true);
              setCreateMode(true);
            }}
            className={styles.addBtn}
          >
            Add
          </button>
          <tr>
            <th width="35%">ICD10-Code</th>
            <th width="35%">Procedural-Code</th>
            <th width="30%">Price</th>
          </tr>
          {codesForMapping && Object.keys(codesForMapping).length > 0 ? (
            codesForMapping.map((code) => {
              return (
                <tr>
                  <td>{code?.icd_10_code}</td>
                  <td>{code?.procedural_codes}</td>
                  <td>
                    {code?.price}{" "}
                    <button
                      onClick={() => {
                        setShowLineItem(true);
                        passCodeData.current = code;
                        setCreateMode(false);
                      }}
                      className={styles["edit-btn"]}
                    >
                      E
                    </button>{" "}
                    <button className={styles["delete-btn"]}>D</button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td className={styles.noData} colSpan="3">
                No data to display
              </td>
            </tr>
          )}
        </table>
        {showLineItem && (
          <div className={styles.overlay}>
            <div className={styles["overlay-content"]}>
              <CodeLineItem
                financialsDataRefetch={() => financialsDataRefetch()}
                toggleLineItemFlag={toggleLineItemFlag}
                createMode={createMode}
                postData={postData}
                patchData={patchData}
                passedData={passCodeData.current}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
