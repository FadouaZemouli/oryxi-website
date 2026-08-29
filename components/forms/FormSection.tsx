type FormSectionProps = {
  title: string;
  children: React.ReactNode;
};

export function FormSection({ title, children }: FormSectionProps) {
  return (
    <fieldset className="border border-oms-gray/70 bg-oms-white p-6">
      <legend className="px-2 text-lg font-semibold text-oms-burgundy">
        {title}
      </legend>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}
