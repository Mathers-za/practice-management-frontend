import { Chip } from "@mui/material";

export default function TemplateOptions({ addToStringFn }) {
  return (
    <>
      <div className=" border rounded-md shadow-md border-gray-300 h-[16.4rem] ">
        <h2 className="text-center text-lg  mb-3">Template options</h2>
        <div className=" w-3/4 mx-auto  flex flex-wrap gap-3">
          <Chip
            color="info"
            label="{{user_first_name}}"
            onClick={() => addToStringFn("{{user_first_name}}")}
          />
          <Chip
            color="info"
            label="{{user_last_name}}"
            onClick={() => addToStringFn("{{user_last_name}}")}
          />
          <Chip
            color="info"
            label="{{patient_first_name}}"
            onClick={() => addToStringFn("{{patient_first_name}}")}
          />
          <Chip
            color="info"
            label="{{patient_last_name}}"
            onClick={() => addToStringFn("{{patient_last_name}}")}
          />
          <Chip
            color="info"
            label="{{appointment_date}}"
            onClick={() => addToStringFn("{{appointment_date}}")}
          />
          <Chip
            color="info"
            label="{{start_time}}"
            onClick={() => addToStringFn("{{start_time}}")}
          />
          <Chip
            color="info"
            label="{{practice_name}}"
            onClick={() => addToStringFn("{{practice_name}}")}
          />
          <Chip
            color="info"
            label="{{appointment_type_name}}"
            onClick={() => addToStringFn("{{appointment_type_name}}")}
          />
          <Chip
            color="info"
            label="{{practice_address}}"
            onClick={() => addToStringFn("{{practice_address}}")}
          />
        </div>
        <div className="text-center mt-4">
          <h2 className="text-orange-500">Important note:</h2>
          <p>
            Avoid altering the braces ie: {"{{}}"} of the template options to
            avoid errors
          </p>
        </div>
      </div>
    </>
  );
}
