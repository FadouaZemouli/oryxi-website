import { controlClassName, controlErrorClassName } from "@/components/forms/control-styles";

type TextInputProps = {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
  describedBy?: string;
  invalid?: boolean;
};

export function TextInput({
  id,
  name,
  value,
  onChange,
  type = "text",
  autoComplete,
  placeholder,
  required,
  describedBy,
  invalid,
}: TextInputProps) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      autoComplete={autoComplete}
      placeholder={placeholder}
      required={required}
      aria-required={required}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      className={`${controlClassName} ${invalid ? controlErrorClassName : ""}`.trim()}
    />
  );
}
