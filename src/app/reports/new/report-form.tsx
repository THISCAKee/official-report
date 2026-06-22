"use client";

import { useActionState, useMemo, useState } from "react";

import { createTripReport } from "./actions";

const purposeOptions = [
  ["MEETING", "ประชุม"],
  ["TRAINING_SEMINAR", "อบรม/สัมมนา"],
  ["STUDY_VISIT", "ดูงาน"],
  ["OTHER", "อื่น ๆ"],
] as const;

const transportOptions = [
  ["AIRPLANE", "เครื่องบิน"],
  ["TRAIN", "รถไฟ"],
  ["BUS", "รถประจำทาง"],
  ["PRIVATE_CAR", "รถส่วนบุคคล"],
  ["GOVERNMENT_CAR", "รถยนต์ของทางราชการ"],
  ["OTHER", "อื่น ๆ"],
] as const;

function Field({
  children,
  className = "",
  label,
}: {
  children: React.ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-700">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "focus-ring-gold h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400";

const textareaClass =
  "focus-ring-gold min-h-24 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm leading-6 text-zinc-950 outline-none transition placeholder:text-zinc-400";

const expenseFieldNames = [
  "allowanceAmount",
  "accommodationAmount",
  "transportAmount",
  "driverCompensationAmount",
  "registrationFeeAmount",
  "otherExpenseAmount",
] as const;

type ExpenseFieldName = (typeof expenseFieldNames)[number];

const initialExpenses: Record<ExpenseFieldName, string> = {
  allowanceAmount: "",
  accommodationAmount: "",
  transportAmount: "",
  driverCompensationAmount: "",
  registrationFeeAmount: "",
  otherExpenseAmount: "",
};

type DraftReport = {
  id: number;
  title: string;
  requesterPosition: string | null;
  companions: string | null;
  purposeType: string;
  purposeOther: string | null;
  objective: string;
  location: string;
  province: string | null;
  startDate: string;
  endDate: string;
  allowanceDays: number | null;
  allowanceAmount: string;
  accommodationDays: number | null;
  accommodationAmount: string;
  transportMode: string | null;
  vehicleRegistration: string | null;
  driverName: string | null;
  distanceKm: string;
  transportAmount: string;
  driverCompensationAmount: string;
  registrationFeeAmount: string;
  otherExpenseDetail: string | null;
  otherExpenseAmount: string;
  totalBudgetText: string | null;
  budgetSource: string | null;
  budgetCategory: string | null;
  budgetProjectName: string | null;
};

function amountValue(value: string) {
  const amount = Number(value);

  return Number.isFinite(amount) ? amount : 0;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("th-TH", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
}

export function ReportForm({
  draft,
  userName,
}: {
  draft: DraftReport | null;
  userName: string;
}) {
  const [state, action, pending] = useActionState(createTripReport, {});
  const [expenses, setExpenses] =
    useState<Record<ExpenseFieldName, string>>({
      allowanceAmount: draft?.allowanceAmount ?? initialExpenses.allowanceAmount,
      accommodationAmount:
        draft?.accommodationAmount ?? initialExpenses.accommodationAmount,
      transportAmount: draft?.transportAmount ?? initialExpenses.transportAmount,
      driverCompensationAmount:
        draft?.driverCompensationAmount ??
        initialExpenses.driverCompensationAmount,
      registrationFeeAmount:
        draft?.registrationFeeAmount ?? initialExpenses.registrationFeeAmount,
      otherExpenseAmount:
        draft?.otherExpenseAmount ?? initialExpenses.otherExpenseAmount,
    });

  const totalExpense = useMemo(
    () =>
      expenseFieldNames.reduce(
        (total, fieldName) => total + amountValue(expenses[fieldName]),
        0,
      ),
    [expenses],
  );

  function updateExpense(fieldName: ExpenseFieldName, value: string) {
    setExpenses((current) => ({
      ...current,
      [fieldName]: value,
    }));
  }

  return (
    <form action={action} className="space-y-6">
      {draft ? <input name="draftId" type="hidden" value={draft.id} /> : null}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-5 border-b border-zinc-100 pb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-gold-dark">
            Request Detail
          </p>
          <h2 className="mt-1 text-lg font-extrabold text-zinc-950">
            ข้อมูลคำขออนุมัติเดินทางไปราชการ
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="ชื่อผู้ขอ">
            <input className={inputClass} disabled value={userName} />
          </Field>
          <Field label="ตำแหน่ง">
            <input
              className={inputClass}
              defaultValue={draft?.requesterPosition ?? ""}
              name="requesterPosition"
              placeholder="เช่น นักวิชาการคอมพิวเตอร์"
            />
          </Field>
          <Field className="md:col-span-2" label="เรื่อง">
            <input
              className={inputClass}
              defaultValue={draft?.title ?? ""}
              name="title"
              placeholder="เช่น ขออนุมัติเดินทางไปราชการเพื่อเข้าร่วมอบรม..."
              required
            />
          </Field>
          <Field className="md:col-span-2" label="เดินทางพร้อมด้วย">
            <textarea
              className={textareaClass}
              defaultValue={draft?.companions ?? ""}
              name="companions"
              placeholder="ระบุรายชื่อผู้ร่วมเดินทาง หากไม่มีให้เว้นว่าง"
            />
          </Field>
          <Field label="วัตถุประสงค์">
            <select className={inputClass} defaultValue={draft?.purposeType ?? "MEETING"} name="purposeType">
              {purposeOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="กรณีเลือกอื่น ๆ">
            <input
              className={inputClass}
              defaultValue={draft?.purposeOther ?? ""}
              name="purposeOther"
              placeholder="ระบุวัตถุประสงค์เพิ่มเติม"
            />
          </Field>
          <Field className="md:col-span-2" label="รายละเอียดวัตถุประสงค์ / เรื่องที่เดินทาง">
            <textarea
              className={textareaClass}
              defaultValue={draft?.objective ?? ""}
              name="objective"
              placeholder="ระบุรายละเอียดกิจกรรม โครงการ หรือเหตุผลในการเดินทาง"
              required
            />
          </Field>
          <Field label="สถานที่">
            <input
              className={inputClass}
              defaultValue={draft?.location ?? ""}
              name="location"
              placeholder="ชื่อสถานที่/หน่วยงานปลายทาง"
              required
            />
          </Field>
          <Field label="จังหวัด">
            <input
              className={inputClass}
              defaultValue={draft?.province ?? ""}
              name="province"
              placeholder="จังหวัดปลายทาง"
            />
          </Field>
          <Field label="วันที่เริ่มเดินทาง">
            <input className={inputClass} defaultValue={draft?.startDate ?? ""} name="startDate" required type="date" />
          </Field>
          <Field label="วันที่สิ้นสุดการเดินทาง">
            <input className={inputClass} defaultValue={draft?.endDate ?? ""} name="endDate" required type="date" />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-5 border-b border-zinc-100 pb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-gold-dark">
            Expense Estimate
          </p>
          <h2 className="mt-1 text-lg font-extrabold text-zinc-950">
            ประมาณการค่าใช้จ่าย
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Field label="ค่าเบี้ยเลี้ยง (วัน)">
            <input
              className={inputClass}
              defaultValue={draft?.allowanceDays ?? ""}
              min="0"
              name="allowanceDays"
              type="number"
            />
          </Field>
          <Field className="md:col-span-2" label="ค่าเบี้ยเลี้ยง (บาท)">
            <input
              className={inputClass}
              min="0"
              name="allowanceAmount"
              onChange={(event) => updateExpense("allowanceAmount", event.target.value)}
              step="0.01"
              type="number"
              value={expenses.allowanceAmount}
            />
          </Field>
          <Field label="ค่าที่พัก (วัน)">
            <input
              className={inputClass}
              defaultValue={draft?.accommodationDays ?? ""}
              min="0"
              name="accommodationDays"
              type="number"
            />
          </Field>
          <Field className="md:col-span-2" label="ค่าที่พัก (บาท)">
            <input
              className={inputClass}
              min="0"
              name="accommodationAmount"
              onChange={(event) => updateExpense("accommodationAmount", event.target.value)}
              step="0.01"
              type="number"
              value={expenses.accommodationAmount}
            />
          </Field>
          <Field label="พาหนะ">
            <select className={inputClass} defaultValue={draft?.transportMode ?? ""} name="transportMode">
              <option value="">ไม่ระบุ</option>
              {transportOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="ทะเบียนรถ / เลขอ้างอิง">
            <input
              className={inputClass}
              defaultValue={draft?.vehicleRegistration ?? ""}
              name="vehicleRegistration"
              placeholder="เช่น กข 1234"
            />
          </Field>
          <Field label="พนักงานขับรถ">
            <input
              className={inputClass}
              defaultValue={draft?.driverName ?? ""}
              name="driverName"
              placeholder="ชื่อพนักงานขับรถ"
            />
          </Field>
          <Field label="ระยะทางโดยประมาณ (กม.)">
            <input
              className={inputClass}
              defaultValue={draft?.distanceKm ?? ""}
              min="0"
              name="distanceKm"
              step="0.01"
              type="number"
            />
          </Field>
          <Field label="ค่าพาหนะ (บาท)">
            <input
              className={inputClass}
              min="0"
              name="transportAmount"
              onChange={(event) => updateExpense("transportAmount", event.target.value)}
              step="0.01"
              type="number"
              value={expenses.transportAmount}
            />
          </Field>
          <Field label="ค่าตอบแทนพนักงานขับรถ (บาท)">
            <input
              className={inputClass}
              min="0"
              name="driverCompensationAmount"
              onChange={(event) =>
                updateExpense("driverCompensationAmount", event.target.value)
              }
              step="0.01"
              type="number"
              value={expenses.driverCompensationAmount}
            />
          </Field>
          <Field label="ค่าลงทะเบียน (บาท)">
            <input
              className={inputClass}
              min="0"
              name="registrationFeeAmount"
              onChange={(event) =>
                updateExpense("registrationFeeAmount", event.target.value)
              }
              step="0.01"
              type="number"
              value={expenses.registrationFeeAmount}
            />
          </Field>
          <Field className="md:col-span-2" label="ค่าใช้จ่ายอื่น ๆ ที่จำเป็น">
            <input
              className={inputClass}
              defaultValue={draft?.otherExpenseDetail ?? ""}
              name="otherExpenseDetail"
              placeholder="ระบุรายการค่าใช้จ่ายอื่น ๆ"
            />
          </Field>
          <Field label="ค่าใช้จ่ายอื่น ๆ (บาท)">
            <input
              className={inputClass}
              min="0"
              name="otherExpenseAmount"
              onChange={(event) => updateExpense("otherExpenseAmount", event.target.value)}
              step="0.01"
              type="number"
              value={expenses.otherExpenseAmount}
            />
          </Field>
          <div className="md:col-span-3 rounded-2xl border border-brand-gold/40 bg-brand-gold-light px-5 py-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-gold-dark">
                  Total Estimate
                </p>
                <h3 className="mt-1 text-sm font-bold text-zinc-800">
                  รวมค่าใช้จ่ายโดยประมาณ
                </h3>
              </div>
              <p className="text-2xl font-extrabold text-brand-dark" aria-live="polite">
                {formatCurrency(totalExpense)} บาท
              </p>
            </div>
            <p className="mt-2 text-xs leading-5 text-zinc-500">
              ระบบจะบันทึกยอดรวมนี้จากรายการค่าใช้จ่ายเมื่อกดบันทึกหรือส่งเข้าระบบ
            </p>
          </div>
          <Field className="md:col-span-3" label="รวมเป็นเงินตัวอักษร">
            <input
              className={inputClass}
              defaultValue={draft?.totalBudgetText ?? ""}
              name="totalBudgetText"
              placeholder="เช่น หนึ่งหมื่นสองพันบาทถ้วน"
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-5 border-b border-zinc-100 pb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-gold-dark">
            Budget Source
          </p>
          <h2 className="mt-1 text-lg font-extrabold text-zinc-950">แหล่งงบประมาณ</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Field label="แหล่งเงิน">
            <input
              className={inputClass}
              defaultValue={draft?.budgetSource ?? ""}
              name="budgetSource"
              placeholder="เช่น เงินงบประมาณแผ่นดิน/รายได้/รับฝาก"
            />
          </Field>
          <Field label="หมวดเงิน">
            <input
              className={inputClass}
              defaultValue={draft?.budgetCategory ?? ""}
              name="budgetCategory"
              placeholder="ระบุหมวดเงิน"
            />
          </Field>
          <Field label="ชื่อโครงการ">
            <input
              className={inputClass}
              defaultValue={draft?.budgetProjectName ?? ""}
              name="budgetProjectName"
              placeholder="ระบุชื่อโครงการ"
            />
          </Field>
        </div>
      </section>

      {state.error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-end">
        <button
          className="h-11 rounded-xl border border-zinc-250 bg-white px-5 text-sm font-bold text-zinc-700 shadow-sm transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:text-zinc-400"
          disabled={pending}
          name="intent"
          type="submit"
          value="draft"
        >
          บันทึกแบบร่าง
        </button>
        <button
          className="h-11 rounded-xl bg-brand-dark px-5 text-sm font-bold text-white shadow-md transition hover:bg-brand-dark-hover hover:text-brand-gold disabled:cursor-not-allowed disabled:bg-zinc-400 disabled:text-white"
          disabled={pending}
          name="intent"
          type="submit"
          value="submit"
        >
          ส่งเข้าระบบ
        </button>
      </div>
    </form>
  );
}
