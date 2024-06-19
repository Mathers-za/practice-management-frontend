import GenericTopBar from "./GenericTopBar";
import { FormControlLabel, Checkbox, Button } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  useGlobalStore,
  usePatientPortalStore,
} from "../../zustandStore/store";

export default function DeletePopMessageForPatientsPortal({
  hideComponent,
  showComponent,
  onConfirm,
  onCancel,
  patient_id,
}) {
  const [selectedOptions, setSelectedOptions] = useState({
    deleteCorrespondingAppointments: false,

    patient_id: patient_id,
  });
  const { patientData } = usePatientPortalStore();
  function handleCheckboxTick(event) {
    const { name } = event.target;
    setSelectedOptions((prev) => ({
      ...prev,
      [name]: !selectedOptions[name],
    }));
  }
  return (
    <>
      <AnimatePresence>
        {showComponent && (
          <div className="fixed  left-0  top-0 w-full h-screen z-50 bg-black/30 flex justify-center items-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="w-1/2 h-fit bg-white border flex flex-col space-y-2  justify-between  border-inherit shadow-md shadow-black/30 "
            >
              <GenericTopBar
                className="bg-[#f97316] h-12 "
                showCloseOption={true}
                onclick={() => hideComponent()}
                label="Confirm deletion"
              />
              <p className="px-2 ">
                Are you sure you want to archive{" "}
                {(patientData?.first_name || "") +
                  " " +
                  (patientData?.last_name || "")}{" "}
                ?
              </p>
              <div className="flex flex-col items-start p-2">
                <FormControlLabel
                  control={
                    <Checkbox
                      name="deleteCorrespondingAppointments"
                      defaultChecked={false}
                      onClick={handleCheckboxTick}
                    />
                  }
                  label="Also delete thier appointments"
                />
              </div>
              <div className="flex justify-between px-1 py-1   items-end">
                <Button
                  variant="contained"
                  color="inherit"
                  onClick={() => onCancel()}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => onConfirm(selectedOptions)}
                >
                  Confirm
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
