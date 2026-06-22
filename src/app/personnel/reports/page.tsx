import type { Prisma } from "@prisma/client";
import { ReportStatus, Role } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { PrintButton } from "./print-button";

import { DeleteButton } from "./delete-button";

const statusLabels = {
  DRAFT: "แบบร่าง",
  SUBMITTED: "ส่งเข้าระบบแล้ว",
  HEAD_APPROVED: "หัวหน้าอนุมัติแล้ว",
  HEAD_REJECTED: "หัวหน้าส่งกลับแก้ไข",
  EXECUTIVE_APPROVED: "ผู้บริหารอนุมัติแล้ว",
  EXECUTIVE_REJECTED: "ผู้บริหารส่งกลับแก้ไข",
};

const statusColors = {
  DRAFT: "bg-zinc-50 text-zinc-600 border-zinc-200",
  SUBMITTED: "bg-amber-50 text-amber-700 border-amber-200",
  HEAD_APPROVED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  HEAD_REJECTED: "bg-red-50 text-red-700 border-red-200",
  EXECUTIVE_APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  EXECUTIVE_REJECTED: "bg-red-50 text-red-700 border-red-200",
};

const printableStatuses = [
  ReportStatus.SUBMITTED,
  ReportStatus.HEAD_APPROVED,
  ReportStatus.HEAD_REJECTED,
  ReportStatus.EXECUTIVE_APPROVED,
  ReportStatus.EXECUTIVE_REJECTED,
];

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
  }).format(value);
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

type MemoReport = Prisma.TripReportGetPayload<{
  include: {
    department: { select: { name: true } };
    reviewedBy: { select: { name: true } };
    user: { select: { name: true; username: true } };
  };
}>;

function formatAmount(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return "";
  }

  return numberValue.toLocaleString("th-TH", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

function formatNumber(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return "";
  }

  return numberValue.toLocaleString("th-TH", {
    maximumFractionDigits: 2,
  });
}

function toNumber(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : 0;
}

function lineText(value: ReactNode, className = "") {
  return <span className={`memo-line ${className}`}>{value || "\u00a0"}</span>;
}

function checkLabel(checked: boolean, label: string) {
  return (
    <span className="memo-check">
      ({checked ? "✓" : " "}) {label}
    </span>
  );
}

function budgetSourceIncludes(report: MemoReport, keyword: string) {
  return report.budgetSource?.includes(keyword) ?? false;
}

