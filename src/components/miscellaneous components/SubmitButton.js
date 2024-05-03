export default function GenericButton({
  onclick,
  text,
  disable = false,
  type = "button",
  className = "",
}) {
  //TODO make this cancel button look lekker
  return (
    <>
      <button
        type={type}
        disabled={disable}
        onClick={onclick ? () => onclick() : null}
        className={`select-none bg-sky-500 disabled:ring-transparent disabled:bg-slate-500 disabled:text-white disabled:outline-none ease-in duration-75 cursor-pointer  text-black w-28 py-1 rounded-sm active:text-black  hover:bg-sky-600 hover:text-white  hover:ring-2 ring-sky-400 ring-offset-1 ${className}`}
      >
        {text || "Submit"}
      </button>
    </>
  );
}
