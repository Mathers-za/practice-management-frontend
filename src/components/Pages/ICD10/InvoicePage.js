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
  } = useGlobalStore();

  const { data: financialsData, refetch } = useFetchData(
    `/financials/view${globalAppointmentData.id}`,
    "financialsDataInInvoicePage"
  );

  const [showDatePickers, setShowDatePickers] = useState(false);
  const [showInvoiceTitleDropdown, setShowInvoiceDropdown] = useState(false);

  const [showPaymentsReference, setShowPaymentsReference] = useState(false);

  const [showInvoiceSendCard, setShowInvoiceSendCard] = useState(false);
  const [showPaymentsPage, setShowPaymentsPage] = useState(false);
  const [showIcd10Table, setShowIcd10Table] = useState(false);

  const [invoiceExist, setInvoiceExist] = useState();

  const { patchMutation } = usePatchData(
    `/financials/update${globalPatientData.id}`
  );
  const [changes, setChanges] = useState({});

  const { data: paymentsData } = useFetchData(
    `/payments/view${globalAppointmentData.id}`,
    "paymentsDataInInvoices"
  );

  const { data: invoiceData } = useFetchData(
    `/invoices/view${globalAppointmentData.id}`
  );
  const { patchMutation: invoiceMutation } = usePatchData(
    `/invoices/update${globalPatientData.id}` //will need to chnage
  );

  const { createMutation } = usePostData(
    `/invoices/create${globalAppointmentData.id}`
  );

  const [mutableFinancialsData, setMutableFinancialsData] = useState({});
  const [invoicePayloadChanges, setInvoicePayloadChanges] = useState({});
  const [invoicePayload, setInvoicePayload] = useState({
    invoice_start_date: format(new Date(), "yyyy-MM-dd"),
    invoice_end_date: format(new Date(), "yyyy-MM-dd"),
    paid: false,
    patient_id: globalPatientData.id,
    appointment_id: globalAppointmentData.id,
  });

  useEffect(() => {
    checkAndSetIcds(globalAppointmentData.id, globalAppointmentTypeData.id);
  }, []);

  useEffect(() => {
    if (invoiceData) {
      setInvoicePayload((prev) => ({
        invoiceData,
      }));
      setInvoiceExist(true);
    } else if (invoicePayload) {
      setInvoicePayload((prev) => ({
        ...prev,
        invoice_title: `${globalPatientData.first_name} ${
          globalPatientData.last_name ?? ""
        } - ${invoicePayload?.invoice_start_date}`,
      }));
    }

    if (financialsData) {
      setMutableFinancialsData(() => ({
        total_amount: financialsData?.total_amount,
        discount: financialsData?.discount,
      }));
    }

    if (financialsData && parseFloat(financialsData.amount_due) <= 0) {
      setInvoicePayload((prev) => ({
        ...prev,
        paid: true,
      }));
    }
  }, [financialsData]);

  async function handleSubmission(index) {
    //dont kniw what this is
    if (invoiceExist) {
      invoiceMutation.mutate(invoicePayloadChanges);
      setInvoicePayloadChanges({});

      setShowInvoiceSendCard(true);
    } else {
      await createMutation.mutateAsync(invoicePayload);
      setShowInvoiceSendCard(true);
      setInvoiceExist(true);
      setInvoicePayloadChanges({});
      {
      }
    }
  }

  function handleChange(event) {
    const { name, value, id } = event.target;

    if (id !== "invoiceData") {
      setMutableFinancialsData((prev) => ({
        ...prev,
        [name]: value === "" ? null : value,
      }));

      setChanges((prev) => ({
        ...prev,
        [name]: value === "" ? null : value,
      }));
    } else if (id === "invoiceData") {
      setInvoicePayloadChanges((prev) => ({
        ...prev,
        [name]: value === "" ? null : value,
      }));
      setInvoicePayload((prev) => ({
        ...prev,
        [name]: value === "" ? null : value,
      }));
    }
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
                    onChange={handleChange}
                    label="Appointment Price"
                    name="total_amount"
                    value={mutableFinancialsData?.total_amount}
                    type="number"
                    variant="standard"
                    onBlur={async () => {
                      await patchMutation.mutateAsync(changes);
                      refetch();
                    }}
                    helperText="The price for this appointment that will be used ofr invoicing"
                    disabled={financialsData?.source_icd}
                  />

                  <TextField
                    variant="standard"
                    label="Add a discount"
                    onBlur={async () => {
                      await patchMutation.mutateAsync(changes);
                      refetch();
                    }}
                    name="discount"
                    type="number"
                    onChange={handleChange}
                    value={mutableFinancialsData?.discount || ""}
                  />
                </div>
              </div>
              <div className="shadow-md border border-slate-200  shadow-black/40">
                <div className="">
                  <div className="group">
                    <MenuDivsWithIcon
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
                        onChange={handleChange}
                        type="text"
                        name="invoice_title"
                        value={invoicePayload?.invoice_title ?? ""}
                        id="invoiceData"
                        label="Invoice title"
                        variant="standard"
                      />
                    </div>
                  )}

                  <MenuDivsWithIcon
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
                      financialsDataRefetch={() => refetch()}
                    />
                  )}

                  <MenuDivsWithIcon
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
                          value={
                            format(
                              new Date(invoicePayload?.invoice_start_date),
                              "yyyy-MM-dd"
                            ) ?? new Date()
                          }
                          format="yyyy-MM-dd"
                          label="Invoice Start Date"
                          closeOnSelect={true}
                          onAccept={(value) =>
                            setInvoicePayload((prev) => ({
                              ...prev,
                              invoice_start_date: format(
                                new Date(value),
                                "yyyy-MM-dd"
                              ),
                            }))
                          }
                        />
                      </div>{" "}
                      <div>
                        <MobileDatePicker
                          format="yyyy-MM-dd"
                          label="Invoice End Date"
                          name="invoice_end_date"
                          closeOnSelect={true}
                          onAccept={(value) =>
                            setInvoicePayload((prev) => ({
                              ...prev,
                              invoice_end_date: format(
                                new Date(value),
                                "yyyy-MM-dd"
                              ),
                            }))
                          }
                          value={
                            format(
                              new Date(invoicePayload?.invoice_end_date),
                              "yyyy-MM-dd"
                            ) ?? new Date()
                          }
                        />
                      </div>
                    </div>
                  )}

                  <MenuDivsWithIcon
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
                        {paymentsData
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
                          disabled={
                            parseFloat(mutableFinancialsData?.amount_due) <= 0
                          }
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
                    />
                  )}

                  <MenuDivsWithIcon
                    className={
                      "  hover:bg-white hover:cursor-default  justify-end pr-7 h-14 py-0 mt-0"
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
                      " justify-end hover:bg-white hover:cursor-default pr-7 h-14 py-0"
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
                      "  hover:bg-white hover:cursor-default justify-end  h-14 py-0"
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
                      " hover:bg-white hover:cursor-default  justify-end h-14 py-0"
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
                <Button variant="contained">
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
