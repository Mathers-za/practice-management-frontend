export default function MenuDivsWithIcon({
  className,
  iconStart = "",
  text,
  onclick,
  iconEnd = null,
}) {
  return (
    <>
      <div
        onClick={() => (onclick ? onclick() : null)}
        className={` hover:cursor-pointer  w-full bg-white flex  min-h-10 border-b ${
          iconEnd ? "justify-between" : "justify-start"
        }  border-slate-300 px-8 py-4 items-center hover:bg-slate-300 text-slate-600 ${className}`}
      >
        <div className="flex gap-6">
          {iconStart} {text}
        </div>
        {iconEnd && iconEnd}
      </div>
    </>
  );
}
