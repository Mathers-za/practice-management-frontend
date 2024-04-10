export default function DisplaySingleError({ error }) {
  return (
    <>
      <div className="min-h-16 bg-red-300  min-w-fit p-x-1 pb-2 pl-4 select-none text-balance  ">
        <p className="text-red-600 text-lg select-none ">Warning</p>
        <p className="text-black text-base select-none ">
          {error || "An example of an error"}
        </p>
      </div>
    </>
  );
}
