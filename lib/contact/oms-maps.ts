/** Client-confirmed OMS office Google Maps location. */
export const OMS_GOOGLE_MAPS_URL =
  "https://maps.app.goo.gl/K6z7xSY25sVxDKBP8?g_st=iw";

/**
 * Public Maps embed for the same office pin.
 * Resolved from the official share-link redirect (ftid
 * 0x3e45db91f375ac19:0x6a7516cb401a1fc5, plus code 6FW3+Q39).
 * Coordinates are used only for camera framing, from that verified place.
 */
const OMS_MAPS_EMBED_EN =
  "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1200!2d51.452743!3d25.2469088!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e45db91f375ac19%3A0x6a7516cb401a1fc5!2sOryxi%20maintenance%20services!5e0!3m2!1sen!2sqa";

const OMS_MAPS_EMBED_AR =
  "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1200!2d51.452743!3d25.2469088!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e45db91f375ac19%3A0x6a7516cb401a1fc5!2sOryxi%20maintenance%20services!5e0!3m2!1sar!2sqa";

export function getOmsGoogleMapsEmbedUrl(locale: "en" | "ar"): string {
  return locale === "ar" ? OMS_MAPS_EMBED_AR : OMS_MAPS_EMBED_EN;
}
