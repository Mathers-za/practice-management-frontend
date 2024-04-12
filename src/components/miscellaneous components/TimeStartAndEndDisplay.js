export default function TimestartAndEndDisplay({
  onclickStartTime,
  onclickEndTime,
  startTimeValue,
  endTimeValue,
}) {
  return (
    <>
      <div>
        <p className="select-none">
          <span
            onClick={() => onclickStartTime()}
            className="min-h-fit min-w-fit rounded-full select-none  text-sm  p-2 bg-slate-400  "
          >
            {startTimeValue ?? "Start Time"}
          </span>{" "}
          ---{" "}
          <span
            onClick={() => onclickEndTime()}
            className="min-h-fit text-sm rounded-full select-none  min-w-fit p-2 bg-slate-400  "
          >
            {endTimeValue ?? "End Time"}
          </span>
        </p>
        <p className="text-slate-400 select-none mt-1">
          Choose a start and end time
        </p>
      </div>
    </>
  );
}
