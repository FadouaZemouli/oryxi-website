import Link from "next/link";

const baseClasses =
  "inline-flex items-center justify-center rounded-sm border bg-transparent px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oms-burgundy";

const toneClasses = {
  default:
    "border-oms-burgundy text-oms-burgundy hover:bg-oms-burgundy hover:text-oms-white",
  onDark:
    "border-white/35 text-oms-white hover:border-oms-burgundy hover:bg-oms-burgundy hover:text-oms-white",
} as const;

type SecondaryButtonProps = {
  children: React.ReactNode;
  className?: string;
  tone?: keyof typeof toneClasses;
} & (
  | { href: string; type?: never }
  | { href?: undefined; type?: "button" | "submit" }
);

export function SecondaryButton({
  children,
  className = "",
  tone = "default",
  ...props
}: SecondaryButtonProps) {
  const classNameValue =
    `${baseClasses} ${toneClasses[tone]} ${className}`.trim();

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
