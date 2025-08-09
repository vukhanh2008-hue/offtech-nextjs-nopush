// app/api/tickets/create/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const dynamic = "force-dynamic"; // tránh cache

export async function POST(req: Request) {
  try {
    const { title, province, ward, mode } = (await req.json()) ?? {};

    if (!title || !String(title).trim()) {
      return NextResponse.json({ error: "TITLE_REQUIRED" }, { status: 400 });
    }

    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(n: string) { return cookieStore.get(n)?.value; },
          set(n: string, v: string, o: any) { cookieStore.set({ name: n, value: v, ...o }); },
          remove(n: string, o: any) { cookieStore.set({ name: n, value: "", ...o }); },
        },
      }
    );

    // Không gọi auth.getUser(); để RLS quyết định người có quyền hay không
    const { data, error } = await supabase
      .from("tickets")
      .insert({
        title: String(title).trim(),
        province: province ? String(province) : null,
        ward: ward ? String(ward) : null,
        mode: mode && ["Online", "Onsite"].includes(mode) ? mode : "Online",
      })
      .select("id")
      .single();

    if (error) {
      // trả về lỗi RLS/Enum/Constraint rõ ràng để UI báo chi tiết
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "UNKNOWN" }, { status: 500 });
  }
}
