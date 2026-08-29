import { controlClassName, controlErrorClassName } from "@/components/forms/control-styles";

type SelectOption = {
  value: string;
  label: string;
};

type SelectFieldProps = {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: readonly SelectOption[];
  required?: boolean;
  describedBy?: string;
  invalid?: boolean;
};

export function SelectField({
  id,
  name,
  value,
  onChange,
  placeholder,
  options,
  required,
  describedBy,
  invalid,
}: SelectFieldProps) {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      required={required}
      aria-required={required}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      className={`${controlClassName} ${invalid ? controlErrorClassName : ""}`.trim()}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
