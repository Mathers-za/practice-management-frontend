import { useEffect, useState } from "react";
import style from "./CodeLineItem.module.css";

export default function CodeLineItem({
  toggleLineItemFlag,
  createMode,
  postData,
  patchData,
  passedData,
  financialsDataRefetch,
}) {
  const [lineItemData, setLineItemData] = useState({ ...passedData });
  const [changes, setChanges] = useState({});

  useEffect(() => {
    if (createMode) {
      setLineItemData({});
      setChanges({});
    }
  }, []);

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
      <div className={style.container}>
        <table className={style.table}>
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
                value={lineItemData?.icd_10_code || ""}
              />
            </td>
            <td>
              <input
                onChange={handleChange}
                type="text"
                name="procedural_codes"
                value={lineItemData?.procedural_codes || ""}
              />
            </td>
            <td>
              <input
                onChange={handleChange}
                type="text"
                name="price"
                value={lineItemData?.price || ""}
              />
            </td>
          </tr>
        </table>
        <div className={style.buttonGrouping}>
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
