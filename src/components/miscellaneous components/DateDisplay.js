import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";

export default function DateDisplay({ onclick, dateStringOrObject }) {
  return (
    <>
      <div
        onClick={() => onclick()}
        className="flex  rounded-full py-1  px-3 h-fit gap-2 bg-sky-500 text-white justify-start hover:bg-sky-400 cursor-pointer items-center"
      >
        <FontAwesomeIcon
          icon="fa-regular fa-calendar"
          style={{ color: "white" }}
        />
        {format(new Date(dateStringOrObject), "yyyy-MM-dd")}
      </div>
    </>
  );
}
