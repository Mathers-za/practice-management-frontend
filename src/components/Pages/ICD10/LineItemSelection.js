import { useState } from "react";

import "./CodeLineItem.css";

export default function CodeLineItem({
  toggleLineItemFlag,
  createMode,
  postData,
  patchData,
  ...passCodeData
}) {
  const [lineItemData, setLineItemData] = useState({ passCodeData });
  const [changes, setChanges] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;

    setLineItemData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));

    setChanges((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  }

  return (
    <>
      <div className="container">
        <table className="table">
          <tr>
            <th>ICD10-Code</th>
            <th>Procedural-Code</th>
            <th>Price </th>
          </tr>
          <tr>
            <td>
              <input
                onChange={handleChange}
                type="text"
                name="icd_10_code"
                value={lineItemData?.icd_10_code || null}
              />
            </td>
            <td>
              <input
                onChange={handleChange}
                type="text"
                name="procedural_codes"
                value={lineItemData?.procedural_codes || null}
              />
            </td>
            <td>
              <input
                onChange={handleChange}
                type="text"
                name="price"
                value={lineItemData?.price || null}
              />
            </td>
          </tr>
        </table>
        <div className="button-grouping">
          {" "}
          <button>Delete</button>
          {!createMode && (
            <button
              disabled={Object.keys(changes).length === 0}
              onClick={() => {
                patchData(changes);
                toggleLineItemFlag();
                setChanges({});
              }}
            >
              Save
            </button>
          )}
          {createMode && (
            <button
              disabled={Object.keys(changes).length === 0}
              onClick={() => {
                postData(changes);
                toggleLineItemFlag();
              }}
            >
              Add
            </button>
          )}
        </div>
      </div>
    </>
  );
}
