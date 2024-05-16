import { checkAndSetIcds } from "../../../apiRequests/apiRequests";

import { useEffect, useRef, useState } from "react";
import {
  useFetchData,
  usePostData,
} from "../../../CustomHooks/serverStateHooks";
import { format } from "date-fns";

import GenericTopBar from "../../miscellaneous components/GenericTopBar";
import { Button, Chip, FormControlLabel, TextField } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import InputAdornment from "@mui/material/InputAdornment";

import { CalendarIcon } from "@mui/x-date-pickers/icons";
import { useGlobalStore } from "../../../zustandStore/store";

function checkForErrors(paymentPayload, data) {
  const errors = [];

  for (const property in paymentPayload) {
    if (property === "amount" && paymentPayload[property] !== null) {
      if (parseFloat(paymentPayload[property]) > parseFloat(data?.amount_due)) {
        errors.push(
          "Please enter a valid amount that does not exceed amount due"
        );
        return errors;
      }
    }

    if (
      paymentPayload[property] !== null &&
      property !== "payment_date" &&
      paymentPayload[property].includes("-")
    ) {
      errors.push("please enter a valid number");
      return errors;
    }

    if (
      paymentPayload[property] !== null &&
      paymentPayload[property].includes(".")
    ) {
      const parts = paymentPayload[property].split(".");
      if (parts[1].trim().length > 2) {
        errors.push("invalid-greater than 2 decomals");
        return errors;
      }
    }
  }
}

function cleanAmount(payload) {
  const cleanedAmount = payload.amount.replace(",", ".");
  return { ...payload, amount: cleanedAmount };
}

export default function PaymentPage({
  appointmentId,
  appointmentTypeId,
  hideComponent,
  refetchData = "",
  queryKeyToInvalidate = "",
}) {
  const { data, refetch: refreshPaymentsPage } = useFetchData(
    `/financials/view${appointmentId}`,
    ["financialsControl", "page", "payments"]
  );

  const refetchAppointmentListData = useGlobalStore(
    (state) => state.globalRefetch
  );

  const [paymentsPayload, setPaymentsPayload] = useState({
    amount: "0,00",
    payment_method: "Card",
    payment_reference: null,
    payment_date: format(new Date(), "yyyy-MM-dd"),
  });

  const { createMutation } = usePostData(
    `/payments/create${appointmentId}`,
    queryKeyToInvalidate
  );

  const isChecked = useRef(false);

  const [chipColorTracker, setChipColorTracker] = useState(
    new Array("success")
  );

  function handleChipClick(event, id) {
    const mutableArray = Array().fill("inherit", 7);
    mutableArray[id] = "success";
    setChipColorTracker(mutableArray);

    setPaymentsPayload((prev) => ({
      ...prev,
      payment_method: event.target.innerHTML,
    }));
  }

  function handleChecked() {
    isChecked.current = !isChecked.current;
    if (isChecked.current) {
      setPaymentsPayload((prev) => ({
        ...prev,
        amount: data?.amount_due,
      }));
    } else {
      setPaymentsPayload((prev) => ({
        ...prev,
        amount: "",
      }));
    }
  }

  async function handleSubmit() {
    await createMutation.mutateAsync(paymentsPayload);
    setPaymentsPayload((prev) => ({
      ...prev,
      amount: null,
    }));
    refreshPaymentsPage();
    refetchAppointmentListData && refetchAppointmentListData();
  }
  function handleChange(event) {
    const { name, value } = event.target;

    setPaymentsPayload((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  }

  return (
    <>
      <div className="fixed left-0 top-0 bg-white h-screen w-full  flex flex-col  ">
        <div>
          <GenericTopBar onclick={hideComponent} label="Payments" />
        </div>

        <div className=" flex justify-center">
          <div className="flex mt-4 mb-4 w-[98%] h-52  border border-inherit shadow-md shadow-black/40 relative justify-between items-center py-4 px-8">
            <p className="text-lg  text-slate-500 absolute top-1 left-5">
              Totals
            </p>
            <div>
              <FormControlLabel
                label="Paid in Full"
                control={
                  <Checkbox defaultChecked={false} onClick={handleChecked} />
                }
              />
            </div>

            <div>
              <p>Appointment Total: R{data?.total_amount}</p>
              <p>Discounts: R{data?.discount}</p>
              <p>Payments: R{data?.amount_paid}</p>
              <p>Amount outstanding: R {data?.amount_due}</p>
            </div>
          </div>
        </div>
        <div className="space-y-7 p-4">
          <MobileDatePicker
            orientation="portrait"
            label="Payment Date"
            closeOnSelect={true}
            slotProps={{
              actionBar: { actions: [] },
              textField: {
                fullWidth: true,
                variant: "standard",
                sx: { border: "none" },
                InputProps: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarIcon />
                    </InputAdornment>
                  ),
                },
              },
            }}
            format="yyyy-MM-dd"
            name="payment_date"
            value={new Date(paymentsPayload.payment_date) ?? new Date()}
          />

          <div>
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">ZAR</InputAdornment>
                ),
              }}
              fullWidth
              variant="standard"
              type="number"
              disabled={isChecked.current}
              onChange={handleChange}
              name="amount"
              value={paymentsPayload?.amount || ""}
              label="Payment amount"
            />
          </div>

          <div>
            <TextField
              variant="standard"
              fullWidth
              label="Reference"
              name="payment_reference"
              onChange={handleChange}
              value={paymentsPayload?.payment_reference || ""}
              type="text"
            />
          </div>

          <div className="space-y-5">
            <h2 className="text-sm text-inherit">Payment Method</h2>
            <div className="flex gap-4">
              <Chip
                clickable={true}
                variant="filled"
                label="Card"
                color={chipColorTracker[0]}
                onClick={(event) => handleChipClick(event, 0)}
              />
              <Chip
                id={5}
                color={chipColorTracker[1]}
                clickable={true}
                variant="filled"
                label="Cash"
                onClick={(event) => handleChipClick(event, 1)}
              />
              <Chip
                id={2}
                color={chipColorTracker[2]}
                clickable={true}
                variant="filled"
                label="EFT"
                onClick={(event) => handleChipClick(event, 2)}
              />
              <Chip
                id={3}
                color={chipColorTracker[3]}
                clickable={true}
                variant="filled"
                label="Medical Aid"
                onClick={(event) => handleChipClick(event, 3)}
              />
              <Chip
                id="3"
                color={chipColorTracker[4]}
                clickable={true}
                variant="filled"
                label="Gift"
                onClick={(event) => handleChipClick(event, 4)}
              />
              <Chip
                color={chipColorTracker[5]}
                variant="filled"
                label="Client Credit"
                onClick={(event) => handleChipClick(event, 5)}
                clickable={true}
              />
              <Chip
                color={chipColorTracker[6]}
                variant="filled"
                label="Write off"
                onClick={(event) => handleChipClick(event, 6)}
                clickable={true}
              />
              <Chip
                color={chipColorTracker[7]}
                clickable={true}
                variant="filled"
                label="Voucher"
                onClick={(event) => handleChipClick(event, 7)}
              />
            </div>
          </div>
          <div className="flex justify-between">
            <Button onClick={hideComponent} color="inherit" variant="contained">
              Cancel
            </Button>
            <Button
              disabled={parseFloat(data?.amount_due) <= 0}
              onClick={handleSubmit}
              variant="contained"
              color="primary"
            >
              Add payment
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
