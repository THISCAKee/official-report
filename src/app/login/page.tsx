import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-zinc-100 flex items-center justify-center p-4 sm:p-6 md:p-8 selection:bg-brand-gold selection:text-brand-dark">
      {/* Decorative background glow elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-dark/5 rounded-full blur-3xl pointer-events-none" />

      <section className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-2xl lg:grid lg:grid-cols-[1.1fr_0.9fr] animate-fade-in-up">
        {/* Left Side: Brand Panel */}
        <div className="relative flex flex-col justify-between bg-brand-dark p-8 text-white sm:p-12 overflow-hidden min-h-[400px] lg:min-h-[600px]">
          {/* Subtle gold decorative gradient/glow overlay */}
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-brand-gold/15 blur-3xl pointer-events-none animate-pulse-slow" />
          <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-zinc-800/80 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col h-full justify-between gap-12">
            {/* Header / Brand */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3.5 py-1.5 text-sm font-semibold tracking-wide text-brand-gold backdrop-blur-sm">
                <svg className="w-4 h-4 fill-none stroke-brand-gold stroke-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Official Report
              </div>
              <h1 className="mt-8 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                ระบบรายงานการเดินทาง<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-amber-400 to-brand-gold">ไปราชการของหน่วยงาน</span>
              </h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-300 font-light">
                ส่งรายงาน ติดตามผล และจัดการกระบวนการอนุมัติเดินทางไปราชการของบุคลากรได้อย่างสะดวกรวดเร็วในระบบเดียว
              </p>
            </div>

            {/* Role features list */}
            <div className="grid gap-3 text-sm text-zinc-300">
              <div className="flex gap-4 rounded-xl border border-white/5 bg-white/5 p-4 hover:border-brand-gold/30 transition duration-300 hover:bg-white/10 group">
                <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-dark transition-all duration-300">
                  <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <span className="block font-bold text-brand-gold text-sm tracking-wide">บุคลากรทั่วไป (Staff)</span>
                  <span className="text-xs text-zinc-400 font-light">เขียนรายงานข้อมูลการเดินทางไปราชการพร้อมแนบไฟล์อ้างอิง</span>
                </div>
              </div>

              <div className="flex gap-4 rounded-xl border border-white/5 bg-white/5 p-4 hover:border-brand-gold/30 transition duration-300 hover:bg-white/10 group">
                <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-dark transition-all duration-300">
                  <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <span className="block font-bold text-brand-gold text-sm tracking-wide">หัวหน้ากลุ่มงาน (Head)</span>
                  <span className="text-xs text-zinc-400 font-light">ตรวจสอบ รายละเอียด และทำการพิจารณาอนุมัติขั้นต้น</span>
                </div>
              </div>

              <div className="flex gap-4 rounded-xl border border-white/5 bg-white/5 p-4 hover:border-brand-gold/30 transition duration-300 hover:bg-white/10 group">
                <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-dark transition-all duration-300">
                  <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <span className="block font-bold text-brand-gold text-sm tracking-wide">ผู้บริหาร (Executive)</span>
                  <span className="text-xs text-zinc-400 font-light">อนุมัติรายงานในขั้นสุดท้ายพร้อมดูภาพรวมสถิติ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-zinc-50/30">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-gold-dark bg-brand-gold/15 px-3 py-1 rounded-full inline-block border border-brand-gold/20">
                SYSTEM PORTAL
              </span>
              <h2 className="mt-4 text-3xl font-extrabold text-brand-dark tracking-tight">เข้าสู่ระบบ</h2>
              <p className="mt-2.5 text-sm text-zinc-500 font-light leading-relaxed">
                กรอกบัญชีผู้ใช้งานของคุณเพื่อเข้าสู่ระบบงานราชการ
              </p>
            </div>
            
            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}

