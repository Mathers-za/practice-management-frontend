import { AnimatePresence, motion } from "framer-motion";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CloseIcon from "@mui/icons-material/Close";
import { useFetchData } from "../../../../CustomHooks/serverStateHooks";
import { useEffect, useState } from "react";
import MedicalAidDetailsDisplayComponent from "./MedicalAidDetailsDisplayComponent";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Tooltip, Button, IconButton } from "@mui/material";
import { useGlobalStore } from "../../../../zustandStore/store";
import {
  emailInvoiceStatement,
  handleInvoiceStatementGeneration,
} from "../../../../InvoiceApiRequestFns/invoiceApiHelperFns";
export default function MedicalAidSender({
  isVisible,
  invoiceData,
  hideComponent,
}) {
  const { data: medicalAidContactDetails } = useFetchData(
    `/invoices/medicalAidContactInformation`,
    ["medicalAidContactDetails"]
  );
  const profileId = useGlobalStore((state) => state.globalProfileData.id);
  const [selectedMedicalAidObject, setSelectedMedicalAidObject] = useState("");
  function viewInvoiceStatement() {
    handleInvoiceStatementGeneration(
      invoiceData.invoice_number,
      invoiceData.appointment_id,
      invoiceData.patient_id,
      profileId
    );
  }

  async function handleSubmit() {
    await emailInvoiceStatement(
      profileId,
      invoiceData.appointment_id,
      invoiceData.patient_id,
      selectedMedicalAidObject.email
    );
  }

  const [
    processedMedicalAidDataForMapping,
    setProcessedMedicalAidDataForMapping,
  ] = useState([]);

  console.log(
    "invoice data is new compoennt is " + JSON.stringify(invoiceData)
  );

  useEffect(() => {
    if (medicalAidContactDetails && medicalAidContactDetails.length > 0) {
      setProcessedMedicalAidDataForMapping(
        medicalAidContactDetails.map((medicalAid) => {
          return {
            label: medicalAid.name,
            id: medicalAid.id,
            email: medicalAid.email,
          };
        })
      );
    }
  }, [medicalAidContactDetails]);
  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <div className="fixed left-0 top-0 w-full h-screen z-20 bg-black/30  flex justify-center items-center">
            <motion.div className=" p-4 w-1/2 h-[60%]  bg-white  z-30 shadow-md shadow-black/40 ">
              <div className="  flex justify-end">
                <IconButton onClick={() => hideComponent()}>
                  <CloseIcon />
                </IconButton>
              </div>
              <h2 className="text-black text-lg mb-5 ">
                Choose a medical aid below
              </h2>
              <div className="relative">
                <MedicalAidDetailsDisplayComponent
                  invoiceData={invoiceData}
                  patientId={invoiceData.patient_id}
                />
                <div
                  onClick={viewInvoiceStatement}
                  className="absolute right-0 top-0"
                >
                  <Tooltip placement="bottom" title="View Invoice">
                    {" "}
                    <OpenInNewIcon />
                  </Tooltip>
                </div>
              </div>

              <div>
                <Autocomplete
                  onChange={(event, value) =>
                    setSelectedMedicalAidObject(value)
                  }
                  options={processedMedicalAidDataForMapping}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Choose a medical aid"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </div>
              <div className="flex justify-end">
                {" "}
                <Button
                  variant="contained"
                  disabled={!selectedMedicalAidObject}
                  onClick={handleSubmit}
                >
                  Send invoice
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
