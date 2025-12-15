import { useState } from "react";
import "./form.css";

export default function FormCard({
  title,
  fields,
  submitLabel = "Save",
  onSubmit,
  onFieldChange,
  values: controlledValues,
  disabled = false
}) {
  const isControlled = controlledValues !== undefined;

  const [uncontrolledValues, setUncontrolledValues] = useState(() =>
    Object.fromEntries(fields.map(f => [f.name, f.defaultValue ?? ""]))
  );

  const values = isControlled ? controlledValues : uncontrolledValues;

  const handleChange = (name, value) => {
    if (!isControlled) {
      setUncontrolledValues(prev => ({ ...prev, [name]: value }));
    }
    if (onFieldChange) {
      onFieldChange(name, value);
    }

    const field = fields.find(f => f.name === name);
    if (field?.onChange) {
      field.onChange(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(values);
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      {title && <h3>{title}</h3>}

      {fields.map(field => (
        <div key={field.name} className="form-row">
          {field.label && <label htmlFor={field.name}>{field.label}</label>}

          {field.type === "select" ? (
            <select
              id={field.name}
              className="form-input"
              value={values[field.name] ?? ""}
              onChange={e => handleChange(field.name, e.target.value)}
              disabled={disabled || field.disabled}
            >
              <option value="">{field.placeholder || "Select"}</option>
              {field.options?.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={field.name}
              className="form-input"
              type={field.type || "text"}
              placeholder={field.placeholder}
              value={values[field.name] ?? ""}
              onChange={e => handleChange(field.name, e.target.value)}
              readOnly={field.readOnly}
              disabled={disabled || field.disabled}
            />
          )}
        </div>
      ))}

      {submitLabel && (
        <button
          type="submit"
          className="form-button"
          disabled={disabled}
        >
          {submitLabel}
        </button>
      )}
    </form>
  );
}
