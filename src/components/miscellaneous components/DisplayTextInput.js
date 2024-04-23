import React, { useState } from "react";

export default function Input({
  name,
  value,
  labelText,
  placeholder,
  required,
  onchange,
  type,
  bottomInfo,
  pattern,
  autoComplete = "off",
}) {
  return (
    <div className="group  space-y-1 ">
      <label className="  text-sky-600  ring-sky-400  group-hover:text-blue-800 cursor-text  ">
        {" "}
        {labelText}{" "}
      </label>

      <input
        pattern={pattern && pattern}
        onChange={(event) => onchange(event)}
        type={type || "text"}
        placeholder={placeholder}
        name={name}
        value={value}
        required={required}
        className=" min-w-full  peer/input placeholder:text-sm"
        autoComplete={autoComplete}
      />
      {bottomInfo && (
        <p className="opacity-0 peer-focus/input:opacity-100  text-slate-600 text-xs ">
          {bottomInfo}{" "}
        </p>
      )}
    </div>
  );
}
