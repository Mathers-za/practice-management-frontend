import styles from "./variableSelectionOptions.module.css";

export default function VariableSelectionBtn({ addToStringFn, displayText }) {
  return (
    <>
      <button
        onClick={() => addToStringFn(displayText)}
        className={styles["selectionOptions-btn"]}
      >
        {displayText}
      </button>
    </>
  );
}
