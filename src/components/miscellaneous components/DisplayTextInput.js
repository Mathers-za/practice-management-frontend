import React, { useState } from "react";

export default function Input({
  name,
  value,
  labelText,
  placeholder,
  required,
  onchange,
  type,
  dynamicBottomInfo,
  staticBottomInfo,
  pattern,
  autoComplete = "off",
  id,
}) {
  return (
    <div className="group  space-y-1 ">
      <label
        id={id}
        className="  text-sky-600   ring-sky-400  group-hover:text-blue-800 cursor-text  disabled:text-gray-500   "
      >
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
        className=" min-w-full  peer/input placeholder:text-sm  disabled:opacity-50 disabled:border-gray-600 disabled:text-yellow-300 "
        autoComplete={autoComplete}
        id={id ? id : null}
      />
      {dynamicBottomInfo && (
        <p className="opacity-0 peer-focus/input:opacity-100  text-slate-600 text-xs ">
          {dynamicBottomInfo}
        </p>
      )}

      {staticBottomInfo && (
        <p className="text-slate-600 text-xs">{staticBottomInfo}</p>
      )}
    </div>
  );
}
