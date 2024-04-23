export default function SubmitButton({ onclick, text, disable = false }) {
  return (
    <>
      <button
        disabled={disable}
        onClick={onclick ? () => onclick() : null}
        className={
          disable
            ? ` select-none bg-sky-500  ease-in duration-75 cursor-pointer  text-black min-w-28 max-w-28 py-1 rounded-sm active:text-black ri hover:bg-sky-600 hover:text-white  hover:ring-2 ring-sky-400 ring-offset-1`
            : "select-none text-black bg-slate-500 cursor-default  min-w-28 max-w-28 py-1 rounded-sm "
        }
      >
        {text || "Submit"}
      </button>
    </>
  );
}
