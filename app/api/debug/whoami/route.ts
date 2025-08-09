import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export const dynamic = "force-dynamic";

export async function GET() {
  const jar = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (n: string) => jar.get(n)?.value,
        set: (n: string, v: string, o: any) => jar.set({ name: n, value: v, ...o }),
        remove: (n: string, o: any) => jar.set({ name: n, value: "", ...o }),
      },
    }
  );

  const { data, error } = await supabase.auth.getUser();
  return NextResponse.json({
    ok: !error && !!data.user,
    user: data.user ? { id: data.user.id, email: data.user.email } : null,
    error: error?.message ?? null,
  }, { headers: { "Cache-Control": "no-store" }});
}
