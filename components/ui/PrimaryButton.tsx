import Link from "next/link";
import type { MouseEventHandler } from "react";
import { FooterHashLink } from "@/components/layout/FooterHashLink";

const classes =
  "inline-flex items-center justify-center rounded-sm bg-oms-burgundy px-4 py-2.5 text-sm font-medium text-oms-white transition-colors hover:bg-[#6e1238] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oms-burgundy";

type PrimaryButtonProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
} & (
  | { href: string; type?: never }
  | { href?: undefined; type?: "button" | "submit" }
);

export function PrimaryButton({
  children,
  className = "",
  onClick,
  ...props
}: PrimaryButtonProps) {
  const classNameValue = `${classes} ${className}`.trim();

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
