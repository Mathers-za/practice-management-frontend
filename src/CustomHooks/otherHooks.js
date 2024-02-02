import { useState } from "react";
const useHandleChange = (
  setState1,
  setState2 = undefined,
  state1 = undefined
) => {
  function handleChange(e) {
    const { name, value } = e.target;
    setState1((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));

    if (setState2 && state1) {
      if (value !== state1[name]) {
        setState2((prev) => ({
          ...prev,
          [name]: value === "" ? null : value,
        }));
      }
    }
  }

  return { handleChange };
};

export { useHandleChange };
