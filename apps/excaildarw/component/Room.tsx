"use client"

import { Button } from "@repo/ui/button"
import Input from "@repo/ui/input"
import axios from "axios"
import { useState } from "react"
import { useRouter } from "next/navigation"

const HTTP_BACKEND = process.env.NEXT_PUBLIC_HTTP_BACKEND

export function Room() {
  const router = useRouter()

  const [joinSlug, setJoinSlug] = useState("")
  const [createSlug, setCreateSlug] = useState("")
  const [loading, setLoading] = useState<"join" | "create" | null>(null)
  const [error, setError] = useState("")

  async function getRoom() {
    if (!joinSlug.trim()) return setError("Room code is required")
    try {
      setLoading("join")
      setError("")
      const res = await axios.get(
        `${HTTP_BACKEND}/chats/room/${joinSlug.trim()}`
      )
      router.push(`/canvas/${res.data.id}`)
    } catch {
      setError("Room not found")
    } finally {
      setLoading(null)
    }
  }

  async function createRoom() {
    if (!createSlug.trim()) return setError("Room name is required")
    try {
      setLoading("create")
      setError("")
      const token = localStorage.getItem("token")
      const res = await axios.post(
        `${HTTP_BACKEND}/room`,
        { slug: createSlug.trim() },
        { headers: { Authorization: token ?? "" } }
      )
      router.push(`/canvas/${res.data.roomId}`)
    } catch {
      setError("Failed to create room")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-950 to-neutral-900 px-4">
      <div className="w-full max-w-md rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl p-6">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-white">Collaborative Canvas</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Join an existing room or create a new one
          </p>
        </div>

        {/* Join Room */}
        <div className="space-y-2">
          <Input
            placeholder="Enter room code"
            value={joinSlug}
            onChange={(e) => setJoinSlug(e.target.value)}
          />
          <Button
            className="w-full"
            disabled={loading === "join"}
            onClick={getRoom}
          >
            {loading === "join" ? "Joining..." : "Join Room"}
          </Button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-neutral-800" />
          <span className="px-3 text-xs text-neutral-500">OR</span>
          <div className="flex-1 h-px bg-neutral-800" />
        </div>

        {/* Create Room */}
        <div className="space-y-2">
          <Input
            placeholder="Create a room name"
            value={createSlug}
            onChange={(e) => setCreateSlug(e.target.value)}
          />
          <Button
            className="w-full"
            variant="secondary"
            disabled={loading === "create"}
            onClick={createRoom}
          >
            {loading === "create" ? "Creating..." : "Create Room"}
          </Button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-400 mt-4 text-center">{error}</p>
        )}
      </div>
    </div>
  )
}
