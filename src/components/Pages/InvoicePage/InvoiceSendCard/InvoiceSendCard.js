import { IconButton } from "@mui/material";
import UpdatePatientContactDetails from "../../../Create and update Patient component/UpdatePatientContactDetails";
import EditIcon from "@mui/icons-material/Edit";
import {
  handleInvoiceStatementGeneration,
  emailInvoiceStatement,
} from "../../../../InvoiceApiRequestFns/invoiceApiHelperFns";
import {
  useFetchData,
  usePostData,
} from "../../../../CustomHooks/serverStateHooks";
import { useLocation, useNavigate } from "react-router-dom";
import GenericTopBar from "../../../miscellaneous components/GenericTopBar";
import MenuDivsWithIcon from "../../../miscellaneous components/MenuListDivsWithIcon";
import SendIcon from "@mui/icons-material/Send";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HomeIcon from "@mui/icons-material/Home";
import {
  useGlobalStore,
  usePatientPortalStore,
} from "../../../../zustandStore/store";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useEffect, useState } from "react";

export default function InvoiceSendCard({
  patientData,
  profileId,
  appointmentId,
  hideComponent,
  hideTree,
}) {
  const { globalInvoiceData, globalPatientData } = useGlobalStore();
  const [showUpdatePatientPage, setShowUpdatePatientPage] = useState(false);

  //TODO add flow step if patient email isnt present. ideally the option to edit the patients email

  const location = useLocation();
  const { createMutation } = usePostData(`/invoices/sendInvoiceStatment`);
  const { data: invoiceData } = useFetchData(
    `/invoices/view${appointmentId}`,
    "invDataInSendInvoices" // take this out. set invoicedatat global in invoice page during api request and make sure you captur chnages in the patch and post routes. then pass diretcly and save an api request
  );
  const setterFnForPatientIdInPatientPortalTree = usePatientPortalStore(
    (state) => state.setPatientId
  );
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId = "";
    if (createMutation.isError || createMutation.isSuccess) {
      timeoutId = setTimeout(() => {
        createMutation.reset();
      }, 1000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [createMutation.isSuccess]);

  return (
    <div className="fixed top-0 left-0 bg-black/40 w-full h-screen z-30 flex items-center justify-center">
      <div className="w-[25%] h-[65%] bg-white flex flex-col shadow-md shadow-black/40  ">
        <GenericTopBar
          className="py-1 pl-3 pr-0"
          label="Next steps"
          onclick={() => hideComponent()}
        />
        <div className=" h-fit mt-3 mb-3 w-full grow flex flex-col justify-center items-center">
          <CheckCircleIcon
            sx={{ color: "#4CAF50", fontSize: "60px" }}
            fontSize="large"
          />

          <p className="text-lg">Invoice Created</p>
          <p>{globalInvoiceData?.invoice_title}</p>
        </div>
        <div className="relative">
          <MenuDivsWithIcon
            disabled={!globalPatientData?.email || !createMutation.isIdle}
            onclick={async () => {
              await createMutation.mutateAsync({
                profileId: profileId,
                appointmentId: invoiceData.appointment_id,
                patientId: patientData.patientId,
              });
            }}
            className="px-1 py-[10px]"
            text={
              <>
                <div className="text-start">
                  <p>
                    {" "}
                    {createMutation.isIdle ? "Send to patient" : "Sending"}
                  </p>
                  <p className="text-xs">
                    {globalPatientData.email
                      ? `Patient email: ${globalPatientData.email}`
                      : "No pateint email"}
                  </p>
                </div>
              </>
            }
            iconStart={<SendIcon sx={{ color: "#0284C7" }} />}
          />
          <div className="absolute right-3   top-2">
            <IconButton
              onClick={() => {
                setShowUpdatePatientPage(!showUpdatePatientPage);
                setterFnForPatientIdInPatientPortalTree(globalPatientData.id);
              }}
            >
              <EditIcon />
            </IconButton>
          </div>
        </div>

        <MenuDivsWithIcon
          className="px-1"
          text="Send to medical aid"
          iconStart={<SendIcon sx={{ color: "#0284C7" }} />}
        />
        <MenuDivsWithIcon
          onclick={() =>
            handleInvoiceStatementGeneration(
              invoiceData.invoice_number,
              invoiceData.appointment_id,
              patientData.patientId,
              profileId
            )
          }
          className="px-1"
          text="View invoice"
          iconStart={<VisibilityIcon sx={{ color: "#0284C7" }} />}
        />
        <MenuDivsWithIcon
          text="Return home"
          onclick={() =>
            location.pathname === "/" ? hideTree() : navigate("/")
          }
          iconStart={<HomeIcon sx={{ color: "#0284C7" }} />}
        />
      </div>
      {showUpdatePatientPage && (
        <div className="fixed top-0 left-0 w-full h-screen flex justify-center items-center bg-black/30 z-20">
          <div className="w-3/4">
            <UpdatePatientContactDetails
              hideComponent={() =>
                setShowUpdatePatientPage(!showUpdatePatientPage)
              }
              showTopBar={{
                show: true,
                label: "Update Patient Contact Details",
                showCloseOption: true,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
