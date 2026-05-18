"use client"

import * as React from "react"
import { Button } from "@workspace/ui/components/button"
import { CheckCircle2, GitBranch, Mail, Database, FileText, Folder } from "lucide-react"

type WorkflowStep = {
  title: string
  description: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  active: boolean
  completed: boolean
}

const steps: WorkflowStep[] = [
  {
    title: "Google Drive",
    description: "Verifica nuovi file e avvia il workflow.",
    icon: Folder,
    active: true,
    completed: false,
  },
  {
    title: "Google Docs",
    description: "Elabora il documento rilevato.",
    icon: FileText,
    active: false,
    completed: false,
  },
  {
    title: "Google Sheets",
    description: "Aggiorna i dati con i risultati.",
    icon: Database,
    active: false,
    completed: false,
  },
  {
    title: "Repository",
    description: "Pubblica i cambiamenti o crea un issue.",
    icon: GitBranch,
    active: false,
    completed: false,
  },
  {
    title: "Gmail",
    description: "Invia una notifica finale via email.",
    icon: Mail,
    active: false,
    completed: false,
  },
]

export function N8nWorkflow() {
  const [stepsState, setStepsState] = React.useState<WorkflowStep[]>(steps)
  const [status, setStatus] = React.useState<"idle" | "running" | "success" | "error">("idle")
  const [message, setMessage] = React.useState("Pronto per eseguire il workflow.")
  const [transcript, setTranscript] = React.useState("")
  const [summary, setSummary] = React.useState<string | null>(null)
  const [lastResult, setLastResult] = React.useState<string | null>(null)

  function resetSteps() {
    setStepsState(steps)
    setStatus("idle")
    setMessage("Pronto per eseguire il workflow.")
    setSummary(null)
    setLastResult(null)
  }

  async function runWorkflow() {
    if (!transcript.trim()) {
      setStatus("error")
      setMessage("Inserisci la trascrizione da analizzare.")
      return
    }

    resetSteps()
    setStatus("running")
    setMessage("Avvio del workflow in corso...")
    setSummary(null)
    setLastResult(null)

    const nextSteps = [...steps]

    for (let index = 0; index < nextSteps.length; index += 1) {
      await new Promise((resolve) => window.setTimeout(resolve, 350))

      nextSteps[index] = {
        ...nextSteps[index]!,
        active: true,
        completed: false,
      }

      if (index > 0) {
        nextSteps[index - 1] = {
          ...nextSteps[index - 1]!,
          active: false,
          completed: true,
        }
      }

      setStepsState([...nextSteps])
    }

    try {
      const response = await fetch("/api/run-workflow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: "n8n-ui",
          transcript,
        }),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error || "Errore durante l'esecuzione del workflow.")
      }

      const maybeSummary = typeof payload === "object" && payload && "summary" in payload ? (payload as { summary?: string }).summary : null

      setStatus("success")
      setMessage(maybeSummary ? "Workflow completato con successo. Riassunto disponibile." : "Workflow completato con successo.")
      setSummary(maybeSummary ?? null)
      setLastResult(JSON.stringify(payload, null, 2))
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "Errore inatteso.")
      setLastResult(null)
    }
  }

  const webhookUrl = "http://localhost:5678/webhook-test/b7b7f91a-93cb-47db-92a8-29fb892a23f4"

  return (
    <section className="space-y-8 rounded-[2rem] border border-border bg-card p-8 shadow-xl shadow-slate-950/20 dark:bg-slate-950/80">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Automazione N8N</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Esegui il tuo workflow automatico</h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
          Avvia con un click il flusso che integra Google Drive, Google Docs, Google Sheets, Repository e Gmail.
        </p>
        <div className="rounded-3xl border border-border bg-slate-950/90 p-4 text-sm text-slate-200">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-medium text-slate-100">Webhook collegata:</span>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(webhookUrl)}
              className="rounded-full border border-border bg-background px-3 py-2 text-xs font-medium text-slate-100 transition hover:bg-slate-100/5"
            >
              Copia URL
            </button>
          </div>
          <p className="break-words text-sm text-slate-400">{webhookUrl}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stepsState.map((step) => {
          const Icon = step.icon
          return (
            <div
              key={step.title}
              className={`rounded-3xl border p-5 transition-all ${
                step.active
                  ? "border-primary bg-primary/5 shadow-sm shadow-primary/10"
                  : "border-border bg-background"
              }`}
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950/5 text-slate-900 dark:bg-slate-700/60 dark:text-slate-100">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-base font-semibold">{step.title}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {step.completed ? "Completato" : step.active ? "In corso" : "In attesa"}
                  </p>
                </div>
              </div>
              <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">{step.description}</p>
            </div>
          )
        })}
      </div>

      <div className="space-y-4 rounded-3xl border border-border bg-background p-5">
        <label className="text-sm font-medium text-slate-200">Trascrizione da analizzare</label>
        <textarea
          value={transcript}
          onChange={(event) => setTranscript(event.target.value)}
          rows={8}
          className="w-full resize-none rounded-3xl border border-border bg-slate-950/90 p-4 text-sm text-slate-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="Incolla qui la trascrizione da analizzare e riassumere"
        />
        <p className="text-xs text-slate-500">Inserisci qui una trascrizione testuale che il workflow dovrà analizzare e riassumere.</p>
      </div>

      <div className="flex flex-col gap-4 rounded-3xl bg-slate-950/95 p-6 text-slate-100 shadow-inner shadow-slate-950/20">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Stato workflow</p>
            <p className={`mt-2 text-xl font-semibold ${status === "error" ? "text-destructive" : status === "success" ? "text-emerald-400" : "text-slate-100"}`}>
              {status === "idle" && "Pronto"}
              {status === "running" && "Esecuzione in corso"}
              {status === "success" && "Completato"}
              {status === "error" && "Errore"}
            </p>
          </div>
          {status === "success" ? <CheckCircle2 className="h-6 w-6 text-emerald-400" /> : null}
        </div>
        <p className="text-sm text-slate-400">{message}</p>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button onClick={runWorkflow} disabled={status === "running" || !transcript.trim()} className="rounded-full px-8 py-3">
            {status === "running" ? "Esecuzione..." : "Avvia workflow"}
          </Button>
          <Button variant="secondary" onClick={resetSteps} className="rounded-full px-6 py-3">
            Ripristina stato
          </Button>
        </div>
      </div>

      {summary ? (
        <div className="rounded-3xl border border-border bg-background p-5 text-sm text-slate-200">
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">Riassunto</p>
          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">{summary}</p>
        </div>
      ) : null}

      {lastResult ? (
        <div className="rounded-3xl border border-border bg-background p-5 text-sm text-slate-200">
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">Risultato API</p>
          <pre className="max-h-52 overflow-auto text-xs leading-5 text-slate-300">{lastResult}</pre>
        </div>
      ) : null}
    </section>
  )
}
