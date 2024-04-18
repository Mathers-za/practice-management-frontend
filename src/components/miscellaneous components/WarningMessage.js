export default function DisplaySingleError({ myError }) {
  return (
    <>
      <div className="min-h-16 bg-red-300  min-w-fit p-x-1 pb-2 pl-4 select-none text-balance  ">
        <p className="text-red-600 text-lg select-none ">Warning</p>
        {myError &&
          myError.map((err) => (
            <p className="text-black text-sm select-none ">{err}</p>
          ))}
      </div>
    </>
  );
}
