import type { ReactNode } from "react";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-69px)] flex-col">
      <main className="flex flex-1 flex-col">
        <div className="mx-auto w-full flex-1">{children}</div>
      </main>
    </div>
  );
}
