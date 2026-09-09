export const contactInquiryTypeIds = [
  "general",
  "mep",
  "electromechanical",
  "engineering",
  "hvac",
  "qcdd",
  "amc",
  "peerless",
  "project",
  "other",
] as const;

export type ContactInquiryTypeId = (typeof contactInquiryTypeIds)[number];

export function isContactInquiryTypeId(
  value: string,
): value is ContactInquiryTypeId {
  return contactInquiryTypeIds.includes(value as ContactInquiryTypeId);
}
