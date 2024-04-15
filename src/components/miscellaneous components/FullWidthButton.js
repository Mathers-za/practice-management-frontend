export default function FullWithButton({ contentText, onclick, disabled }) {
  return (
    <>
      <button
        disabled={disabled}
        className=" disabled:bg-slate-200 disabled:text-black disabled:text-opacity-50 disabled:cursor-default  text-white bg-sky-400 text font-semibold hover:bg-opacity-80 ease-in duration-[50ms] rounded-sm cursor-pointer select-none min-w-full text-center py-3 "
        onClick={() => (onclick ? onclick() : null)}
      >
        {contentText}
      </button>
    </>
  );
}
