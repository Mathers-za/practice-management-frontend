export default function DivSvgDisplayCombo({ icon, displayText, onclick }) {
  return (
    <>
      <div
        onClick={onclick ? () => onclick() : null}
        className=" border-y-2 cursor-pointer flex justify-start items-center min-w-full  min-h-20 pl-8 ease-in duration-[80ms] text-wrap bg-slate-300  hover:bg-slate-400  "
      >
        {icon}
        <div> {displayText}</div>
      </div>
    </>
  );
}
