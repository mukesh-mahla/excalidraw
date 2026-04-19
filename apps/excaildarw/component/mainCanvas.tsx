import { DrawingCanvas } from "@/draw"
import { Circle, Minus, Palette, Pencil, RectangleHorizontalIcon, Redo, Type, Undo } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { ButtonIcon } from "./buttonIcon"
import { Hand } from "lucide-react"
import { ZoomIn, ZoomOut } from "lucide-react"
import { MousePointer2 } from "lucide-react"

type ShapeTool = "drag" | "cursor" | "line" | "rect" | "circle" | "pencil" | "color" | "text"
const  crosshair = `url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12h14'/%3E%3Cpath d='M12 5v14'/%3E%3C/svg%3E") 12 12, crosshair`;
export function MainCanvas({ roomId, socket }: { roomId: string; socket: WebSocket }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const textInputRef = useRef<HTMLTextAreaElement>(null)
    const [selectedTool, setSelectedTool] = useState<ShapeTool>("circle")
    const [zoom, setZoom] = useState(100)
    const drawingRef = useRef<DrawingCanvas | null>(null)
    const cameraRef = useRef<{ x: number; y: number; scale: number }>({ x: 0, y: 0, scale: 1 })

    // Keep the class in sync with React's selected tool state
    useEffect(() => {
        drawingRef.current?.setTool(selectedTool)
    }, [selectedTool])

    // Resize canvas to fill viewport
    useEffect(() => {
        const resize = () => {
            const canvas = canvasRef.current
            if (!canvas) return
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            drawingRef.current?.render()
        }
        resize()
        window.addEventListener("resize", resize)
        return () => window.removeEventListener("resize", resize)
    }, [])

    // Init drawing class once canvas + socket are ready
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas || !socket) return

        DrawingCanvas.init(canvas, roomId, socket, textInputRef.current, cameraRef.current).then((instance) => {
            drawingRef.current = instance
            instance.setTool(selectedTool)

            // Sync zoom state from drawing class if it exposes it
            instance.onZoomChange?.((z: number) => setZoom(Math.round(z * 100)))
        })
        return () => drawingRef.current?.destroy()
    }, [socket])

    // Keyboard shortcuts
    useEffect(() => {
        const keyMap: Record<string, ShapeTool> = {
            h: "drag",
            v: "cursor",
            r: "rect",
            o: "circle",
            l: "line",
            p: "pencil",
            t: "text",
        }
        const handleKey = (e: KeyboardEvent) => {
            // Don't fire shortcuts when typing in an input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
            const tool = keyMap[e.key.toLowerCase()]
            if (tool) setSelectedTool(tool)
            if (e.key === "=" || e.key === "+") handleZoomIn()
            if (e.key === "-") handleZoomOut()
            if (e.key === "0") handleZoomReset()
            if ((e.metaKey || e.ctrlKey) && e.key === "z") {
                e.preventDefault()
                e.shiftKey ? drawingRef.current?.redo() : drawingRef.current?.undo()
            }
        }
        window.addEventListener("keydown", handleKey)
        return () => window.removeEventListener("keydown", handleKey)
    }, [])

    const handleZoomIn = () => {
        drawingRef.current?.zoomIn()
        setZoom((z) => Math.min(400, z + 10))
    }

    const handleZoomOut = () => {
        drawingRef.current?.zoomOut()
        setZoom((z) => Math.max(10, z - 10))
    }

    const handleZoomReset = () => {
        drawingRef.current?.resetZoom?.()
        setZoom(100)
    
    }


    return (
        <div className="h-screen w-screen overflow-hidden bg-[#16161e]">
            {/* Dot grid background */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                }}
            />

            <canvas
                ref={canvasRef}
                className="absolute inset-0"
                style={{ cursor: selectedTool === "drag" ? "grab" : crosshair }}
            />

            <textarea
                ref={textInputRef}
                className="absolute overflow-hidden border-none p-0 m-0 bg-transparent outline-none resize-none hidden text-white"
            />

            {/* Top toolbar */}
            <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />

            {/* Bottom left — Zoom */}
            <div className="fixed bottom-5 left-5 flex items-center bg-[#1e1e2a]/95 backdrop-blur-xl border border-white/[0.08] rounded-xl p-1 shadow-2xl gap-px">
                <button
                    onClick={handleZoomOut}
                    title="Zoom out (−)"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.07] transition-all duration-150"
                >
                    <ZoomOut size={14} />
                </button>

                <button
                    onClick={handleZoomReset}
                    title="Reset zoom (0)"
                    className="min-w-[46px] h-8 px-1 rounded-lg text-xs font-medium text-white/40 hover:text-white hover:bg-white/[0.07] transition-all duration-150 tabular-nums"
                >
                    {zoom}%
                </button>

                <button
                    onClick={handleZoomIn}
                    title="Zoom in (+)"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.07] transition-all duration-150"
                >
                    <ZoomIn size={14} />
                </button>
            </div>

            {/* Bottom right — Undo / Redo */}
            <div className="fixed bottom-5 right-5 flex items-center bg-[#1e1e2a]/95 backdrop-blur-xl border border-white/[0.08] rounded-xl p-1 shadow-2xl gap-px">
                <button
                    onClick={() => drawingRef.current?.undo()}
                    title="Undo (Ctrl+Z)"
                    className="w-9 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.07] transition-all duration-150"
                >
                    <Undo size={14} />
                </button>
                <div className="w-px h-4 bg-white/[0.08] mx-px" />
                <button
                    onClick={() => drawingRef.current?.redo()}
                    title="Redo (Ctrl+Shift+Z)"
                    className="w-9 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.07] transition-all duration-150"
                >
                    <Redo size={14} />
                </button>
            </div>
        </div>
    )
}

