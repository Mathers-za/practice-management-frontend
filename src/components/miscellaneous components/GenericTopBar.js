export default function GenericTopBar({ label, onclick }) {
  return (
    <>
      <div className="relative top-0 left-0 min-w-full min-h-fit p-3 font-serif text-lg text-white  bg-sky-700 flex justify-between items-center select-none ">
        <h1>{label}</h1>
        <p
          className="text-2xl mr-2  hover:text-slate-400 active:text-black"
          onClick={onclick ? () => onclick() : null}
        >
          x
        </p>
      </div>
    </>
  );
}
