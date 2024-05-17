export default function MenuDivsWithIcon({
  className,
  iconStart = "",
  text,
  onclick,
  iconEnd = null,
  disabled = false,
}) {
  //TODO change to a button
  return (
    <>
      <button
        disabled={disabled}
        onClick={() => (!onclick ? null : onclick())}
        className={`hover:cursor-pointer cursor-default border-slate-300 px-6 py-4 items-center disabled:cursor-default disabled:text-slate-400 disabled:hover:bg-white hover:bg-slate-300  text-slate-600 w-full bg-white flex  min-h-10 border-b ${className} ${
          iconEnd ? "justify-between" : "justify-start"
        }   `}
      >
        <div className="flex items-center gap-5 ">
          {iconStart} {text}
        </div>
        {iconEnd && iconEnd}
      </button>
    </>
  );
}
