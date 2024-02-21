import { useEffect, useRef, useState } from "react";
import {
  useFetchData,
  usePatchData,
  usePostData,
} from "../../../CustomHooks/serverStateHooks";
import "./ICDTable.css";
import CodeLineItem from "./LineItemSelection";

export default function ICD10Table({ appointmentId, appointmentTypeId }) {
  const passCodeData = useRef(null);
  const { data: ICD10Data } = useFetchData(
    `/icd10Codes/view${appointmentId}`,
    "PatientICD10Data"
  );
  const { data: predefinedICDCData, reFetch } = useFetchData(
    `/predefinedIcd10/view${appointmentTypeId}`,
    "predefinedICDData"
  );
  const { patchMutation } = usePatchData(
    `/icd10Codes/update${passCodeData.id}`,
    "PatientICD10Data"
  );

  const [codesForMapping, setCodesForMapping] = useState();

  const { createMutation } = usePostData(`/icd10Codes/create${appointmentId}`);
  const [showLineItem, setShowLineItem] = useState(false);
  const [createMode, setCreateMode] = useState();

  useEffect(() => {
    if (ICD10Data && predefinedICDCData) {
      setCodesForMapping(ICD10Data);
    } else if (predefinedICDCData && !ICD10Data) {
      predefinedICDCData.forEach(async (codeObject) => {
        await createMutation.mutateAsync(codeObject);
      });
      reFetch();
    } else if (!ICD10Data && !predefinedICDCData) {
      setCodesForMapping([]);
    }
  }, [ICD10Data, predefinedICDCData]);

  function toggleLineItemFlag() {
    setShowLineItem(false);
  }

  function postData(data) {
    createMutation.mutate(data);
  }

  function patchData(data) {
    patchMutation.mutate(data);
  }

  return (
    <>
      <div className="container">
        <table className="tableContainer">
          <button
            onClick={() => {
              setShowLineItem(true);
              setCreateMode(true);
            }}
            className="addBtn"
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
                  <td>
                    {code?.icd_10_code} <button className="edit-btn">E</button>{" "}
                    <button className="delete-btn">D</button>
                  </td>
                  <td>
                    {code?.procedural_codes}{" "}
                    <button className="edit-btn">E</button>{" "}
                    <button className="delete-btn">D</button>
                  </td>
                  <td>
                    {code?.price}{" "}
                    <button
                      onClick={() => {
                        setShowLineItem(true);
                        passCodeData.current = code;
                        setCreateMode(false);
                      }}
                      className="edit-btn"
                    >
                      E
                    </button>{" "}
                    <button className="delete-btn">D</button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td className="noData" colSpan="3">
                No data to display
              </td>
            </tr>
          )}
        </table>
        {showLineItem && (
          <div className="overlay">
            <div className="overlay-content">
              <CodeLineItem
                toggleLineItemFlag={toggleLineItemFlag}
                createMode={createMode}
                postData={postData}
                patchData={patchData}
                {...passCodeData}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
