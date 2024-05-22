import VariableSelectionBtn from "./variable Selection Button/VariableSelectionBtn";
import { Chip } from "@mui/material";

export default function TemplateOptions({ addToStringFn }) {
  return (
    <>
      <div className=" border rounded-md shadow-md border-slate-500 h-[16.4rem] ">
        <h2 className="text-center  mb-3">template options.</h2>
        <div className=" w-3/4 mx-auto  flex flex-wrap gap-3">
          <Chip
            color="secondary"
            label="{{user_first_name}}"
            onClick={() => addToStringFn("{{user_first_name}}")}
          />
          <Chip
            color="secondary"
            label="{{user_last_name}}"
            onClick={() => addToStringFn("{{user_last_name}}")}
          />
          <Chip
            color="secondary"
            label="{{patient_first_name}}"
            onClick={() => addToStringFn("{{patient_first_name}}")}
          />
          <Chip
            color="secondary"
            label="{{patient_last_name}}"
            onClick={() => addToStringFn("{{patient_last_name}}")}
          />
          <Chip
            color="secondary"
            label="{{appointment_date}}"
            onClick={() => addToStringFn("{{appointment_date}}")}
          />
          <Chip
            color="secondary"
            label="{{start_time}}"
            onClick={() => addToStringFn("{{start_time}}")}
          />
          <Chip
            color="secondary"
            label="{{practice_name}}"
            onClick={() => addToStringFn("{{practice_name}}")}
          />
          <Chip
            color="secondary"
            label="{{appointment_type_name}}"
            onClick={() => addToStringFn("{{appointment_type_name}}")}
          />
          <Chip
            color="secondary"
            label="{{practice_address}}"
            onClick={() => addToStringFn("{{practice_address}}")}
          />
        </div>
        <div className="text-center mt-4">
          <h2>Importnat note:</h2>
          <p>
            The format of each option above is critical so avoid altering the
            format.
          </p>
        </div>
      </div>
    </>
  );
}
