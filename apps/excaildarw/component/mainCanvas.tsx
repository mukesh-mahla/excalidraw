import { DrawingCanvas } from "@/draw"
import { Circle, Minus, Palette, Pencil, RectangleHorizontalIcon, Redo, Type, Undo } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { ButtonIcon } from "./buttonIcon"
import { Hand } from "lucide-react"
type ShapeTool = "drag" | "line" | "rect" | "circle" | "pencil" | "color" | "text"

export function MainCanvas({ roomId, socket }: { roomId: string; socket: WebSocket }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const textInputRef = useRef<HTMLTextAreaElement>(null)
    const [selectedTool, setSelectedTool] = useState<ShapeTool>("circle")
    const drawingRef = useRef<DrawingCanvas | null>(null)
    const cameraRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
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
            // Re-render after resize so shapes aren't wiped
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
        })
        return () => drawingRef.current?.destroy()
    }, [socket])

    return (
        <div className="h-screen w-screen overflow-hidden">
            <canvas ref={canvasRef} style={{ cursor: selectedTool === "drag" ? "grab" : "crosshair" }} />
            <textarea
                ref={textInputRef}
                className="absolute overflow-hidden border-none p-0 m-0 bg-transparent outline-none resize-none hidden text-white"
            />
            <Topbar
                selectedTool={selectedTool}
                setSelectedTool={setSelectedTool}
                drawingRef={drawingRef}
            />
        </div>
    )
}

function Topbar({
    selectedTool,
    setSelectedTool,
    drawingRef,
}: {
    selectedTool: ShapeTool
    setSelectedTool: (s: ShapeTool) => void
    drawingRef: React.RefObject<DrawingCanvas | null>
}) {
    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 flex gap-2 bg-gray-800 p-2 rounded-lg shadow-lg max-w-full overflow-x-auto">
            <ButtonIcon activated={selectedTool === "drag"} icon={<Hand />} onclick={() => setSelectedTool("drag")} />
            <ButtonIcon activated={selectedTool === "text"} icon={<Type />} onclick={() => setSelectedTool("text")} />
            <ButtonIcon activated={selectedTool === "pencil"} icon={<Pencil />} onclick={() => setSelectedTool("pencil")} />
            <ButtonIcon activated={selectedTool === "line"} icon={<Minus />} onclick={() => setSelectedTool("line")} />
            <ButtonIcon activated={selectedTool === "rect"} icon={<RectangleHorizontalIcon />} onclick={() => setSelectedTool("rect")} />
            <ButtonIcon activated={selectedTool === "circle"} icon={<Circle />} onclick={() => setSelectedTool("circle")} />
            <ButtonIcon activated={selectedTool === "color"} icon={<Palette />} onclick={() => setSelectedTool("color")} />
            <ButtonIcon activated={false} icon={<Undo />} onclick={() => drawingRef.current?.undo()} />
            <ButtonIcon activated={false} icon={<Redo />} onclick={() => drawingRef.current?.redo()} />
        </div>
    )
}