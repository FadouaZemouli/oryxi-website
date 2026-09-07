"use client";

type SmoothHashLinkProps = {
  href: `#${string}`;
  className?: string;
  children: React.ReactNode;
};

export function SmoothHashLink({
  href,
  className = "",
  children,
}: SmoothHashLinkProps) {
  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        const target = document.querySelector(href);
        if (!(target instanceof HTMLElement)) {
          return;
        }

        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", href);
      }}
    >
      {children}
    </a>
  );
}
