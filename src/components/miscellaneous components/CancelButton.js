export default function CancelButton({ textContent, onclick }) {
  return (
    <>
      <button
        onClick={onclick ? onclick : null}
        type="button"
        className=" w-28 py-1 rounded-sm text-white transition-all ease-in duration-300 hover:bg-slate-500 delay-200 bg-slate-600 hover:ring-1 hover:ring-white"
      >
        {textContent}
      </button>
    </>
  );
}
