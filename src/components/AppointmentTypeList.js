import { useFetchData } from "../CustomHooks/serverStateHooks";
import { useNavigate } from "react-router-dom";

export default function AppointmentTypeList({ profileId }) {
  const navigate = useNavigate();
  const { data } = useFetchData(`/appointmentTypes/viewAll${profileId}`);

  return (
    <>
      {data && data.length > 0 ? (
        data.map((appointmentType) => {
          return (
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
              <div style={{ width: "25%" }} key={appointmentType.id}>
                {" "}
                {console.log(appointmentType.id)}
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
