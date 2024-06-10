import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
export const useHideOnOutsideClick = (ref, callback, flag) => {
  useEffect(() => {
    console.log("custom hook is entred");
    const handleOutsideClick = (event) => {
      if (!flag) return;
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    document.addEventListener("click", handleOutsideClick);

    return () => document.removeEventListener("click", handleOutsideClick);
  }, [ref]);
};

export const useOnSubmitButtonTextstateManager = (
  baseText,
  processingRequestText = <CircularProgress size={24} color="inherit" />,

  reactUseMutationReturnObject
) => {
  const { isIdle, isLoading, reset, isSuccess } = reactUseMutationReturnObject;
  const [buttonText, setButtonText] = useState(baseText);

  useEffect(() => {
    if (isIdle) {
      setButtonText(baseText);
    } else if (isLoading) {
      setButtonText(processingRequestText);
      setTimeout(() => {
        setButtonText(baseText);
      }, 1500);
    }

    if (isSuccess) {
      setTimeout(() => {
        reset();
      }, 3000);
    }
  }, [reactUseMutationReturnObject]);

  return buttonText;
};
