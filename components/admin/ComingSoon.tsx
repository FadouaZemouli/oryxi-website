type ComingSoonProps = {
  title: string;
  description: string;
};

export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <section className="oms-admin-coming-soon" aria-labelledby="oms-admin-coming-soon-heading">
      <h1 id="oms-admin-coming-soon-heading" className="oms-admin-heading">
        {title}
      </h1>
      <p>{description}</p>
    </section>
  );
}
