import { useEffect } from "react";

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
