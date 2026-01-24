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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-neutral-100 px-4">
      <div
        className="
          w-full max-w-md rounded-2xl bg-white border border-neutral-200
          shadow-lg p-7 transition-all duration-200
          hover:shadow-xl
        "
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Collaborative Canvas
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Join an existing room or create a new one
          </p>
        </div>

        {/* Join Room */}
        <div className="space-y-3 group">
          <Input
            placeholder="Enter room code"
            value={joinSlug}
            onChange={(e) => setJoinSlug(e.target.value)}
          />

          <Button
            className="
              w-full transition-all duration-150
              hover:shadow-md
              active:scale-[0.97] active:shadow-inner
            "
            disabled={loading === "join"}
            onClick={getRoom}
          >
            {loading === "join" ? "Joining..." : "Join Room"}
          </Button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-7">
          <div className="flex-1 h-px bg-neutral-200" />
          <span className="px-3 text-xs text-neutral-400 uppercase tracking-wide">
            Or
          </span>
          <div className="flex-1 h-px bg-neutral-200" />
        </div>

        {/* Create Room */}
        <div className="space-y-3 group">
          <Input
            placeholder="Create a room name"
            value={createSlug}
            onChange={(e) => setCreateSlug(e.target.value)}
          />

          <Button
            variant="secondary"
            className="
              w-full transition-all duration-150
              hover:shadow-md
              active:scale-[0.97] active:shadow-inner
            "
            disabled={loading === "create"}
            onClick={createRoom}
          >
            {loading === "create" ? "Creating..." : "Create Room"}
          </Button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500 mt-5 text-center animate-[fadeIn_0.15s_ease-out]">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
