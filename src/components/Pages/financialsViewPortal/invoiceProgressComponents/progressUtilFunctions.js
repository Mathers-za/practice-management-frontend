import { format, differenceInDays } from "date-fns";

function formatDateYearMonthDay(date) {
  return format(date, "yyyy-MM-dd");
}

function filterInvoiceData(data, invoice_status, searchBarInput = null) {
  let filtered = data.filter(
    (invoice) => invoice.invoice_status === invoice_status
  );
  if (searchBarInput) {
    filtered = filtered.filter((invoice) => {
      const invoiceValues = Object.values(invoice);
      return invoiceValues.some((value) => {
        if (value !== null && typeof value !== "string") {
          return value
            .toString()
            .toLowerCase()
            .includes(searchBarInput.toLowerCase());
        } else {
          if (value !== null) {
            return value.toLowerCase().includes(searchBarInput.toLowerCase());
          }
        }
      });
    });
  }
  return filtered;
}

function filterPastDueInvoices(invoiceData, startIntInDays, endIntInDays) {
  const filteredData = invoiceData.filter((invoice) => {
    if (parseFloat(invoice.amount_due) > 0) {
      const result = differenceInDays(new Date(), invoice.invoice_end_date);

      return result >= startIntInDays && result <= endIntInDays;
    } else {
      return false;
    }
  });
  return filteredData;
}

export { filterInvoiceData, formatDateYearMonthDay, filterPastDueInvoices };
