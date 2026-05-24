import { NextResponse } from "next/server"

const DEFAULT_WEBHOOK_URL = "http://localhost:5678/webhook/b7b7f91a-93cb-47db-92a8-29fb892a23f4"

export async function POST(request: Request) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL || DEFAULT_WEBHOOK_URL

  const body = await request.json().catch(() => ({}))
  const transcript = typeof body?.transcript === "string" ? body.transcript.trim() : ""

  if (!transcript) {
    return NextResponse.json(
      { error: "Devi fornire una trascrizione da analizzare." },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: "n8n-ui",
        timestamp: new Date().toISOString(),
        message: "Avvio manuale del workflow da interfaccia grafica",
        transcript,
      }),
    })

    const text = await response.text()
    let payload: unknown = text

    try {
      payload = JSON.parse(text)
    } catch {
      // Il corpo potrebbe non essere JSON valido
    }

    return NextResponse.json({
      ok: response.ok,
      status: response.status,
      payload,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Errore sconosciuto durante la chiamata a N8N." },
      { status: 500 }
    )
  }
}
