"use client";

import { useActionState } from "react";
import { deleteTripReport } from "./actions";

interface DeleteButtonProps {
  reportId: number;
  reportTitle: string;
}

export function DeleteButton({ reportId, reportTitle }: DeleteButtonProps) {
  const [state, action, pending] = useActionState(deleteTripReport, {});

  return (
    <form
      action={action}
      className="no-print flex flex-col items-end gap-1.5"
      onSubmit={(event) => {
        if (
          !window.confirm(
            `ยืนยันการลบแบบฟอร์มรายงาน "${reportTitle}"?\nการลบนี้จะไม่สามารถกู้คืนข้อมูลได้`
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <input name="reportId" type="hidden" value={reportId} />
      <div className="flex items-center gap-3">
        {state.error ? (
          <p className="text-xs font-semibold text-red-650 animate-fade-in">
            {state.error}
          </p>
        ) : null}
        {state.success ? (
          <p className="text-xs font-semibold text-emerald-700 animate-fade-in">
            {state.success}
          </p>
        ) : null}
        <button
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3.5 text-xs font-bold text-red-600 shadow-sm transition hover:border-red-300 hover:bg-red-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-400"
          disabled={pending}
          title="ลบรายงาน"
          type="submit"
        >
          <svg
            className="h-3.5 w-3.5 stroke-current stroke-2 fill-none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {pending ? "กำลังลบ..." : "ลบรายงาน"}
        </button>
      </div>
    </form>
  );
}
