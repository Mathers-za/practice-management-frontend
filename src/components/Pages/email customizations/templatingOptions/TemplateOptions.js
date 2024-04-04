import VariableSelectionBtn from "./variable Selection Button/VariableSelectionBtn";

export default function TemplateOptions({ addToStringFn }) {
  return (
    <>
      <div>
        <div className="templateOptions-selectableVariables">
          <VariableSelectionBtn
            displayText="{{user_first_name}}"
            addToStringFn={addToStringFn}
          />
          <VariableSelectionBtn
            displayText="{{user_last_name}}"
            addToStringFn={addToStringFn}
          />
          <VariableSelectionBtn
            displayText="{{patient_first_name}}"
            addToStringFn={addToStringFn}
          />
          <VariableSelectionBtn
            displayText="{{patient_last_name}}"
            addToStringFn={addToStringFn}
          />
          <VariableSelectionBtn
            displayText="{{appointment_date}}"
            addToStringFn={addToStringFn}
          />
          <VariableSelectionBtn
            displayText="{{start_time}}"
            addToStringFn={addToStringFn}
          />
          <VariableSelectionBtn
            displayText="{{practice_name}}"
            addToStringFn={addToStringFn}
          />
          <VariableSelectionBtn
            displayText="{{practice_address}}"
            addToStringFn={addToStringFn}
          />
          <VariableSelectionBtn
            displayText="{{appointment_type_name}}"
            addToStringFn={addToStringFn}
          />
        </div>
      </div>
    </>
  );
}
