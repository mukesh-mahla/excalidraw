import { Download, Github, Pencil, Share2, Sparkles, Users2 } from "lucide-react";
import Link from "next/link";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-neutral-950 via-neutral-900 to-black text-white">

      {/* NAVBAR */}
      <nav className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight">
            Canvas
          </h1>

          <div className="flex items-center gap-4">
            <Link
              href="/signin"
              className="text-sm text-neutral-300 hover:text-white transition"
            >
              Sign in
            </Link>

            <Link
              href="/signup"
              className="px-4 py-2 text-sm rounded-md bg-white text-black font-medium hover:bg-neutral-200 transition"
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="flex-1 flex items-center">
        <div className="max-w-5xl mx-auto px-6 text-center">

          <h1 className="text-5xl sm:text-6xl font-bold leading-tight tracking-tight">
            Think better.
            <span className="block text-purple-400">
              Draw together.
            </span>
          </h1>

          <p className="mt-6 text-lg text-neutral-400 max-w-2xl mx-auto">
            A fast multiplayer whiteboard for brainstorming, system design,
            and visual thinking. Share a link and collaborate instantly.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">

            {/* START DRAWING BUTTON */}
            <Link
              href="/room"
              className="flex items-center gap-2 px-6 h-12 rounded-md bg-purple-600 hover:bg-purple-700 transition font-medium"
            >
              <Pencil size={18} />
              <span>Start Drawing</span>
            </Link>

            {/* SIGNUP BUTTON */}
            <Link
              href="/signup"
              className="flex items-center px-6 h-12 rounded-md border border-white/20 hover:bg-white/10 transition"
            >
              Create account
            </Link>
          </div>

          <p className="mt-6 text-sm text-neutral-500">
            Used by developers, designers and students
          </p>
        </div>
      </header>

      {/* FEATURES */}
      <section className="py-24 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

          {[
            {
              icon: Share2,
              title: "Instant Sharing",
              desc: "Send a link and collaborate instantly with anyone.",
            },
            {
              icon: Users2,
              title: "Live Multiplayer",
              desc: "See edits and cursors appear in real time.",
            },
            {
              icon: Sparkles,
              title: "Smart Sketching",
              desc: "Draw diagrams quickly without fighting the tool.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition"
            >
              <Icon className="h-6 w-6 text-purple-400" />

              <h3 className="mt-4 text-lg font-semibold">
                {title}
              </h3>

              <p className="mt-2 text-sm text-neutral-400">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <h2 className="text-3xl font-bold">
          Start thinking visually
        </h2>

        <p className="mt-4 text-neutral-400">
          Open a canvas and start collaborating in seconds.
        </p>

        <div className="mt-8 flex justify-center gap-4">

          <Link
            href="/room"
            className="flex items-center gap-2 px-6 h-12 rounded-md bg-purple-600 hover:bg-purple-700 transition font-medium"
          >
            <Pencil size={18} />
            Open Canvas
          </Link>

          <Link
            href="/signup"
            className="flex items-center px-6 h-12 rounded-md border border-white/20 hover:bg-white/10 transition"
          >
            Sign up
          </Link>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">

          <p className="text-sm text-neutral-500">
            © 2026 Canvas
          </p>

          <div className="flex gap-6">
            <a href="https://github.com" className="text-neutral-400 hover:text-white">
              <Github size={18} />
            </a>

            <a href="#" className="text-neutral-400 hover:text-white">
              <Download size={18} />
            </a>
          </div>

        </div>
      </footer>

    </div>
  );
}