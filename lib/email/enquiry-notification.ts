import { Resend } from "resend";
import { CONTACT_INQUIRY_TYPE_LABELS_EN } from "@/lib/contact/inquiry-types";
import type { ContactEnquiryPayload } from "@/lib/contact/validate";

const NOTIFICATION_TO = "marketing@oms.com.qa";
const NOTIFICATION_FROM = "OMS Website <noreply@oms.com.qa>";
const OMS_BURGUNDY = "#891746";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function displayOrFallback(value: string | null) {
  return value?.trim() ? value.trim() : "Not provided";
}

function formatSubmittedAt(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Qatar",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function subjectName(fullName: string) {
  return fullName.replace(/[\r\n]+/g, " ").trim().slice(0, 80);
}

function buildText(payload: ContactEnquiryPayload, submittedAt: string) {
  const inquiryLabel = CONTACT_INQUIRY_TYPE_LABELS_EN[payload.inquiryType];

  return [
    "NEW WEBSITE ENQUIRY",
    "",
    `Name: ${payload.fullName}`,
    `Company: ${displayOrFallback(payload.companyName)}`,
    `Email: ${payload.email}`,
    `Phone: ${displayOrFallback(payload.phone)}`,
    `Inquiry Type: ${inquiryLabel}`,
    "",
    "Message:",
    payload.message,
    "",
    `Submitted: ${submittedAt} (Asia/Qatar)`,
  ].join("\n");
}

function buildHtml(payload: ContactEnquiryPayload, submittedAt: string) {
  const inquiryLabel = CONTACT_INQUIRY_TYPE_LABELS_EN[payload.inquiryType];
  const rows: Array<[string, string]> = [
    ["Name", payload.fullName],
    ["Company", displayOrFallback(payload.companyName)],
    ["Email", payload.email],
    ["Phone", displayOrFallback(payload.phone)],
    ["Inquiry Type", inquiryLabel],
    ["Submitted", `${submittedAt} (Asia/Qatar)`],
  ];

  const detailRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 0;color:#5d6772;font-size:13px;width:140px;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:8px 0;color:#0b1726;font-size:15px;vertical-align:top;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border:1px solid #e6e9ed;">
            <tr>
              <td style="padding:18px 24px;background:${OMS_BURGUNDY};color:#ffffff;font-size:13px;letter-spacing:0.12em;font-weight:700;">
                ORYXI MAINTENANCE SERVICES
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <p style="margin:0 0 6px;color:${OMS_BURGUNDY};font-size:12px;letter-spacing:0.14em;font-weight:700;">
                  NEW WEBSITE ENQUIRY
                </p>
                <h1 style="margin:0 0 20px;color:#0b1726;font-size:22px;font-weight:700;">
                  A visitor submitted the Contact form
                </h1>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${detailRows}
                </table>
                <p style="margin:20px 0 8px;color:#5d6772;font-size:13px;">Message</p>
                <p style="margin:0;padding:14px 16px;background:#f7f8fa;border:1px solid #edf0f3;color:#0b1726;font-size:15px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(payload.message)}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendEnquiryNotificationEmail(
  payload: ContactEnquiryPayload,
): Promise<{ sent: boolean }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.error(
      "OMS contact enquiry email skipped: RESEND_API_KEY is not configured",
    );
    return { sent: false };
  }

  const submittedAt = formatSubmittedAt(new Date());
  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: NOTIFICATION_FROM,
      to: NOTIFICATION_TO,
      replyTo: payload.email,
      subject: `New Website Enquiry — ${subjectName(payload.fullName)}`,
      text: buildText(payload, submittedAt),
      html: buildHtml(payload, submittedAt),
    });

    if (error) {
      console.error(
        `OMS contact enquiry email failed | name=${error.name ?? "unknown"}`,
      );
      return { sent: false };
    }

    return { sent: true };
  } catch {
    console.error("OMS contact enquiry email failed");
    return { sent: false };
  }
}
