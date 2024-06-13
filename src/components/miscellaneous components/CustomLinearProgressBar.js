import { LinearProgress } from "@mui/material";

export default function CustomLinearProgressBar({
  className = "absolute top-0 left-0 w-full",
  color = "primary",
  sx,
  isLoading = false,
}) {
  return (
    <>
      {isLoading && (
        <div className={className}>
          <LinearProgress color={color} sx={sx} />
        </div>
      )}
    </>
  );
}