function MemoDocument({ report }: { report: MemoReport }) {
  const calculatedExpenseTotal =
    toNumber(report.allowanceAmount) +
    toNumber(report.accommodationAmount) +
    toNumber(report.transportAmount) +
    toNumber(report.driverCompensationAmount) +
    toNumber(report.registrationFeeAmount) +
    toNumber(report.otherExpenseAmount);
  const totalBudget = report.budget ?? (calculatedExpenseTotal > 0 ? calculatedExpenseTotal : null);
  const totalBudgetDisplay = formatAmount(totalBudget);
  const requester = report.user.name;
  const documentDate = formatDate(report.requestDate);

  return (
    <article className="memo-document">
      <section className="memo-page">
        <div className="memo-header">
          <Image className="garuda-mark" src="/logo_kurd.jpg" alt="ตราครุฑ" width={648} height={720} priority />
          <h2>บันทึกข้อความ</h2>
        </div>

        <div className="memo-topline">
          <span>
            <strong>ส่วนราชการ</strong> มหาวิทยาลัยมหาสารคาม สำนักวิทยบริการ โทร
            {lineText("", "memo-line-short")}
          </span>
        </div>
        <div className="memo-row">
          <span>
            <strong>ที่</strong> อว 0605.9/
            {lineText("", "memo-line-short")}
          </span>
          <span>
            <strong>วันที่</strong> {lineText(documentDate, "memo-line-date")}
          </span>
        </div>
        <p>
          <strong>เรื่อง</strong> ขออนุมัติเดินทางไปราชการ
        </p>
        <div className="memo-divider" />

        <p>
          <strong>เรียน</strong> ผู้อำนวยการสำนักวิทยบริการ
        </p>

        <p className="memo-indent">
          ด้วยข้าพเจ้า{lineText(requester, "memo-line-name")} ตำแหน่ง
          {lineText(report.requesterPosition, "memo-line-name")}
        </p>
        <p>{lineText(report.companions ? `พร้อมด้วย ${report.companions}` : "พร้อมด้วย", "memo-line-full")}</p>
        <p>
          {lineText("", "memo-line-small")} ประสงค์ขออนุมัติเดินทางไปราชการเพื่อ{" "}
          {checkLabel(report.purposeType === "MEETING", "ประชุม")}{" "}
          {checkLabel(report.purposeType === "TRAINING_SEMINAR", "อบรม/สัมมนา")}{" "}
          {checkLabel(report.purposeType === "STUDY_VISIT", "ดูงาน")}{" "}
          {checkLabel(report.purposeType === "OTHER", "อื่น ๆ")}
        </p>
        <p>
          เรื่อง{lineText(report.purposeType === "OTHER" ? report.purposeOther || report.title : report.title, "memo-line-long")}
        </p>
        <p>
          {lineText("", "memo-line-small")} ณ {lineText(report.location, "memo-line-place")} จังหวัด
          {lineText(report.province, "memo-line-province")} ดังเอกสารแนบ
        </p>
        <p>
          โดยเดินทางตั้งแต่วันที่{lineText(formatDate(report.startDate), "memo-line-date")} ถึง
          {lineText(formatDate(report.endDate), "memo-line-date")} พร้อมประมาณการ
        </p>
        <p>ค่าใช้จ่ายในการเดินทางไปราชการ ดังนี้</p>

        <ol className="memo-expenses">
          <li>
            ค่าเบี้ยเลี้ยง วันที่{lineText(report.allowanceDays ? `${report.allowanceDays} วัน` : "", "memo-line-expense")} เป็นเงิน
            {lineText(formatAmount(report.allowanceAmount), "memo-line-money")}บาท
          </li>
          <li>
            ค่าเช่าที่พัก วันที่{lineText(report.accommodationDays ? `${report.accommodationDays} วัน` : "", "memo-line-expense")} เป็นเงิน
            {lineText(formatAmount(report.accommodationAmount), "memo-line-money")}บาท
          </li>
          <li>
            ค่าพาหนะ {checkLabel(report.transportMode === "AIRPLANE", "เครื่องบิน")}{" "}
            {checkLabel(report.transportMode === "TRAIN", "รถไฟ")}{" "}
            {checkLabel(report.transportMode === "BUS", "รถประจำทาง")}{" "}
            {checkLabel(report.transportMode === "PRIVATE_CAR", "รถส่วนบุคคล")}{" "}
            {checkLabel(report.transportMode === "GOVERNMENT_CAR", "รถยนต์ของทางราชการ")}
            <br />
            หมายเลขทะเบียน{lineText(report.vehicleRegistration, "memo-line-car")} โดยมี
            {lineText(report.driverName, "memo-line-driver")}เป็นพนักงานขับรถยนต์
            <br />
            ระยะทางโดยประมาณ{lineText(formatNumber(report.distanceKm), "memo-line-distance")}กิโลเมตร เป็นเงิน
            {lineText(formatAmount(report.transportAmount), "memo-line-money")}บาท
          </li>
          <li>
            ค่าตอบแทนพนักงานขับรถ วันที่{lineText("", "memo-line-expense")} เป็นเงิน
            {lineText(formatAmount(report.driverCompensationAmount), "memo-line-money")}บาท
          </li>
          <li>
            ค่าลงทะเบียน {lineText("", "memo-line-expense")} เป็นเงิน
            {lineText(formatAmount(report.registrationFeeAmount), "memo-line-money")}บาท
          </li>
          <li>
            ค่าใช้จ่ายอื่นๆ ที่จำเป็นในการเดินทางไปราชการ
            {lineText(report.otherExpenseDetail, "memo-line-other")} เป็นเงิน
            {lineText(formatAmount(report.otherExpenseAmount), "memo-line-money")}บาท
          </li>
        </ol>

        <p className="memo-total">
          รวมค่าใช้จ่ายเป็นเงินประมาณ {lineText(totalBudgetDisplay, "memo-line-total")}บาท
        </p>
        <p className="memo-total-text">({lineText(report.totalBudgetText, "memo-line-total-text")}) -ตัวอักษร-</p>
        <p>{checkLabel(totalBudget === null, "โดยไม่ขอเบิกค่าใช้จ่ายในการเดินทางไปราชการจากมหาวิทยาลัย")}</p>
        <p>จึงเรียนมาเพื่อโปรดพิจารณา</p>

        <div className="memo-signature">
          <p>ลงชื่อ{lineText("", "memo-line-sign")}ผู้ขอ</p>
          <p>({lineText(requester, "memo-line-sign-name")})</p>
        </div>

        <div className="memo-comment-block memo-comment-first">
          <p>ความคิดเห็นของหัวหน้ากลุ่มงาน{lineText("", "memo-line-comment")}</p>
          <div className="memo-signature memo-signature-lower">
            <p>ลงชื่อ{lineText("", "memo-line-sign")}</p>
            <p>({lineText("", "memo-line-sign-name")})</p>
          </div>
        </div>
      </section>

      <section className="memo-page memo-page-second">
        <p className="memo-page-number">- 2 -</p>

        <div className="memo-second-section">
          <p>ความคิดเห็นของการเงิน</p>
          <p>
            เห็นควรเบิกจ่ายจาก {checkLabel(budgetSourceIncludes(report, "แผ่นดิน"), "เงินงบประมาณแผ่นดิน")}{" "}
            {checkLabel(budgetSourceIncludes(report, "รายได้"), "เงินงบประมาณเงินรายได้")}{" "}
            {checkLabel(budgetSourceIncludes(report, "รับฝาก"), "เงินรับฝาก")}
          </p>
          <p>
            หมวดเงิน{lineText(report.budgetCategory, "memo-line-budget")} รายการ
            {lineText(report.budgetProjectName, "memo-line-budget-wide")}
          </p>
          <p>
            รหัสงบประมาณ{lineText("", "memo-line-budget")} จำนวนเงิน
            {lineText(totalBudgetDisplay, "memo-line-budget-wide")}
          </p>
          <div className="memo-signature">
            <p>ลงชื่อ{lineText("", "memo-line-sign")}</p>
            <p>({lineText("", "memo-line-sign-name")})</p>
          </div>
        </div>

        <div className="memo-second-section">
          <p>ความคิดเห็นของหัวหน้าสำนักงานเลขานุการฯ {lineText("", "memo-line-comment-wide")}</p>
          <p>{lineText("", "memo-line-comment-mid")}</p>
          <div className="memo-signature">
            <p>ลงชื่อ{lineText("", "memo-line-sign")}</p>
            <p>({lineText("", "memo-line-sign-name")})</p>
          </div>
        </div>

        <div className="memo-second-section">
          <p>ความคิดเห็นของผู้บังคับบัญชา</p>
          <p>
            {checkLabel(report.status === "EXECUTIVE_APPROVED", "อนุมัติ")}{" "}
            {checkLabel(report.status === "EXECUTIVE_REJECTED", "ไม่อนุมัติ")} เนื่องจาก
            {lineText("", "memo-line-reason")}
          </p>
          <div className="memo-signature">
            <p>ลงชื่อ{lineText("", "memo-line-sign")}</p>
            <p>({lineText("", "memo-line-sign-name")})</p>
          </div>
        </div>
      </section>
    </article>
  );
}

