import { N8nWorkflow } from "@/components/n8n-workflow"

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <section className="rounded-[2rem] border border-border bg-card p-8 shadow-xl shadow-slate-950/10 dark:bg-slate-950/80">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Dashboard N8N</p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Interfaccia workflow dinamica
            </h1>
            <p className="max-w-3xl text-base leading-7 text-slate-500 dark:text-slate-400">
              Avvia il tuo workflow N8N direttamente da questa pagina e monitora i passaggi del processo in tempo reale.
            </p>
          </div>
        </section>

        <N8nWorkflow />
      </div>
    </main>
  )
}
