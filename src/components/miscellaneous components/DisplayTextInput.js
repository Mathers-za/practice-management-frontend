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
}) {
  const [showPlaceHolder, setShowPlaceHolder] = useState(true);
  const [showLabel, setShowLabel] = useState(false);

  function handleShowLabel(event) {
    const { value } = event.target;
    setShowPlaceHolder(false);
    setShowLabel(true);
    if (value) {
      setShowLabel(true);
      setShowPlaceHolder(false);
    } else {
      setShowLabel(false);
      setShowPlaceHolder(true);
    }
  }

  return (
    <div className="group  space-y-1 ">
      {showLabel && (
        <label className="text-sm text-sky-600"> {labelText} </label>
      )}
      <input
        pattern={pattern && pattern}
        onChange={(event) => {
          onchange(event);
          handleShowLabel(event);
        }}
        type={type || "text"}
        placeholder={showPlaceHolder ? placeholder : null}
        name={name}
        value={value}
        required={required}
        className=" min-w-full  peer/input "
      />
      {bottomInfo && (
        <p className="hidden peer-focus/input:block text-slate-600 text-xs ">
          {bottomInfo}{" "}
        </p>
      )}
    </div>
  );
}
