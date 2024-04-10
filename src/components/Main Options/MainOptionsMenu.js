export default function MainOptionsMenu() {
  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          zIndex: 2,
          minHeigh: "40vh",
          minWidth: "100%",
          background: "grey",
        }}
      >
        <div>create invoice</div>
        <div>Make a payment</div>
        <div>Delete appointment</div>
        <div>Reshedule appointment</div>
        <div>Cancel Appointment</div>
      </div>
    </>
  );
}
