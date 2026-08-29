type CardProps = {
  title: string;
  children?: React.ReactNode;
};

export function Card({ title, children }: CardProps) {
  return (
    <article className="border border-oms-gray/70 bg-oms-white p-6">
      <h3 className="text-lg font-semibold text-oms-burgundy">{title}</h3>
      {children ? (
        <div className="mt-3 text-sm leading-6 text-oms-dark/80">{children}</div>
      ) : null}
    </article>
  );
}
