import { useEffect, useState } from "react";
import { useFetchData } from "../../CustomHooks/serverStateHooks";
import GenericTopBar from "./GenericTopBar";

import { Button, Fab, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CreateAppointmentType from "./CreateAppointmentType";
import { useGlobalStore } from "../../zustandStore/store";
export default function AppointmentTypePicker({
  profileId,
  hideComponent,
  onclick,
}) {
  const { data: appointTypeData } = useFetchData(
    `/appointmentTypes/viewAll${profileId}`,
    "appointmentTypeDataAppTypePicker"
  );

  const [searchBarInput, setSearchBarInput] = useState("");
  const [filteredListToMap, setFilteredListToMap] = useState("");
  const [showCreateNewAppointmentType, setShowCreateNewAppointmentType] =
    useState(false);
  useEffect(() => {
    let filteredList = [];
    if (searchBarInput && appointTypeData.length > 0 && appointTypeData) {
      filteredList = appointTypeData.filter((appointment) => {
        return appointment.appointment_name.includes(searchBarInput);
      });
      setFilteredListToMap(filteredList);
    } else setFilteredListToMap(appointTypeData);
  }, [searchBarInput, appointTypeData]);

  return (
    <>
      <div className=" w-3/6 min-h-[30em] bg-white relative ">
        <GenericTopBar
          label="Select an appointment type"
          onclick={hideComponent}
        />

        <div className="flex justify-center relative">
          <div className="absolute  -top-3 right-7   ">
            <Fab
              sx={{ zIndex: 10 }}
              onClick={() =>
                setShowCreateNewAppointmentType(!showCreateNewAppointmentType)
              }
              size="small"
              color="primary"
            >
              <AddIcon />
            </Fab>
          </div>
          <div className="w-11/12 h-[330px] border-black  relative rounded-sm overflow-y-scroll overflow-x-hidden flex-col  bg-slate-200 flex  mt-3 ">
            {showCreateNewAppointmentType && (
              <div className="absolute z-30 left-0 top-0 w-full ">
                <CreateAppointmentType
                  onHandleSumbitAction={(responseData) => {
                    onclick(responseData);
                    setShowCreateNewAppointmentType(
                      !showCreateNewAppointmentType
                    );
                  }}
                  hideComponent={() =>
                    setShowCreateNewAppointmentType(
                      !showCreateNewAppointmentType
                    )
                  }
                  queryKeyToInvalidate={"appointmentTypeDataAppTypePicker"}
                />
              </div>
            )}

            <div className="pb-1 bg-white">
              <TextField
                size="small"
                sx={{ backgroundColor: "white" }}
                fullWidth
                variant="outlined"
                placeholder="Search by appointment type name"
                value={searchBarInput || ""}
                onChange={(event) => setSearchBarInput(event.target.value)}
              />
            </div>
            {filteredListToMap && filteredListToMap.length > 0
              ? filteredListToMap.map((appType) => {
                  return (
                    <div
                      key={appType.id}
                      onClick={() => onclick(appType)}
                      className="border-b border-slate-400 py-2 pl-3  hover:bg-slate-500  "
                    >
                      {appType.appointment_name}
                    </div>
                  );
                })
              : " No content to display. Please create an appoitnment Type"}
          </div>
        </div>
        <div className="absolute bottom-2 left-2 ">
          <Button
            variant="contained"
            color="inherit"
            onClick={() => hideComponent()}
          >
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
}
