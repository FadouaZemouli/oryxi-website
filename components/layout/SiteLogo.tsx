import Image from "next/image";

/**
 * Official OMS logo paths.
 * Keep `default` pointing at the current opaque asset.
 * When a transparent derivative is approved, set `transparent` and
 * prefer it for `onDark` surfaces — do not invent or download assets.
 */
const logoSources = {
  default: "/logos/oms-logo.png",
  // transparent: "/logos/oms-logo-transparent.png",
} as const;

type LogoVariant = keyof typeof logoSources;

type SiteLogoProps = {
  className?: string;
  /**
   * Visual surface context. `onDark` wraps the opaque RGB logo in a
   * white plate until a transparent asset is available.
   */
  surface?: "default" | "onDark";
  /** Prefer a specific source when multiple assets exist. */
  source?: LogoVariant;
  priority?: boolean;
  sizes?: string;
};

export function SiteLogo({
  className = "h-10 w-auto sm:h-12",
  surface = "default",
  source = "default",
  priority = false,
  sizes = "160px",
}: SiteLogoProps) {
  const src = logoSources[source];
  const image = (
    <Image
      src={src}
      alt="ORYXI Maintenance Services"
      width={913}
      height={600}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );

  if (surface === "onDark") {
    return (
      <span className="inline-flex bg-oms-white px-3 py-2">{image}</span>
    );
  }

  return image;
}
