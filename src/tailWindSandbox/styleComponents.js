import DisplaySingleError from "../components/miscellaneous components/WarningMessage";
import SubmitButton from "../components/miscellaneous components/SubmitButton";
import Input from "../components/miscellaneous components/DisplayTextInput";
import GenericTopBar from "../components/miscellaneous components/GenericTopBar";
import DivSvgDisplayCombo from "../components/miscellaneous components/DivSvgLabelCombo";
import Experiment from "../components/miscellaneous components/Experiment";

export default function ComponentView() {
  return (
    <>
      <div className="flex flex-col gap-3">
        <DisplaySingleError error={"You Beast you little rat "} />

        <SubmitButton text={"Save"} onclick={() => alert("hello Dad")} />

        <Input type="text" labelText="Warren" />

        <GenericTopBar label="Warren" onclick={() => alert("Hello dad")} />
        <DivSvgDisplayCombo />
      </div>
    </>
  );
}
