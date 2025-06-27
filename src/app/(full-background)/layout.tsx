// File: app/(full-background)/layout.tsx (FILE BARU)

export default function FullBackgroundLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative z-10">{children}</div>

      <div aria-hidden="true" className="fixed inset-0 z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-blue-200/30 dark:bg-blue-900/40 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 top-1/2 left-1/2 -translate-x-1/4 -translate-y-3/4 w-[50rem] h-[50rem] bg-teal-200/30 dark:bg-teal-800/40 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000"
      ></div>
    </div>
  );
}
