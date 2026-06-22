"use client";

type PrintButtonProps = {
  children?: string;
  targetId?: string;
};

export function PrintButton({ children = "พิมพ์เอกสาร", targetId }: PrintButtonProps) {
  function handlePrint() {
    if (!targetId) {
      window.print();
      return;
    }

    const root = document.documentElement;
    const target = document.getElementById(targetId);

    if (!target) {
      window.print();
      return;
    }

    const cleanup = () => {
      root.classList.remove("print-single-report");
      target.classList.remove("is-print-selected");
      window.removeEventListener("afterprint", cleanup);
    };

    root.classList.add("print-single-report");
    target.classList.add("is-print-selected");
    window.addEventListener("afterprint", cleanup);
    window.print();
    window.setTimeout(cleanup, 1000);
  }

  return (
    <button
      className="no-print inline-flex h-11 items-center gap-2 rounded-xl bg-brand-dark px-5 text-sm font-bold text-white shadow-md transition hover:bg-brand-dark-hover hover:text-brand-gold active:scale-[0.98]"
      onClick={handlePrint}
      type="button"
    >
      <svg className="h-4 w-4 stroke-current stroke-2 fill-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2m-12 4h12v-8H6v8z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {children}
    </button>
  );
}
