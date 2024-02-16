import { useFetchData } from "../CustomHooks/serverStateHooks";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export default function AppointmentTypeList({ profileId }) {
  const navigate = useNavigate();
  const { data } = useFetchData(
    `/appointmentTypes/viewAll${profileId}`,
    "viewAllAppointments"
  );

  return (
    <>
      {data && data.length > 0 ? (
        data.map((appointmentType) => {
          return (
            <div
              key={appointmentType.id}
              style={{ display: "flex", justifyContent: "space-evenly" }}
            >
              <div style={{ width: "25%" }}>
                {" "}
                {appointmentType.appointment_name} <br />
                price: {appointmentType.price} <br />
                <button
                  onClick={() => {
                    navigate(`view/${appointmentType.id}`);
                  }}
                >
                  Edit{" "}
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <div>
          Once you create appointment type they will be displayed here for you
          to edit
        </div>
      )}
    </>
  );
}
