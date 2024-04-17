export default function InputRequirements({ icon, contentText }) {
  return (
    <>
      <div className="flex items-center bg-yellow-100 min-w-full  min-h-fit px-2 py-3">
        {icon}
        <div>{contentText}</div>
      </div>
    </>
  );
}
