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
      <div
        onClick={() => (!onclick || disabled ? null : onclick())}
        className={`hover:cursor-pointer  w-full bg-white flex  min-h-10 border-b ${
          iconEnd ? "justify-between" : "justify-start"
        }  border-slate-300 px-8 py-4 items-center hover:bg-slate-300  text-slate-600 ${
          disabled &&
          "bg-white hover:bg-white text-slate-400 hover:cursor-default"
        } ${className}`}
      >
        <div className="flex gap-6 ">
          {iconStart} {text}
        </div>
        {iconEnd && iconEnd}
      </div>
    </>
  );
}
