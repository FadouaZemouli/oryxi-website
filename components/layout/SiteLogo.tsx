import Image from "next/image";

const logoSources = {
  default: {
    src: "/logos/oms-logo.png",
    width: 913,
    height: 600,
  },
  transparent: {
    src: "/logos/oms-logo-transparent.png",
    width: 1672,
    height: 941,
  },
} as const;

type LogoVariant = keyof typeof logoSources;

type SiteLogoProps = {
  className?: string;
  /**
   * `default` — opaque artwork on light surfaces.
   * `onDark` — transparent artwork, no plate.
   * `header` — both assets; CSS selects by `html[data-oms-header]`.
   */
  surface?: "default" | "onDark" | "header";
  source?: LogoVariant;
  priority?: boolean;
  sizes?: string;
};

function LogoImage({
  variant,
  className,
  sizes,
  priority,
  alt,
}: {
  variant: LogoVariant;
  className: string;
  sizes: string;
  priority: boolean;
  alt: string;
}) {
  const asset = logoSources[variant];

  return (
    <Image
      src={asset.src}
      alt={alt}
      width={asset.width}
      height={asset.height}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}

export function SiteLogo({
  className = "h-10 w-auto sm:h-12",
  surface = "default",
  source,
  priority = false,
  sizes = "160px",
}: SiteLogoProps) {
  if (surface === "header") {
    return (
      <span className="oms-site-logo">
        <LogoImage
          variant="default"
          className={`oms-logo-on-light ${className}`.trim()}
          sizes={sizes}
          priority={priority}
          alt="ORYXI Maintenance Services"
        />
        <LogoImage
          variant="transparent"
          className={`oms-logo-on-dark ${className}`.trim()}
          sizes={sizes}
          priority={priority}
          alt="ORYXI Maintenance Services"
        />
      </span>
    );
  }

  const variant: LogoVariant =
    source ?? (surface === "onDark" ? "transparent" : "default");

  return (
    <LogoImage
      variant={variant}
      className={className}
      sizes={sizes}
      priority={priority}
      alt="ORYXI Maintenance Services"
    />
  );
}
