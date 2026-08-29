type FormFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  requiredLabel: string;
  optionalLabel: string;
  hint?: string;
  hintId?: string;
  error?: string;
  errorId?: string;
  children: React.ReactNode;
};

export function FormField({
  id,
  label,
  required = false,
  requiredLabel,
  optionalLabel,
  hint,
  hintId,
  error,
  errorId,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-oms-dark">
        {label}
        {required ? (
          <span className="ms-1 text-oms-burgundy" aria-hidden="true">
            *
          </span>
        ) : null}
        <span className="sr-only">
          {required ? ` (${requiredLabel})` : ` (${optionalLabel})`}
        </span>
      </label>
      <div className="mt-2">{children}</div>
      {hint ? (
        <p id={hintId} className="mt-2 text-sm leading-6 text-oms-dark/70">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-oms-burgundy" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
