import React from "react";

export default function Input({
  name,
  value,
  labelText,
  placeholder,
  required,
  onchange,
  type,
}) {
  return (
    <div>
      <input
        onChange={(event) => onchange(event.target.name, event.target.value)} // Pass name and value to onchange
        type={type || "text"}
        placeholder={placeholder ?? ""}
        name={name}
        value={value}
        required={required}
        className="outline-none border-b-2 border-b-black placeholder:italic focus:border-sky-500 w-1/5  "
      />
      <label className="block text-sm text-slate-500 select-none mt-1">
        {labelText ?? "userName"}
      </label>
    </div>
  );
}
