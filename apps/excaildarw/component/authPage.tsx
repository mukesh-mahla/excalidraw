"use client"

import { useRef } from "react"

export default function AuthPage({
  isSignin,
  onSumbit,
}: {
  isSignin: boolean
  onSumbit: (values: {
    userName?: string
    email: string
    password: string
  }) => void
}) {
  const emailRef = useRef<HTMLInputElement>(null)
  const userNameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const handelClick = () => {
    const values = {
      userName: userNameRef.current?.value || "",
      email: emailRef.current?.value || "",
      password: passwordRef.current?.value || "",
    }

    onSumbit(values)
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-br from-white to-neutral-100 px-4">
      <div className="w-full max-w-sm bg-white border border-neutral-200 rounded-2xl shadow-lg p-6 transition-all duration-200">
        
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-neutral-900">
            {isSignin ? "Welcome back" : "Create an account"}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {isSignin
              ? "Sign in to continue"
              : "Sign up to get started"}
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {!isSignin && (
            <input
              ref={userNameRef}
              className="
                w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm
                outline-none transition-all duration-150
                focus:border-neutral-900 focus:shadow-sm focus:-translate-y-[1px]
              "
              type="text"
              placeholder="Username"
            />
          )}

          <input
            ref={emailRef}
            className="
              w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm
              outline-none transition-all duration-150
              focus:border-neutral-900 focus:shadow-sm focus:-translate-y-[1px]
            "
            type="text"
            placeholder="Email"
          />

          <input
            ref={passwordRef}
            className="
              w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm
              outline-none transition-all duration-150
              focus:border-neutral-900 focus:shadow-sm focus:-translate-y-[1px]
            "
            type="password"
            placeholder="Password"
          />

          <button
            onClick={handelClick}
            className="
              w-full rounded-lg bg-neutral-900 text-white py-2 text-sm font-medium
              transition-all duration-150
              hover:bg-neutral-800 hover:shadow-md
              active:scale-[0.97] active:shadow-inner
              focus:outline-none focus:ring-2 focus:ring-neutral-400
            "
          >
            {isSignin ? "Sign in" : "Sign up"}
          </button>
        </div>
      </div>
    </div>
  )
}
