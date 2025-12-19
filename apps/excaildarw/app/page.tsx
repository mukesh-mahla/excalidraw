import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import {
  Download,
  Github,
  Pencil,
  Share2,
  Sparkles,
  Users2,
} from "lucide-react";
import Link from "next/link";

export default function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* HERO */}
      <header className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
              Think better.
              <span className="block bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                Draw together.
              </span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground">
              A fast, multiplayer whiteboard for brainstorming, system design,
              and visual thinking — no friction, no sign-up.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/room">
                <Button size="lg" className="h-12 px-8 flex gap-2">
                  <Pencil className="h-4 w-4" />
                  Start Drawing
                </Button>
              </Link>

              <Link href="/signin">
                <Button variant="outline" size="lg" className="h-12 px-8">
                  Sign in
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Used by developers, designers & students
            </p>
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <section className="py-20 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Share2,
                title: "Instant Sharing",
                desc: "Share a single link and collaborate instantly with anyone.",
              },
              {
                icon: Users2,
                title: "Live Multiplayer",
                desc: "See cursors, edits, and ideas appear in real-time.",
              },
              {
                icon: Sparkles,
                title: "Smart Sketching",
                desc: "Clean shapes and diagrams without fighting the tool.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <Card
                key={title}
                className="p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{title}</h3>
                </div>
                <p className="mt-4 text-muted-foreground">{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl bg-gradient-to-r from-primary to-purple-600 p-12 text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Your ideas deserve space
            </h2>
            <p className="mt-4 text-lg text-white/80">
              Open a canvas and start thinking visually in seconds.
            </p>

            <div className="mt-8">
              <Link href="/room">
                <Button size="lg" variant="secondary" className="h-12 px-8">
                  Open Canvas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Excalidraw Clone
          </p>

          <div className="flex gap-6">
            <a href="https://github.com" className="hover:text-primary">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-primary">
              <Download className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
