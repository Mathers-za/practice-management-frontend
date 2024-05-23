export function setGlobalVariablesAccordingToAppointmentfilterEndpoint(
  setterCbs,
  dataObject
) {
  setterCbs.GlobalAppointmentData({
    appointment_date: dataObject.appointment_date,
    start_time: dataObject.start_time,
    end_time: dataObject.end_time,
    id: dataObject.appointment_id,
  });
  setterCbs.setGlobalFinancialData({
    amount_due: dataObject.amount_due,
    total_amount: dataObject.total_amount,
    amount_paid: dataObject.amount_paid,
  });

  setterCbs.setGlobalPatientData({
    first_name: dataObject.patient_first_name,
    last_name: dataObject.patient_last_name,
    id: dataObject.patient_id,
  });

  setterCbs.setGlobalAppointmentTypeData({
    appointment_name: dataObject.appointment_name,
    id: dataObject.apptype_id,
  });

  setterCbs.setGlobalInvoiceData({
    invoice_status: dataObject.invoice_status,
    invoice_title: dataObject.invoice_title,
  });
}
