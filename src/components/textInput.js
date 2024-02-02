import "../components/textBoxStyle.css";

export default function TextInput({
  labelText,
  type,
  name,
  className,
  value,
  onChange,
  required,
}) {
  return (
    <>
      <label htmlFor={{ labelText, type, name, value, className }}>
        {labelText} :{" "}
        <input
          onChange={onChange}
          type={type}
          className="bgColor"
          name={name}
          value={value}
          required={required}
        />
      </label>
    </>
  );
}
