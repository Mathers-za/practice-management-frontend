export default function CancelButton({ textContent, onclick }) {
  return (
    <>
      <button
        onClick={onclick ? onclick : null}
        type="button"
        className=" w-28 py-1 rounded-sm text-blacktransition-all ease-in duration-75 hover:text-white  hover:bg-slate-500 hover:ring-1 hover:ring-white"
      >
        {textContent}
      </button>
    </>
  );
}
