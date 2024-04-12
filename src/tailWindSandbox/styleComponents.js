import DisplaySingleError from "../components/miscellaneous components/WarningMessage";
import SubmitButton from "../components/miscellaneous components/SubmitButton";
import Input from "../components/miscellaneous components/DisplayTextInput";
import GenericTopBar from "../components/miscellaneous components/GenericTopBar";
import DivSvgDisplayCombo from "../components/miscellaneous components/DivSvgLabelCombo";
import TimestartAndEndDisplay from "../components/miscellaneous components/TimeStartAndEndDisplay";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";
import { TimeClock } from "@mui/x-date-pickers/TimeClock";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";

export default function ComponentView() {
  return (
    <>
      <div className="flex flex-col gap-3">
        <DisplaySingleError error={"You Beast you little rat "} />

        <SubmitButton text={"Save"} onclick={() => alert("hello Dad")} />

        <Input type="text" labelText="Warren" />

        <GenericTopBar label="Warren" onclick={() => alert("Hello dad")} />
        <DivSvgDisplayCombo />
        <TimestartAndEndDisplay />
        <DateCalendar
          defaultValue={new Date()}
          views={["year", "month", "day"]}
        />
        <div className="min-w-full min-h-full  justify-center flex items-center">
          <StaticTimePicker
            ampm={false}
            slotProps={{
              actionBar: { actions: ["cancel", "clear", "today", "accept"] },
            }}
          />
          <StaticDatePicker />
        </div>
      </div>
    </>
  );
}
