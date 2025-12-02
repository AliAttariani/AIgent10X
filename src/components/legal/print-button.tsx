"use client";

export function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      type="button"
      onClick={handlePrint}
      className="inline-flex items-center justify-center rounded-md border border-border px-3 py-1.5 text-sm font-medium text-primary transition hover:border-primary hover:text-primary/90"
    >
      Print
    </button>
  );
}
