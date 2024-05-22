import { Button } from "@mui/material";

export default function EmailNotificationTypeTile({
  heading,
  textContent,
  className = "",
  onclick = undefined,
  id,
}) {
  console.log("fired");
  return (
    <>
      <div
        id={id}
        onClick={onclick ? () => onclick(id) : null}
        className={`w-full min-h-full  flex flex-col  p-3 $ border border-black/30 rounded-md shadow-md shadow-black/30  ${className}`}
      >
        <h2 className="font-semibold text-lg mb-4">{heading}</h2>
        <p className="grow">{textContent}</p>
        <div className=" justify-self-end self-end ">
          <Button
            id={id}
            onClick={onclick ? () => onclick(id) : null}
            variant="contained"
            color="primary"
            size="small"
          >
            Edit
          </Button>
        </div>
      </div>
    </>
  );
}
