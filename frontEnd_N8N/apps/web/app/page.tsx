import { Button } from "@workspace/ui/components/button"

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100 px-6 py-10">
      <div className="flex w-full max-w-xl flex-col items-center justify-center gap-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-10 shadow-2xl shadow-slate-950/40">
        <h1 className="text-center text-5xl font-semibold tracking-tight sm:text-6xl">
          Hello World 🚀
        </h1>
        <p className="max-w-xl text-center text-sm text-slate-400 sm:text-base">
          Tutto funziona: React, Tailwind CSS e il componente Button di shadcn/ui sono attivi.
        </p>
        <Button className="rounded-full px-8 py-3 text-sm font-semibold">
          Click Me
        </Button>
      </div>
    </main>
  )
}
