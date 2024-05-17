import axios from "axios";

import { useFetchData } from "../../../../CustomHooks/serverStateHooks";
import { useNavigate } from "react-router-dom";
import GenericTopBar from "../../../miscellaneous components/GenericTopBar";
import MenuDivsWithIcon from "../../../miscellaneous components/MenuListDivsWithIcon";
import SendIcon from "@mui/icons-material/Send";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HomeIcon from "@mui/icons-material/Home";
import { useGlobalStore } from "../../../../zustandStore/store";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function InvoiceSendCard({
  patientData,
  profileId,
  appointmentId,
  hideComponent,
}) {
  const { globalInvoiceData } = useGlobalStore();
  console.log(globalInvoiceData);

  const { data: invoiceData } = useFetchData(
    `/invoices/view${appointmentId}`,
    "invDataInSendInvoices"
  );
  const navigate = useNavigate();
  async function handleInvoiceStatementGeneration(
    invoiceNumber,
    appointmentId,
    patientId,
    profileId
  ) {
    try {
      const { data } = await axios.get(
        `http://localhost:4000/invoices/retrieveInvoiceStatement`,
        {
          withCredentials: true,
          params: {
            invoiceNumber: invoiceNumber,
            profileId: profileId,
            patientId: patientId,
            appointmentId: appointmentId,
          },
          responseType: "arraybuffer",
        }
      );

      const pdfBlob = new Blob([data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");
    } catch (error) {
      console.error(error);
    }
  }

  async function emailInvoiceStatement(profileId, appointmentId, patientId) {
    await axios.post(
      `http://localhost:4000/invoices//sendInvoiceStatment`,
      { profileId, appointmentId, patientId },
      { withCredentials: true }
    );
  }

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
          <p>{globalInvoiceData.invoice_title}</p>
        </div>
        <MenuDivsWithIcon
          onclick={() =>
            emailInvoiceStatement(
              profileId,
              invoiceData.appointment_id,
              patientData.patientId
            )
          }
          className="px-1"
          text="Send to patient"
          iconStart={<SendIcon sx={{ color: "#0284C7" }} />}
        />
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
          onclick={() => navigate("/")}
          iconStart={<HomeIcon sx={{ color: "#0284C7" }} />}
        />
      </div>
    </div>
  );
}
