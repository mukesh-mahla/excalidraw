"use client"

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
    if (!joinSlug.trim()) return setError("Room name required")

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
    if (!createSlug.trim()) return setError("Room name required")

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-950 via-neutral-900 to-black text-white px-4">

      <div className="w-full max-w-md bg-white/[0.03] border border-white/10 rounded-xl p-8">

        <h1 className="text-2xl font-semibold text-center">
          Join or Create Room
        </h1>

        <p className="text-sm text-neutral-400 text-center mt-2">
          Start collaborating instantly
        </p>

        {/* JOIN */}
        <div className="mt-8 space-y-3">

          <input
            type="text"
            placeholder="Room name"
            value={joinSlug}
            onChange={(e) => setJoinSlug(e.target.value)}
            className="w-full h-11 px-3 rounded-md bg-black border border-white/10 focus:outline-none focus:border-purple-500"
          />

          <button
            onClick={getRoom}
            disabled={loading === "join"}
            className="w-full h-11 rounded-md bg-purple-600 hover:bg-purple-700 transition active:scale-95"
          >
            {loading === "join" ? "Joining..." : "Join Room"}
          </button>

        </div>

        {/* DIVIDER */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-white/10"/>
          <span className="px-3 text-xs text-neutral-400 uppercase">
            or
          </span>
          <div className="flex-1 h-px bg-white/10"/>
        </div>

        {/* CREATE */}
        <div className="space-y-3">

          <input
            type="text"
            placeholder="New room name"
            value={createSlug}
            onChange={(e) => setCreateSlug(e.target.value)}
            className="w-full h-11 px-3 rounded-md bg-black border border-white/10 focus:outline-none focus:border-purple-500"
          />

          <button
            onClick={createRoom}
            disabled={loading === "create"}
            className="w-full h-11 rounded-md bg-purple-600 hover:bg-purple-700 transition active:scale-95"
          >
            {loading === "create" ? "Creating..." : "Create Room"}
          </button>

        </div>

        {error && (
          <p className="text-sm text-red-500 text-center mt-4">
            {error}
          </p>
        )}

      </div>

    </div>
  )
}