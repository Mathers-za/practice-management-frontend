export default function SubmitButton({ onclick, text, disable = false }) {
  return (
    <>
      <button
        disabled={disable}
        onClick={onclick ? () => onclick() : null}
        className={`select-none bg-sky-500 disabled:bg-slate-500 disabled:text-white   ease-in duration-75 cursor-pointer  text-black min-w-28 max-w-28 py-1 rounded-sm active:text-black ri hover:bg-sky-600 hover:text-white  hover:ring-2 ring-sky-400 ring-offset-1`}
      >
        {text || "Submit"}
      </button>
    </>
  );
}
