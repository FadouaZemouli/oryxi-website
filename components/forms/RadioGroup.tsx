type RadioOption = {
  value: string;
  label: string;
};

type RadioGroupProps = {
  name: string;
  legend: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly RadioOption[];
};

export function RadioGroup({
  name,
  legend,
  value,
  onChange,
  options,
}: RadioGroupProps) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-oms-dark">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-4">
        {options.map((option) => {
          const optionId = `${name}-${option.value}`;

          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className="inline-flex cursor-pointer items-center gap-2 text-sm text-oms-dark"
            >
              <input
                id={optionId}
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                className="size-4 accent-oms-burgundy"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
