"use client";

import dynamic from "next/dynamic";

const ReaderApp = dynamic(() => import("./reader-app"), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">Chargement…</p>
    </div>
  ),
});

export default function ReaderAppClient() {
  return <ReaderApp />;
}
