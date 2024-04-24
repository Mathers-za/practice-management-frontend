export function patientCreationGuidance(patientInfo) {
  let message = "";

  const myObj = [
    {
      name: "contact_number",
      message: "Contact number is recommended but not enforced",
    },
    ,
    {
      name: "email",
      message:
        "Patient email is recommended  in order to send notfication emails but not enforced",
    },
    { name: "first_name", message: "First Name required" },
  ];
  if (patientInfo) {
    myObj.forEach((element) => {
      if (!patientInfo[element.name] || patientInfo[patientInfo] === null) {
        message = element.message;
        return;
      }
    });
    return message;
  }
}
