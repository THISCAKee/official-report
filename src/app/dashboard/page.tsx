import Link from "next/link";
import { redirect } from "next/navigation";

import { SignOutButton } from "@/components/sign-out-button";
import { getCurrentUser } from "@/lib/auth";

const roleLabels = {
  ADMIN: "ผู้ดูแลระบบ",
  STAFF: "บุคลากร",
  HEAD: "หัวหน้ากลุ่มงาน",
  EXECUTIVE: "ผู้บริหาร",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:py-8">
        <header className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm border-t-4 border-t-brand-gold">
          <div className="flex flex-col gap-5 border-b border-zinc-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="inline-flex items-center rounded-full bg-brand-dark px-2.5 py-0.5 text-xs font-bold text-brand-gold">
                ระบบรายงานไปราชการ
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-brand-dark">แดชบอร์ด</h1>
              <p className="mt-1 text-sm text-zinc-500">
                {user.name} · <span className="font-semibold text-zinc-700">{roleLabels[user.role]}</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.role === "ADMIN" ? (
                <Link
                  className="flex h-10 items-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-semibold text-brand-dark transition hover:border-brand-dark hover:bg-zinc-50"
                  href="/admin/users"
                >
                  จัดการผู้ใช้
                </Link>
              ) : null}
              <SignOutButton />
            </div>
          </div>
          <div className="grid gap-4 px-5 py-5 sm:grid-cols-3 sm:px-6 bg-zinc-50/30">
            <div className="rounded-lg border border-zinc-200/60 bg-white p-3 shadow-xs">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">สถานะบัญชี</p>
              <p className="mt-1 text-base font-bold text-brand-dark flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                พร้อมใช้งาน
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200/60 bg-white p-3 shadow-xs">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">บทบาท</p>
              <p className="mt-1 text-base font-bold text-brand-dark">{roleLabels[user.role]}</p>
            </div>
            <div className="rounded-lg border border-zinc-200/60 bg-white p-3 shadow-xs">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">ระบบอนุมัติ</p>
              <p className="mt-1 text-base font-bold text-brand-dark">2 ระดับ</p>
            </div>
          </div>
        </header>

        <section className="grid gap-5 md:grid-cols-3">
          <div className="group rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-brand-gold">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-dark text-sm font-bold text-brand-gold group-hover:scale-110 transition-transform">
              01
            </div>
            <h2 className="text-base font-bold text-brand-dark">รายงานของฉัน</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              ขั้นถัดไปจะเพิ่มแบบฟอร์มสร้างรายงานไปราชการและรายการรายงาน
            </p>
          </div>
          <div className="group rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-brand-gold">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-gold/20 text-sm font-bold text-brand-gold-dark group-hover:scale-110 transition-transform">
              02
            </div>
            <h2 className="text-base font-bold text-brand-dark">การอนุมัติ</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              หัวหน้ากลุ่มงานและผู้บริหารจะเห็นคิวอนุมัติตามบทบาทหน้าที่
            </p>
          </div>
          <div className="group rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-brand-gold">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-sm font-bold text-zinc-800 group-hover:scale-110 transition-transform">
              03
            </div>
            <h2 className="text-base font-bold text-brand-dark">สถานะระบบ</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              เข้าสู่ระบบด้วยชื่อผู้ใช้งานและบทบาทผู้ใช้แบบ Role-based พร้อมทำงานแล้ว
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
