import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 text-zinc-900 flex items-center justify-center">
      <section className="mx-auto grid min-h-[580px] w-full max-w-5xl overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative flex flex-col justify-between bg-brand-dark p-8 text-white sm:p-10 overflow-hidden">
          {/* Subtle gold decorative gradient/glow in background */}
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-brand-gold/10 blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="mb-10 inline-flex h-11 items-center rounded-md border border-brand-gold/30 bg-brand-gold/10 px-4 text-sm font-semibold text-brand-gold">
              Official Report
            </div>
            <h1 className="max-w-md text-3xl font-bold leading-snug sm:text-4xl">
              ระบบรายงานการเดินทาง<br />ไปราชการของหน่วยงาน
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-300">
              ติดตามรายงาน ส่งอนุมัติ และจัดการสิทธิ์ผู้ใช้งานตามบทบาทในระบบเดียวได้อย่างรวดเร็วและเป็นระบบ
            </p>
          </div>
          <div className="relative z-10 mt-12 grid gap-3 text-sm text-zinc-300 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 hover:border-brand-gold/40 transition-colors">
              <span className="block font-semibold text-brand-gold mb-1">บุคลากร</span>
              สร้างและส่งรายงานไปราชการสะดวก
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 hover:border-brand-gold/40 transition-colors">
              <span className="block font-semibold text-brand-gold mb-1">หัวหน้ากลุ่มงาน</span>
              ตรวจสอบและอนุมัติผ่านระบบ
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 hover:border-brand-gold/40 transition-colors">
              <span className="block font-semibold text-brand-gold mb-1">ผู้บริหาร</span>
              ดูข้อมูลสรุปและสถานะภาพรวม
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-10 bg-zinc-50/50">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-gold-dark bg-brand-gold/10 px-2.5 py-1 rounded-full inline-block">
                Authentication
              </p>
              <h2 className="mt-4 text-2xl font-bold text-brand-dark">เข้าสู่ระบบเพื่อใช้งาน</h2>
              <p className="mt-2 text-sm text-zinc-600">
                เข้าใช้งานด้วยบัญชีผู้ใช้และรหัสผ่านของคุณ
              </p>
            </div>
            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}
