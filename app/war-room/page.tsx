'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://njxydstcfczirnpskvad.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_WARROOM_SUPABASE_ANON_KEY!
const CHANNEL_ID = '601c5b9e-c28c-42b6-b0c1-3a47b0a6842e'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

interface Agent {
  id: string
  name: string
  avatar_color: string
}

interface Message {
  id: string
  agent_id: string
  content: string
  created_at: string
  agent_name?: string
  avatar_color?: string
}

export default function WarRoom() {
  const [messages, setMessages] = useState<Message[]>([])
  const [agents, setAgents] = useState<Record<string, Agent>>({})
  const [input, setInput] = useState('')
  const [marcAgentId, setMarcAgentId] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function init() {
      // Fetch agents
      const { data: agentData } = await supabase
        .from('war_room_agents')
        .select('*')

      const agentMap: Record<string, Agent> = {}
      agentData?.forEach((a: Agent) => {
        agentMap[a.id] = a
        if (a.name === 'Marc') setMarcAgentId(a.id)
      })
      setAgents(agentMap)

      // Fetch messages
      const { data: msgData } = await supabase
        .from('war_room_messages')
        .select('*')
        .eq('channel_id', CHANNEL_ID)
        .order('created_at', { ascending: true })

      setMessages(msgData || [])
    }

    init()

    // Real-time subscription
    const channel = supabase
      .channel('war-room-live')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'war_room_messages',
          filter: `channel_id=eq.${CHANNEL_ID}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !marcAgentId) return

    const text = input.trim()
    setInput('')

    await supabase.from('war_room_messages').insert({
      channel_id: CHANNEL_ID,
      agent_id: marcAgentId,
      content: text,
    })
  }

  const formatTime = (ts: string) => {
    const d = new Date(ts)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex flex-col h-screen bg-[#1a1a1a] text-white">
      <div className="px-4 py-3 border-b border-white/10 flex-shrink-0">
        <h1 className="text-lg font-semibold text-gray-200">War Room</h1>
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => {
          const agent = agents[msg.agent_id]
          const name = agent?.name || 'Unknown'
          const color = agent?.avatar_color || '#888'

          return (
            <div key={msg.id} className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-black"
                style={{ backgroundColor: color }}
              >
                {name[0]}
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-sm" style={{ color }}>
                    {name}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {formatTime(msg.created_at)}
                  </span>
                </div>
                <p className="text-sm text-gray-300 whitespace-pre-wrap break-words">
                  {msg.content}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="px-4 py-3 border-t border-white/10 flex-shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-[#2a2a2a] text-white text-sm rounded-lg px-4 py-2.5 border border-white/10 focus:outline-none focus:border-[#F6C851]/50 placeholder-gray-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-[#F6C851] text-black text-sm font-medium rounded-lg hover:bg-[#f7d06a] transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}
