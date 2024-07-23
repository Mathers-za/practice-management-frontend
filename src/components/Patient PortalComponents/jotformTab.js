import { Button, IconButton, Tooltip } from "@mui/material";
import {
  useGlobalStore,
  usePatientPortalStore,
} from "../../zustandStore/store";
import { DefaultCopyField } from "@eisberg-labs/mui-copy-field";
import defaultData from "../../DefaultData/defaultData";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function JotformTab() {
  const { patientId, patientData } = usePatientPortalStore();
  const { globalProfileData } = useGlobalStore();
  const jotformLink =
    defaultData.urlForJotFormWebHook + "?patientId=" + "" + patientId;
  const whatsappLink = `https://wa.me/?text=Please%20click%20on%20the%20link%20below%20to%20fill%20out%20your%20details%20before%20your%20appointment%20with%20${
    globalProfileData.first_name + " " + (globalProfileData.last_name || "")
  }%0D%0A%0D%0A${jotformLink}
`;
  const patientMailToString = `mailto:${
    patientData?.email
  }?subject=Patient%20information%20form&body=Good%20day%0D%0A%0D%0APlease%20click%20on%20the%20link%20below%20to%20fill%20out%20your%20details%20before%20your%20appointment%20with%20${
    globalProfileData.first_name + " " + (globalProfileData.last_name || "")
  }%0D%0A%0D%0A${jotformLink}%0D%0A%0D%0AKind%20regards%0D%0A${
    globalProfileData.first_name + " " + (globalProfileData.last_name || "")
  }  `;
  return (
    <>
      <div className="shadow-md p-5 shadow-black/20 rounded-sm">
        <div className="  space-y-6">
          <div className="mb-2">
            <h2 className="text-black text-lg font-semibold">How it works</h2>
            <p className="mb-3">
              If you copy and send the link below to this patient, he or she
              will be taken to a pre-made form on a third-party website called
              JotForm where they will be met with a pre-made form. Once they
              submit the form, it will automatically sync the form data with the
              patient's data in this app.
            </p>
            <h2 className="text-black text-lg font-semibold">But why?</h2>
            <p>
              It's simple really. We save you time on paperwork so that you can
              focus on delivering great service to your clients/patients.
            </p>
          </div>
          <div className="flex gap-5">
            <DefaultCopyField
              sx={{ width: "70%" }}
              label="Click on the button to copy this link"
              value={jotformLink}
            />{" "}
            <div className="self-start relative bottom-1">
              <Tooltip title="Open form">
                <a href={jotformLink} target="_blank">
                  <OpenInNewIcon color="action" fontSize="medium" />
                </a>
              </Tooltip>
            </div>
          </div>

          <h2>
            Alternatively, you can click on the options below for a more direct
            approach to sending the link.
          </h2>

          <div className="flex px-2 justify-between py-5 border-y-2 border-slate-">
            <a href={whatsappLink} target="_blank">
              <Button variant="contained" color="success">
                WhatsApp
              </Button>
            </a>
            {patientData?.email && (
              <a href={patientMailToString} target="_blank">
                <Button
                  sx={{ width: "112px" }}
                  variant="contained"
                  color="primary"
                >
                  Mail
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
