export default function MenuDivsWithIcon({ className, icon, text, onclick }) {
  return (
    <>
      <div
        onClick={() => (onclick ? onclick() : null)}
        className={` bg-white flex gap-6 min-h-10 border-b border-slate-300 pl-8 py-4 items-center hover:bg-slate-300 text-slate-600 ${className}`}
      >
        {icon} {text}
      </div>
    </>
  );
}
