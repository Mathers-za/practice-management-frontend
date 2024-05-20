export default function Badge({ classname, label }) {
  return (
    <>
      <div
        className={`size-6 text-sm flex justify-center items-center text-white bg-sky-400 rounded-full ${classname}`}
      >
        {label}
      </div>
    </>
  );
}
