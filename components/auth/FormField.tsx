type FormFieldProps = {
  id: string;
  label: string;
  name: string;
  type?: string;
  error?: string;
  defaultValue?: string;
  required?: boolean;
  autoComplete?: string;
  as?: "input" | "textarea";
  rows?: number;
};

export default function FormField({
  id,
  label,
  name,
  type = "text",
  error,
  defaultValue,
  required,
  autoComplete,
  as = "input",
  rows = 4,
}: FormFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      {as === "textarea" ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          defaultValue={defaultValue}
          required={required}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          defaultValue={defaultValue}
          required={required}
          autoComplete={autoComplete}
        />
      )}
      {error && <p className="form-field__error">{error}</p>}
    </div>
  );
}