function Topbar({
    selectedTool,
    setSelectedTool,
}: {
    selectedTool: ShapeTool
    setSelectedTool: (s: ShapeTool) => void
}) {
    const tools: { tool: ShapeTool; icon: React.ReactNode; label: string; kbd: string }[] = [
        { tool: "drag", icon: <Hand size={16} strokeWidth={1.75} />, label: "Pan", kbd: "H" },
        { tool: "cursor", icon: <MousePointer2 size={16} strokeWidth={1.75} />, label: "Select", kbd: "V" },
        { tool: "rect", icon: <RectangleHorizontalIcon size={16} strokeWidth={1.75} />, label: "Rectangle", kbd: "R" },
        { tool: "circle", icon: <Circle size={16} strokeWidth={1.75} />, label: "Circle", kbd: "O" },
        { tool: "line", icon: <Minus size={16} strokeWidth={1.75} />, label: "Line", kbd: "L" },
        { tool: "pencil", icon: <Pencil size={16} strokeWidth={1.75} />, label: "Pencil", kbd: "P" },
        { tool: "text", icon: <Type size={16} strokeWidth={1.75} />, label: "Text", kbd: "T" },
        { tool: "color", icon: <Palette size={16} strokeWidth={1.75} />, label: "Color", kbd: "C" },
    ]

    // Insert a divider after index 1 (after cursor) and after index 6 (after text, before color)
    const dividerAfter = new Set([1, 6])

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 flex items-center bg-[#1e1e2a]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-1.5 shadow-2xl gap-px z-50">
            {tools.map(({ tool, icon, label, kbd }, i) => (
                <div key={tool} className="flex items-center gap-px">
                    <button
                        onClick={() => setSelectedTool(tool)}
                        title={`${label} (${kbd})`}
                        className={`
                            relative w-9 h-9 rounded-xl flex items-center justify-center
                            transition-all duration-150 group
                            ${selectedTool === tool
                                ? "bg-indigo-500/20 text-indigo-400 shadow-[0_0_0_1px_rgba(99,102,241,0.4)]"
                                : "text-white/35 hover:text-white/80 hover:bg-white/[0.06]"
                            }
                        `}
                    >
                        {icon}
                        {/* Keyboard shortcut badge */}
                        <span className="absolute bottom-[3px] right-[3px] text-[8px] leading-none text-white/20 font-medium group-hover:text-white/35 transition-colors">
                            {kbd}
                        </span>
                    </button>

                    {dividerAfter.has(i) && (
                        <div className="w-px h-5 bg-white/[0.08] mx-1" />
                    )}
                </div>
            ))}
        </div>
    )
}




