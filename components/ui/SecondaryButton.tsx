import Link from "next/link";
import type { MouseEventHandler } from "react";
import { FooterHashLink } from "@/components/layout/FooterHashLink";

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
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
} & (
  | { href: string; type?: never }
  | { href?: undefined; type?: "button" | "submit" }
);

export function SecondaryButton({
  children,
  className = "",
  tone = "default",
  onClick,
  ...props
}: SecondaryButtonProps) {
  const classNameValue =
    `${baseClasses} ${toneClasses[tone]} ${className}`.trim();

  if (props.href) {
    const LinkComponent = props.href.includes("#") ? FooterHashLink : Link;
    return (
      <LinkComponent
        href={props.href}
        className={classNameValue}
        onClick={onClick as MouseEventHandler<HTMLAnchorElement> | undefined}
      >
        {children}
      </LinkComponent>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      className={classNameValue}
      onClick={onClick as MouseEventHandler<HTMLButtonElement> | undefined}
    >
      {children}
    </button>
  );
}
