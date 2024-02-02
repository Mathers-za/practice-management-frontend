export default function AppTypeCreation({ profileId }) {
  const { createMutation } = usePostData(
    `/appointmentTypes/create${profileId}`
  );
  const [appTypeData, setAppTypeData] = useState({});
  const { handleChange } = useHandleChange(setAppTypeData);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (appTypeData.price) {
            const newPrice = cleanCurrency(appTypeData.price);
            createMutation.mutate({
              ...appTypeData,
              price: newPrice,
            });
          }
        }}
      >
        <TextInput
          type="text"
          onChange={handleChange}
          name="appointment_name"
          value={appTypeData.appointment_name || ""}
          labelText="App Type name"
        />
        <TextInput
          onChange={handleChange}
          name="duration"
          value={appTypeData.duration || ""}
          labelText="Duration"
          type="number"
        />
        <TextInput
          onChange={handleChange}
          name="price"
          value={appTypeData.price || ""}
          labelText="Price"
          type="number"
        />
        <button type="submit" disabled={Object.keys(appTypeData).length === 0}>
          Save
        </button>
      </form>
    </>
  );
}
