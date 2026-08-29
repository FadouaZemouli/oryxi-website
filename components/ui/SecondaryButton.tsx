import Link from "next/link";

const classes =
  "inline-flex items-center justify-center rounded-sm border border-oms-burgundy bg-transparent px-4 py-2.5 text-sm font-medium text-oms-burgundy transition-colors hover:bg-oms-burgundy hover:text-oms-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oms-burgundy";

type SecondaryButtonProps = {
  children: React.ReactNode;
  className?: string;
} & (
  | { href: string; type?: never }
  | { href?: undefined; type?: "button" | "submit" }
);

export function SecondaryButton({
  children,
  className = "",
  ...props
}: SecondaryButtonProps) {
  const classNameValue = `${classes} ${className}`.trim();

  if (props.href) {
    return (
      <Link href={props.href} className={classNameValue}>
        {children}
      </Link>
    );
  }

  return (
    <button type={props.type ?? "button"} className={classNameValue}>
      {children}
    </button>
  );
}
