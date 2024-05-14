export function getChipProperties(invoiceStatus, amountDue) {
  const properties = {};

  if (parseFloat(amountDue) <= 0) {
    properties.color = "success";
    properties.label = "Paid";
  }
  if (
    parseFloat(amountDue) > 0 &&
    (invoiceStatus === "In progress" || invoiceStatus === "Sent")
  ) {
    properties.color = "primary";
    properties.label = "Invoiced";
  }

  if (parseFloat(amountDue) > 0 && !invoiceStatus) {
    properties.color = "primary";
    properties.label = "New";
  }

  return properties;
}
