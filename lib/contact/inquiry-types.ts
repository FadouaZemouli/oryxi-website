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

export const CONTACT_INQUIRY_TYPE_LABELS_EN: Record<
  ContactInquiryTypeId,
  string
> = {
  general: "General Enquiry",
  mep: "MEP Services",
  electromechanical: "Electromechanical Services",
  engineering: "Engineering Services",
  hvac: "HVAC Systems",
  qcdd: "QCDD Consultation",
  amc: "AMC / Maintenance",
  peerless: "Peerless Pump Solutions",
  project: "Project Enquiry",
  other: "Other",
};
