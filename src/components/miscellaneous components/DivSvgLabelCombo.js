export default function DivSvgDisplayCombo({ svgSrc, displayText, onclick }) {
  return (
    <>
      <div
        onClick={onclick ? () => onclick() : null}
        className=" cursor-pointer flex items-center min-w-full min-h-20 pl-8 ease-in duration-[80ms] text-wrap bg-slate-300  hover:bg-slate-400  "
      >
        <p>Img {svgSrc}</p>
        <div> {displayText}</div>
      </div>
    </>
  );
}
