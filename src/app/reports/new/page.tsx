import { ReportStatus } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { ReportForm } from "./report-form";

type NewReportPageProps = {
  searchParams: Promise<{
    draftId?: string | string[];
  }>;
};

function dateInputValue(value: Date) {
  return value.toISOString().slice(0, 10);
}

export default async function NewReportPage({ searchParams }: NewReportPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?callbackUrl=/reports/new");
  }

  const draftIdParam = (await searchParams).draftId;
  const draftId = Number(Array.isArray(draftIdParam) ? draftIdParam[0] : draftIdParam);
  const draftReport =
    Number.isInteger(draftId) && draftId > 0
      ? await prisma.tripReport.findFirst({
          where: {
            id: draftId,
            status: ReportStatus.DRAFT,
            userId: user.id,
          },
          select: {
            id: true,
            title: true,
            requesterPosition: true,
            companions: true,
            purposeType: true,
            purposeOther: true,
            objective: true,
            location: true,
            province: true,
            startDate: true,
            endDate: true,
            allowanceDays: true,
            allowanceAmount: true,
            accommodationDays: true,
            accommodationAmount: true,
            transportMode: true,
            vehicleRegistration: true,
            driverName: true,
            distanceKm: true,
            transportAmount: true,
            driverCompensationAmount: true,
            registrationFeeAmount: true,
            otherExpenseDetail: true,
            otherExpenseAmount: true,
            totalBudgetText: true,
            budgetSource: true,
            budgetCategory: true,
            budgetProjectName: true,
          },
        })
      : null;

  const draft = draftReport
    ? {
        ...draftReport,
        startDate: dateInputValue(draftReport.startDate),
        endDate: dateInputValue(draftReport.endDate),
        allowanceAmount: draftReport.allowanceAmount?.toString() ?? "",
        accommodationAmount: draftReport.accommodationAmount?.toString() ?? "",
        distanceKm: draftReport.distanceKm?.toString() ?? "",
        transportAmount: draftReport.transportAmount?.toString() ?? "",
        driverCompensationAmount:
          draftReport.driverCompensationAmount?.toString() ?? "",
        registrationFeeAmount: draftReport.registrationFeeAmount?.toString() ?? "",
        otherExpenseAmount: draftReport.otherExpenseAmount?.toString() ?? "",
      }
    : null;

  return (
    <main className="min-h-screen bg-zinc-50/50 pb-12 text-zinc-900 selection:bg-brand-gold selection:text-brand-dark">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-brand-dark/[0.03] to-transparent" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:py-10">
        <header className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-md shadow-zinc-200/40">
          <Link
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-zinc-250 bg-white px-3.5 text-xs font-bold text-zinc-700 shadow-sm transition hover:border-brand-dark hover:bg-zinc-50 active:scale-[0.98]"
            href="/dashboard"
          >
            กลับไปแดชบอร์ด
          </Link>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
            {draft ? "แก้ไขฉบับร่างขออนุมัติเดินทางไปราชการ" : "แบบฟอร์มขออนุมัติเดินทางไปราชการ"}
          </h1>
          <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-zinc-500">
            กรอกข้อมูลตามแบบฟอร์มกระดาษเดิม ระบบจะคำนวณยอดรวมจากรายการค่าใช้จ่ายและบันทึกเข้ากระบวนการอนุมัติ
          </p>
        </header>

        <ReportForm draft={draft} userName={user.name ?? user.username} />
      </div>
    </main>
  );
}
