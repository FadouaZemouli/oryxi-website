type CheckboxFieldProps = {
  id: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  required?: boolean;
  describedBy?: string;
  invalid?: boolean;
  error?: string;
  errorId?: string;
};

export function CheckboxField({
  id,
  name,
  checked,
  onChange,
  label,
  required,
  describedBy,
  invalid,
  error,
  errorId,
}: CheckboxFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-oms-dark"
      >
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          required={required}
          aria-required={required}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className="mt-1 size-4 shrink-0 accent-oms-burgundy"
        />
        <span>
          {label}
          {required ? (
            <span className="ms-1 text-oms-burgundy" aria-hidden="true">
              *
            </span>
          ) : null}
        </span>
      </label>
      {error ? (
        <p
          id={errorId}
          className="mt-2 text-sm text-oms-burgundy"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
