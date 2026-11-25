import type { EmailOtpType } from "@supabase/supabase-js";

/**
 * OTP types the confirmation endpoint accepts. The value arrives in the e-mail
 * link, so it is allow-listed instead of forwarded to GoTrue as-is.
 */
const OTP_TYPES: readonly EmailOtpType[] = [
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
];

/**
 * The "Confirm signup" template always produces a signup token, so a link
 * without `type` is treated as one instead of failing the whole exchange.
 */
export function readOtpType(value: string | null): EmailOtpType | null {
  if (!value) return "signup";
  return OTP_TYPES.includes(value as EmailOtpType)
    ? (value as EmailOtpType)
    : null;
}

/**
 * Where a confirmed account lands. `next` comes from the e-mail link, which is
 * untrusted input: only a same-site absolute path is allowed, never an
 * absolute or protocol-relative URL. Without this, a crafted link could bounce
 * a freshly authenticated session to another origin.
 */
export function safeNextPath(value: string | null | undefined): string {
  if (!value) return "/";
  if (!value.startsWith("/")) return "/";
  // "//evil.example" and "/\evil.example" are both protocol-relative.
  if (value.startsWith("//")) return "/";
  if (value.includes("\\")) return "/";
  // Control characters can smuggle a second line into a Location header.
  if (/[\u0000-\u001f\u007f]/.test(value)) return "/";

  return value;
}
