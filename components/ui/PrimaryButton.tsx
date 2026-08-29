import Link from "next/link";

const classes =
  "inline-flex items-center justify-center rounded-sm bg-oms-burgundy px-4 py-2.5 text-sm font-medium text-oms-white transition-colors hover:bg-[#6e1238] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oms-burgundy";

type PrimaryButtonProps = {
  children: React.ReactNode;
  className?: string;
} & (
  | { href: string; type?: never }
  | { href?: undefined; type?: "button" | "submit" }
);

export function PrimaryButton({
  children,
  className = "",
  ...props
}: PrimaryButtonProps) {
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
