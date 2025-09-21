import initDraw from "@/draw"
import { Circle, Minus, Palette, Pencil, RectangleHorizontalIcon, Redo, Type, Undo } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { ButtonIcon } from "./buttonIcon"

type shape = "line" | "rect" | "circle" | "pencil" | "color" | "text"

export function MainCanvas({ roomId, socket }: { roomId: string, socket: WebSocket }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const textInputRef = useRef<HTMLTextAreaElement>(null)
    const [selectedTool, setSelectedTool] = useState<shape>("circle")

    const undoRedoRef = useRef<{ undo: () => void; redo: () => void } | null>(null)

 
    const resizeCanvas = () => {
        const canvas = canvasRef.current
        if (canvas) {
            canvas.width = window.innerWidth   
            canvas.height = window.innerHeight 
        }
    }

    useEffect(() => {
        resizeCanvas()
        window.addEventListener("resize", resizeCanvas)
        return () => window.removeEventListener("resize", resizeCanvas)
    }, [])

    useEffect(() => {
        //@ts-ignore
        window.selectedTool = selectedTool
        //@ts-ignore
        window.textInputRef = textInputRef.current
    }, [selectedTool])

    useEffect(() => {
        if (canvasRef.current) {
            initDraw(canvasRef.current, roomId, socket).then(res => {
                if (!res) return
                undoRedoRef.current = res
            })
        }
    }, [canvasRef])

    return (
        <div className="h-screen w-screen overflow-hidden">
            
            <canvas ref={canvasRef}></canvas>

            <textarea
                ref={textInputRef}
                className="absolute overflow-hidden border-none p-0 m-0 bg-transparent outline-none resize-none hidden text-white"
            />

            <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} undoRedoRef={undoRedoRef} />
        </div>
    )
}

function Topbar({ selectedTool, setSelectedTool, undoRedoRef }: {
    selectedTool: shape,
    setSelectedTool: (s: shape) => void,
    undoRedoRef: React.RefObject<{ undo: () => void; redo: () => void } | null>
}) {
    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 flex gap-2 bg-gray-800 p-2 rounded-lg shadow-lg max-w-full overflow-x-auto">
            <ButtonIcon activated={selectedTool === "text"} icon={<Type />} onclick={() => { setSelectedTool("text") }} />
            <ButtonIcon activated={selectedTool === "pencil"} icon={<Pencil />} onclick={() => { setSelectedTool("pencil") }} />
            <ButtonIcon activated={selectedTool === "line"} icon={<Minus />} onclick={() => { setSelectedTool("line") }} />
            <ButtonIcon activated={selectedTool === "rect"} icon={<RectangleHorizontalIcon />} onclick={() => { setSelectedTool("rect") }} />
            <ButtonIcon activated={selectedTool === "circle"} icon={<Circle />} onclick={() => { setSelectedTool("circle") }} />
            <ButtonIcon activated={selectedTool === "color"} icon={<Palette />} onclick={() => { setSelectedTool("color") }} />
            <ButtonIcon activated={false} onclick={() => undoRedoRef.current?.undo()} icon={<Undo />} />
            <ButtonIcon activated={false} onclick={() => undoRedoRef.current?.redo()} icon={<Redo />} />
        </div>
    )
}
