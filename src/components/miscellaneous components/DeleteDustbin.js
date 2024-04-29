import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function DeleteDustbin({ onclick }) {
  return (
    <>
      <div
        onClick={onclick ? () => onclick() : null}
        className="  h-fit w-fit cursor-pointer  hover:animate-bounce delay-75"
      >
        <FontAwesomeIcon
          icon="fa-solid fa-trash"
          style={{ color: "#e30d2d" }}
        />
      </div>
    </>
  );
}
