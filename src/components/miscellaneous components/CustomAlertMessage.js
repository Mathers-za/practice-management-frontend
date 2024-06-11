import { Alert } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { isError } from "react-query";

export default function CustomAlertMessage({
  successMessage = "Success",
  className = "fixed right-1 bottom-1 z-50",
  errorFlag,
  successFlag,
  errorMessage = "error",
  severityOnError = "error",
  severityOnSuccess = "success",
}) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (successFlag || errorFlag) {
      setTimeout(
        () => {
          setIsVisible(true);
        },
        errorFlag ? 0 : 800
      );

      const timeOutId = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      return () => {
        clearTimeout(timeOutId);
      };
    }

    return () => {
      setIsVisible(false);
    };
  }, [successFlag, errorFlag, successMessage]);
  return (
    <>
      <AnimatePresence>
        {isVisible ? (
          <motion.div
            initial={{ height: "0%" }}
            animate={{ height: "auto" }}
            exit={{ height: "0%" }}
            className={className}
          >
            <Alert
              severity={
                successFlag
                  ? severityOnSuccess
                  : errorFlag
                  ? severityOnError
                  : ""
              }
            >
              {successFlag ? successMessage : errorFlag ? errorMessage : null}
            </Alert>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
