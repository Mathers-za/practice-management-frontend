import DisplaySingleError from "../components/miscellaneous components/WarningMessage";
import SubmitButton from "../components/miscellaneous components/SubmitButton";
import Input from "../components/miscellaneous components/DisplayTextInput";

export default function ComponentView() {
  return (
    <>
      <div className="flex flex-col gap-3">
        <DisplaySingleError error={"You Beast you little rat "} />

        <SubmitButton text={"Submit"} />

        <Input type="text" labelText="Username" />
      </div>
    </>
  );
}
