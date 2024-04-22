export default function DisplaySingleError({ errorMessage }) {
  return (
    <>
      <div className="min-h-16 bg-red-300  min-w-fit py-3  pl-4 select-none text-balance  ">
        <p className="text-red-600 text-lg select-none ">Warning</p>

        <p className="text-black select-none ">{errorMessage}</p>
      </div>
    </>
  );
}
