"use client"

import * as React from "react"
import { Button } from "@workspace/ui/components/button"

type Message = {
  id: number
  author: "me" | "bot"
  text: string
}

const botReplies = [
  "Ciao! Come posso aiutarti oggi?",
  "Va bene, dimmi pure.",
  "Interessante, continua così!",
  "Sono qui per aiutarti con qualsiasi domanda.",
  "Fammi sapere quando sei pronto per un nuovo messaggio.",
]

function getRandomBotReply(): string {
  const index = Math.floor(Math.random() * botReplies.length)
  const reply = botReplies[index] as string
  return reply ?? botReplies[0]
}

export function Chat() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: 1,
      author: "bot",
      text: "Ciao! Scrivi un messaggio per iniziare la chat.",
    },
  ])
  const [newMessage, setNewMessage] = React.useState("")
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  function sendMessage() {
    const trimmed = newMessage.trim()
    if (!trimmed) {
      return
    }

    const userMessage: Message = {
      id: Date.now(),
      author: "me",
      text: trimmed,
    }

    setMessages((current) => [...current, userMessage])
    setNewMessage("")

    window.setTimeout(() => {
      const reply: Message = {
        id: Date.now() + 1,
        author: "bot",
        text: getRandomBotReply(),
      }
      setMessages((current) => [...current, reply])
    }, 600)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex h-[calc(100vh-3rem)] min-h-[520px] flex-col rounded-3xl border border-border bg-card p-4 shadow-sm shadow-black/5 dark:bg-slate-950 dark:shadow-white/5 sm:p-6">
      <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">Chat</p>
          <h2 className="text-2xl font-semibold">Parla con il tuo assistente</h2>
        </div>
        <div className="text-xs text-muted-foreground">Premi Invio per inviare</div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-3">
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.author === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm ${
                  message.author === "me"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <p>{message.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <input
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Scrivi qui..."
          className="flex-1 rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary/70 focus:ring-2 focus:ring-primary/10 dark:bg-slate-900"
        />
        <Button onClick={sendMessage} className="whitespace-nowrap">
          Invia
        </Button>
      </div>
    </div>
  )
}
