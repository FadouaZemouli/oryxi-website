import { controlClassName, controlErrorClassName } from "@/components/forms/control-styles";

type TextAreaProps = {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  describedBy?: string;
  invalid?: boolean;
  rows?: number;
};

export function TextArea({
  id,
  name,
  value,
  onChange,
  placeholder,
  required,
  describedBy,
  invalid,
  rows = 6,
}: TextAreaProps) {
  return (
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      required={required}
      aria-required={required}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      rows={rows}
      className={`${controlClassName} min-h-32 resize-y ${invalid ? controlErrorClassName : ""}`.trim()}
    />
  );
}
