export default function CustomTextArea({
  name,
  onchange,
  labelText,
  placeholder,
  bottomInfo,
  value,
  cols = 10,
  rows = 8,
  required = false,
}) {
  return (
    <>
      <div className="group min-w-full min-h-full space-y-1 ">
        <label className="  first-letter:text-sm resize-none  focus:ring-transparent ring-sky-400  group-focus-within:text-sky-500 cursor-text block  ">
          {labelText}
        </label>
        <textarea
          required={required}
          cols={cols}
          rows={rows}
          className="peer/textArea min-w-full placeholder:text-sm rounded-md  resize-none"
          name={name}
          placeholder={placeholder}
          onChange={onchange ? (event) => onchange(event) : null}
          value={value}
        ></textarea>
        <p className="opacity-0 mt-1  peer-focus/textArea:opacity-100 text-sm text-slate-500">
          {bottomInfo}
        </p>
      </div>
    </>
  );
}
