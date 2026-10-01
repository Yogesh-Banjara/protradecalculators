import React from "react";

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-[480px] bg-white text-slate-900 p-2 sm:p-4">
      {children}
    </div>
  );
}
