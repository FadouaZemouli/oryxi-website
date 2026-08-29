import { controlClassName } from "@/components/forms/control-styles";

type FileFieldProps = {
  id: string;
  name: string;
  label: string;
  hint: string;
  hintId: string;
  noneLabel: string;
  removeLabel: string;
  accept: string;
  file: File | null;
  onChange: (file: File | null) => void;
};

export function FileField({
  id,
  name,
  label,
  hint,
  hintId,
  noneLabel,
  removeLabel,
  accept,
  file,
  onChange,
}: FileFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-oms-dark">
        {label}
      </label>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <input
          key={file ? `${file.name}-${file.size}` : "empty"}
          id={id}
          name={name}
          type="file"
          accept={accept}
          onChange={(event) => onChange(event.target.files?.[0] ?? null)}
          aria-describedby={hintId}
          className={`${controlClassName} cursor-pointer file:me-3 file:rounded-sm file:border-0 file:bg-oms-burgundy file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-oms-white`}
        />
        {file ? (
          <button
            type="button"
            className="text-sm font-medium text-oms-burgundy underline-offset-2 hover:underline"
            onClick={() => onChange(null)}
          >
            {removeLabel}
          </button>
        ) : (
          <p className="text-sm text-oms-dark/80">{noneLabel}</p>
        )}
      </div>
      <p id={hintId} className="mt-2 text-sm leading-6 text-oms-dark/70">
        {hint}
      </p>
    </div>
  );
}
