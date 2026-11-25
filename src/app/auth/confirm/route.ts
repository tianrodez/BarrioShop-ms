import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { readOtpType, safeNextPath } from "@/lib/auth-confirm";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * HU01 CA1/CA2: the link in the confirmation e-mail lands here.
 *
 * The token hash is exchanged for a session on the server, which is what makes
 * the link work from any device: the browser that opened the e-mail never had
 * the PKCE verifier, so a client-side exchange would fail. Session cookies are
 * written by `@supabase/ssr` through the route handler.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = readOtpType(searchParams.get("type"));
  const next = safeNextPath(searchParams.get("next"));

  if (tokenHash && type) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    // `redirect` throws, so a failed exchange falls through to the error page.
    if (!error) redirect(next);
  }

  redirect("/auth/auth-code-error");
}
