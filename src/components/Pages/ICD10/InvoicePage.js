import ICD10Table from "./ICD10-Table";
import { useEffect, useState } from "react";
import styles from "./invoicePage.module.css";
import { checkAndSetIcds } from "../../../apiRequests/apiRequests";
import {
  useFetchData,
  usePatchData,
  usePostData,
} from "../../../CustomHooks/serverStateHooks";
import PaymentPage from "../Payments/PaymentPage";
import { useGlobalStore } from "../../../zustandStore/store";
import PaymentReference from "./PaymentReference";
import { format } from "date-fns";
import InvoiceSendCard from "./InvoiceSendCard/InvoiceSendCard";
import { Button, TextField } from "@mui/material";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import GenericTopBar from "../../miscellaneous components/GenericTopBar";
import MenuDivsWithIcon from "../../miscellaneous components/MenuListDivsWithIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function invoiceCreationValidation(payloadData, financialData) {
  const invoiceErrors = [];

  for (const key in payloadData) {
    if (payloadData[key] !== null && key === "discount") {
      if (
        parseFloat(payloadData?.discount) >
        parseFloat(financialData?.amount_due)
      ) {
        invoiceErrors.push("Discount Cananot exceed amount due");
        return invoiceErrors;
      }

      if (payloadData?.discount.includes("-")) {
        invoiceErrors.push("Please enter a valid discount amount");
      }

      if (payloadData[key] !== null && key === "amount_total") {
        if (
          parseFloat(payloadData?.amount_due) >
          parseFloat(financialData?.amount_paid)
        ) {
          invoiceErrors(
            "The new amount cannot be less than the amount already paid"
          );
          return invoiceErrors;
        }
        if (
          payloadData?.total_amount !== null &&
          payloadData?.total_amount.includes("-")
        ) {
          invoiceErrors.push("Please enter a valid appointment total value");
          return invoiceErrors;
        }
      }
    }
  }
}