export default async function PersonnelReportsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?callbackUrl=/personnel/reports");
  }

  if (user.role !== Role.ADMIN && user.role !== Role.PERSONNEL) {
    redirect("/dashboard");
  }

  const reports = await prisma.tripReport.findMany({
    where: {
      status: {
        in: printableStatuses,
      },
    },
    orderBy: { createdAt: "desc" },
    include: {
      department: {
        select: { name: true },
      },
      reviewedBy: {
        select: { name: true },
      },
      user: {
        select: {
          name: true,
          username: true,
        },
      },
    },
  });

  return (
    <main className="min-h-screen bg-zinc-50/50 pb-12 text-zinc-900 selection:bg-brand-gold selection:text-brand-dark">
      <div className="no-print absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-emerald-600/[0.03] to-transparent pointer-events-none" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:py-10">
        <header className="no-print overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-md shadow-zinc-200/40">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Link
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-zinc-250 bg-white px-3.5 text-xs font-bold text-zinc-700 shadow-sm transition hover:border-brand-dark hover:bg-zinc-50 active:scale-[0.98]"
                href="/dashboard"
              >
                <svg className="h-3.5 w-3.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                กลับไปแดชบอร์ด
              </Link>
              <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
                รายงานไปราชการสำหรับงานบุคคล
              </h1>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-zinc-500">
                ดูข้อมูลรายงานที่ส่งเข้ามาแล้ว และพิมพ์เอกสารภาพรวมสำหรับจัดเก็บหรือดำเนินงานต่อ
              </p>
            </div>

          </div>
        </header>

        <section className="print-area rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm print:border-0 print:bg-white print:p-0 print:shadow-none">
          <div className="no-print mb-6 flex flex-col gap-2 border-b border-zinc-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Personnel Report</p>
              <h2 className="mt-1 text-xl font-extrabold text-zinc-950">แบบพิมพ์บันทึกข้อความขออนุมัติเดินทางไปราชการ</h2>
              <p className="mt-1 text-xs text-zinc-500">พิมพ์เมื่อ {formatDateTime(new Date())}</p>
            </div>
            <span className="inline-flex w-fit rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-600">
              {reports.length} รายการ
            </span>
          </div>

          {reports.length > 0 ? (
            <div className="grid gap-8">
              {reports.map((report) => (
                <div className="report-print-set" id={`report-print-${report.id}`} key={report.id}>
                  <div className="no-print mb-4 flex flex-col gap-3 rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-extrabold text-zinc-950">{report.title}</h3>
                      <p className="mt-1 text-sm text-zinc-600">
                        ผู้เดินทาง: <span className="font-bold text-zinc-900">{report.user.name}</span>
                        <span className="text-zinc-400"> ({report.user.username})</span>
                      </p>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2">
                      <span className={`inline-flex w-fit rounded-lg border px-2.5 py-1 text-xs font-bold ${statusColors[report.status]}`}>
                        {statusLabels[report.status]}
                      </span>
                      <div className="flex flex-wrap gap-2 sm:justify-end">
                        <PrintButton targetId={`report-print-${report.id}`}>พิมพ์รายการนี้</PrintButton>
                        <DeleteButton reportId={report.id} reportTitle={report.title} />
                      </div>
                    </div>
                  </div>

                  <MemoDocument report={report} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-250 bg-zinc-50/60 px-4 text-center">
              <h3 className="text-base font-bold text-zinc-800">ยังไม่มีรายงานที่ส่งเข้ามา</h3>
              <p className="mt-1.5 max-w-sm text-sm leading-6 text-zinc-500">
                เมื่อมีรายงานสถานะส่งเข้าระบบหรือผ่านกระบวนการอนุมัติแล้ว ข้อมูลจะแสดงในหน้านี้
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
