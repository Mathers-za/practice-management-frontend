import { Button, CircularProgress } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import GenericTopBar from "./GenericTopBar";
import { useState } from "react";

export default function ConfirmChoiceModal({
  onCancel,
  onAccept,
  message,
  showComponent = false,
  className = "  w-1/2 h-1/3 shadow-md shadow-black/30 bg-white flex flex-col p-0 justify-between border      border-inherit ",
  hideComponent,
}) {
  const [spinOnClick, setSpinOnClick] = useState(false);
  return (
    <>
      {showComponent && (
        <div className="fixed left-0 top-0 w-full h-full bg-black/50 z-40 flex justify-center items-center ">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className={className}
          >
            <GenericTopBar
              label="Confirm deletion"
              showCloseOption={true}
              onclick={hideComponent}
              className="h-12 bg-orange-500"
            />
            <p className="p-5 text-black text-base ">{message}</p>
            <div className="flex px-1  items-end justify-between mb-1">
              <Button
                sx={{ height: "fit-content" }}
                color="inherit"
                variant="contained"
                onClick={() => onCancel()}
              >
                Cancel
              </Button>
              <Button
                sx={{ height: "fit-content" }}
                color="warning"
                variant="contained"
                onClick={() => {
                  setSpinOnClick(!spinOnClick);
                  onAccept();
                }}
              >
                {spinOnClick ? <CircularProgress size={22} /> : "Confirm"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