export default function InvoicePortal({ hideComponent }) {
  //validation functuion has been made. make sur eyou having mathcing sttae names

  const {
    globalProfileData,
    globalAppointmentData,
    globalAppointmentTypeData,
    globalPatientData,
    setGlobalInvoiceData,
  } = useGlobalStore();

  const { data: financialsData, refetch: refetchFinancialsData } = useFetchData(
    `/financials/view${globalAppointmentData.id}`
  );
  console.log(globalProfileData);
  const [showDatePickers, setShowDatePickers] = useState(false);
  const [showInvoiceTitleDropdown, setShowInvoiceDropdown] = useState(false);

  const [showPaymentsReference, setShowPaymentsReference] = useState(false);
  const refetchAppointmentSearchList = useGlobalStore(
    (state) => state.globalRefetch
  );

  const [showInvoiceSendCard, setShowInvoiceSendCard] = useState(false);
  const [showPaymentsPage, setShowPaymentsPage] = useState(false);
  const [showIcd10Table, setShowIcd10Table] = useState(false);

  const [invoiceExist, setInvoiceExist] = useState(false);

  const { patchMutation } = usePatchData(
    `/financials/update${financialsData?.appointment_id}`,
    ["financialsControl", "page", "invoice", "fetchPaymentsData"]
  );

  const { data: paymentsData } = useFetchData(
    `/payments/view${globalAppointmentData.id}`,
    ["financialsControl", "page", "invoice", "fetchPaymentsData"]
  );

  const { data: invoiceData } = useFetchData(
    `/invoices/view${globalAppointmentData?.id}`,
    "invoiceDataInInvoicePage"
  );
  const { patchMutation: invoiceMutation } = usePatchData(
    `/invoices/update${globalAppointmentData?.id}`
  );

  const { createMutation } = usePostData(
    `/invoices/create${globalAppointmentData?.id}`
  );

  const [
    appointmentTotalAndDiscountDisplay,
    setAppointmentTotalAndDiscountDisplay,
  ] = useState({});
  const [
    appoinmentTotalAndDiscountChanges,
    setAppointmentTotalAndDiscountChanges,
  ] = useState(false);
  const [invoicePayloadChanges, setInvoicePayloadChanges] = useState({});
  const [invoicePayload, setInvoicePayload] = useState({
    invoice_start_date: format(new Date(), "yyyy-MM-dd"),
    invoice_end_date: format(new Date(), "yyyy-MM-dd"),
    paid: false,

    appointment_id: globalAppointmentData.id,
    invoice_title: `${
      globalPatientData.first_name + " " + globalPatientData.last_name ?? " "
    } - ${format(new Date(), "yyyy-MM-dd")}`,
  });

  function determineInvoiceStatus(invoiceStatus, amountDue) {
    if (invoiceStatus && invoiceStatus !== "Paid") {
      if (parseFloat(amountDue) <= 0) {
        return "Paid";
      } else {
        return invoiceStatus;
      }
    }

    if (!invoiceStatus && parseFloat(amountDue) > 0) {
      return "In Progress";
    }
  }
  function handleFinancialDataChanges(event) {
    const { name, value } = event.target;

    setAppointmentTotalAndDiscountDisplay((prev) => ({
      ...prev,
      [name]: value === "" ? "0,00" : value,
    }));
    setAppointmentTotalAndDiscountChanges({
      [name]: value === "" ? "0.00 " : value,
    });
  }

  useEffect(() => {
    if (invoiceData) {
      setInvoicePayload(invoiceData);
      setInvoiceExist(true);
    } else if (invoicePayload) {
      setInvoiceExist(false);
    } else {
      setInvoiceExist(false);
    }

    if (financialsData) {
      setAppointmentTotalAndDiscountDisplay(() => ({
        total_amount: financialsData?.total_amount,
        discount: financialsData?.discount,
        source_icd: financialsData.source_icd,
      }));
    }
  }, [financialsData, invoiceData]);

  async function handleSubmission() {
    if (invoiceExist && Object.keys(invoicePayloadChanges).length > 0) {
      const { data: responseFromPatch } = await invoiceMutation.mutateAsync({
        ...invoicePayloadChanges,
        invoice_status: determineInvoiceStatus(
          invoicePayload?.invoice_status,
          appointmentTotalAndDiscountDisplay?.amount_due
        ),
      });
      setGlobalInvoiceData(responseFromPatch);
      setInvoicePayloadChanges({});
    } else if (!invoiceExist) {
      const { data: reponseData } = await createMutation.mutateAsync({
        ...invoiceData,
        invoice_status: determineInvoiceStatus(
          invoicePayload.invoice_status,
          financialsData.amount_due
        ),
      });
      setGlobalInvoiceData(reponseData);
      setInvoicePayloadChanges({});
      setInvoiceExist(true);
    }
    setShowInvoiceSendCard(!showInvoiceSendCard);
  }

  function handleInvoiceChanges(event) {
    const { name, value } = event.target;
    setInvoicePayload((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
    setInvoicePayloadChanges((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  }

  return (
    <>
      <div className="fixed left-0 top-0 w-full  z-20  h-screen overflow-auto  bg-white">
        <GenericTopBar
          label="Manage invoices"
          onclick={() => hideComponent()}
        />

        <div className="w-full h-screen flex justify-center">
          <div className="w-[98%] h-fit  ">
            <div className="w-full ">
              <div className="h-fit mt-4 mb-4  ">
                <div className="space-y-2 p-2  w-1/3 shadow-md shadow-black/40  flex flex-col">
                  <TextField
                    onChange={(event) => handleFinancialDataChanges(event)}
                    label="Appointment Price"
                    name="total_amount"
                    disabled={appointmentTotalAndDiscountDisplay?.source_icd}
                    value={
                      appointmentTotalAndDiscountDisplay?.total_amount ?? ""
                    }
                    type="number"
                    variant="standard"
                    onBlur={async () => {
                      if (
                        Object.keys(appoinmentTotalAndDiscountChanges).length >
                        0
                      ) {
                        await patchMutation.mutateAsync(
                          appoinmentTotalAndDiscountChanges
                        );
                        refetchFinancialsData();
                        refetchAppointmentSearchList();
                        setAppointmentTotalAndDiscountChanges({});
                      }
                    }}
                    helperText={
                      appointmentTotalAndDiscountDisplay?.source_icd
                        ? "The price for this appointment is set according to the ICD codes"
                        : "This appointment has no ICD codes, therefore can be edited"
                    }
                  />

                  <TextField
                    variant="standard"
                    label="Add a discount"
                    onBlur={async () => {
                      if (
                        Object.keys(appoinmentTotalAndDiscountChanges).length >
                        0
                      ) {
                        await patchMutation.mutateAsync(
                          appoinmentTotalAndDiscountChanges
                        );
                        refetchFinancialsData();
                        refetchAppointmentSearchList();
                        setAppointmentTotalAndDiscountChanges({});
                      }
                    }}
                    name="discount"
                    type="number"
                    onChange={(event) => handleFinancialDataChanges(event)}
                    value={appointmentTotalAndDiscountDisplay?.discount || ""}
                  />
                </div>
              </div>
              <div className="shadow-md border border-slate-200  shadow-black/40">
                <div className="">
                  <div className="group">
                    <MenuDivsWithIcon
                      className="hover:bg-slate-50"
                      iconEnd={
                        <>
                          <FontAwesomeIcon
                            icon={`fa-solid fa-chevron-${
                              showInvoiceTitleDropdown ? "up" : "down"
                            }`}
                            size="lg"
                            style={{ color: "#090a0c" }}
                          />
                        </>
                      }
                      text="Invoice Name"
                      onclick={() =>
                        setShowInvoiceDropdown(!showInvoiceTitleDropdown)
                      }
                    />
                  </div>

                  {showInvoiceTitleDropdown && (
                    <div>
                      <TextField
                        fullWidth
                        onChange={(event) => handleInvoiceChanges(event)}
                        type="text"
                        name="invoice_title"
                        value={invoicePayload?.invoice_title ?? ""}
                        label="Invoice title"
                        variant="standard"
                      />
                    </div>
                  )}

                  <MenuDivsWithIcon
                    className="hover:bg-slate-50"
                    text="Medical Aid Coding"
                    onclick={() => setShowIcd10Table(!showIcd10Table)}
                    iconEnd={
                      <>
                        <FontAwesomeIcon
                          icon={`fa-solid fa-chevron-${
                            showIcd10Table ? "up" : "down"
                          }`}
                          size="lg"
                          style={{ color: "#090a0c" }}
                        />
                      </>
                    }
                  />

                  {showIcd10Table && (
                    <ICD10Table
                      appointmentId={globalAppointmentData.id}
                      appointmentTypeId={globalAppointmentTypeData.id}
                      financialsDataRefetch={() => refetchFinancialsData()}
                      queryKeyToInvalidate={[
                        "financialsControl",
                        "page",
                        "invoice",
                        "fetchFinancialData",
                      ]}
                    />
                  )}

                  <MenuDivsWithIcon
                    className="hover:bg-slate-50"
                    iconEnd={
                      <>
                        <FontAwesomeIcon
                          icon={`fa-solid fa-chevron-${
                            showDatePickers ? "up" : "down"
                          }`}
                          size="lg"
                          style={{ color: "#090a0c" }}
                        />
                      </>
                    }
                    text="Invoice Dates"
                    onclick={() => setShowDatePickers(!showDatePickers)}
                  />

                  {showDatePickers && (
                    <div className="flex gap-4 mt-4">
                      <div>
                        <MobileDatePicker
                          value={new Date(invoicePayload.invoice_start_date)}
                          format="yyyy-MM-dd"
                          label="Invoice Start Date"
                          closeOnSelect={true}
                          onAccept={(value) => {
                            setInvoicePayload((prev) => ({
                              ...prev,
                              invoice_start_date: format(
                                new Date(value),
                                "yyyy-MM-dd"
                              ),
                            }));
                            setInvoicePayloadChanges((prev) => ({
                              ...prev,
                              invoice_start_date: format(
                                new Date(value),
                                "yyyy-MM-dd"
                              ),
                            }));
                          }}
                        />
                      </div>{" "}
                      <div>
                        <MobileDatePicker
                          format="yyyy-MM-dd"
                          label="Invoice End Date"
                          name="invoice_end_date"
                          closeOnSelect={true}
                          onAccept={(value) => {
                            setInvoicePayload((prev) => ({
                              ...prev,
                              invoice_end_date: format(
                                new Date(value),
                                "yyyy-MM-dd"
                              ),
                            }));
                            setInvoicePayloadChanges((prev) => ({
                              ...prev,
                              invoice_end_date: format(
                                new Date(value),
                                "yyyy-MM-dd"
                              ),
                            }));
                          }}
                          value={new Date(invoicePayload.invoice_end_date)}
                        />
                      </div>
                    </div>
                  )}

                  <MenuDivsWithIcon
                    className="hover:bg-slate-50"
                    iconEnd={
                      <>
                        <FontAwesomeIcon
                          icon={`fa-solid fa-chevron-${
                            showPaymentsReference ? "up" : "down"
                          }`}
                          size="lg"
                          style={{ color: "#090a0c" }}
                        />
                      </>
                    }
                    text="Payments"
                    onclick={() =>
                      setShowPaymentsReference(!showPaymentsReference)
                    }
                  />

                  {showPaymentsReference && (
                    <div className="p-4">
                      <div>
                        {paymentsData && paymentsData.length > 0
                          ? paymentsData.map((payment) => (
                              <PaymentReference
                                key={payment.id}
                                paymentsData={payment}
                              />
                            ))
                          : "No payments data"}
                      </div>
                      <div className="flex justify-end">
                        <Button
                          size="small"
                          disabled={parseFloat(financialsData.amount_due) <= 0}
                          variant="contained"
                          onClick={() => setShowPaymentsPage(!showPaymentsPage)}
                        >
                          Add Payment
                        </Button>
                      </div>
                    </div>
                  )}

                  {showPaymentsPage && (
                    <PaymentPage
                      appointmentTypeId={globalAppointmentTypeData.id}
                      hideComponent={() =>
                        setShowPaymentsPage(!showPaymentsPage)
                      }
                      appointmentId={globalAppointmentData.id}
                      queryKeyToInvalidate={["financialsControl", "page"]}
                    />
                  )}

                  <MenuDivsWithIcon
                    className={
                      "  hover:bg-white  justify-end pr-7 h-14 py-0 mt-0 hover:cursor-auto"
                    }
                    text={
                      <>
                        <div className="  text-end">
                          <p>Appointment Price</p>{" "}
                          <p className="font-semibold">
                            R{financialsData?.total_amount}
                          </p>
                        </div>{" "}
                      </>
                    }
                  />
                  <MenuDivsWithIcon
                    className={
                      " justify-end hover:bg-white hover:cursor-auto pr-7 h-14 py-0"
                    }
                    text={
                      <>
                        <div className="text-end">
                          <p>Payments</p>{" "}
                          <p className="font-semibold">
                            R{financialsData?.amount_paid}
                          </p>
                        </div>{" "}
                      </>
                    }
                  />
                  <MenuDivsWithIcon
                    className={
                      "  hover:bg-white hover:cursor-auto justify-end  h-14 py-0"
                    }
                    text={
                      <>
                        <div className="text-end">
                          <p>Discount</p>{" "}
                          <p className="font-semibold ">
                            R{financialsData?.discount}
                          </p>
                        </div>{" "}
                      </>
                    }
                  />
                  <MenuDivsWithIcon
                    className={
                      " hover:bg-white hover:cursor-auto  justify-end h-14 py-0"
                    }
                    text={
                      <>
                        <div className="text-end">
                          <p>Amount due</p>{" "}
                          <p className="font-semibold ">
                            R{financialsData?.amount_due}
                          </p>
                        </div>{" "}
                      </>
                    }
                  />
                </div>
              </div>
              <div className="flex justify-between   mt-2">
                <Button
                  onClick={() => hideComponent()}
                  variant="contained"
                  color="inherit"
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmission} variant="contained">
                  {invoiceExist ? "save Changes" : "Create Invoice"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showInvoiceSendCard && (
        <InvoiceSendCard
          patientData={{
            patientId: globalPatientData.id,
            patient_first_name: globalPatientData.first_name,
            patient_last_name: globalPatientData.last_name,
          }}
          profileId={globalProfileData.id}
          appointmentId={globalAppointmentData.id}
          hideComponent={() => setShowInvoiceSendCard(false)}
        />
      )}
      ;
    </>
  );
}
