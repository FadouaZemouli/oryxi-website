"use server";

import { createClient } from "@/lib/supabase/server";
import { parseContactEnquiryInput } from "@/lib/contact/validate";
import { sendEnquiryNotificationEmail } from "@/lib/email/enquiry-notification";

export type SubmitContactEnquiryInput = {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  inquiryType: string;
  message: string;
  companyWebsite?: string;
};

export type SubmitContactEnquiryResult = {
  ok: boolean;
};

export async function submitContactEnquiryAction(
  input: SubmitContactEnquiryInput,
): Promise<SubmitContactEnquiryResult> {
  const parsed = parseContactEnquiryInput(input);

  if ("honeypot" in parsed) {
    return { ok: true };
  }

  if (!parsed.ok) {
    return { ok: false };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_enquiries").insert({
    full_name: parsed.payload.fullName,
    company_name: parsed.payload.companyName,
    email: parsed.payload.email,
    phone: parsed.payload.phone,
    inquiry_type: parsed.payload.inquiryType,
    message: parsed.payload.message,
  });

  if (error) {
    console.error(
      `OMS contact enquiry insert failed | code=${error.code ?? "unknown"}`,
    );
    return { ok: false };
  }

  await sendEnquiryNotificationEmail(parsed.payload);
  return { ok: true };
}
