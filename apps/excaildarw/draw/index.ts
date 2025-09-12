import { HTTP_BACKEND } from "@/config"
import axios from "axios"

type shape = {
    type: "rect",
    x: number,
    y: number,
    width: number,
    height: number,
} | {
    type: "circle",
    centerX: number,
    centerY: number,
    radius: number,
    startAngle: number,
    endAngle: number,
} | {
    type: "line",
    startx: number,
    starty: number,
    endx: number,
    endy: number,
} | {
    type: "pencil",
    points: { x: number; y: number }[],
} | {
    type: "text",
    x: number,
    y: number,
    value: string
}

export default async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    let exsistinShape: shape[] = await getExistingShape(roomId)
    
    let undoShape: shape[][] = []
    let redoShape: shape[][] = []

    const ctx = canvas.getContext("2d")

    if (!ctx) {
        return
    }

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data)
        if (message.type == "chat") {
            const parsedShape = message.message.shape
            exsistinShape.push(parsedShape)
            clearCtx(ctx, canvas, exsistinShape)
        }
    }
    
    clearCtx(ctx, canvas, exsistinShape)
    let click = false
    let startX = 0
    let startY = 0
    let currentPoints: {x: number, y: number}[] = [];

    canvas.addEventListener("mousedown", (e) => {
        const rect = canvas.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;

        //@ts-ignore
        const selectedTool = window.selectedTool;
        //@ts-ignore
        const textInput = window.textInputRef as HTMLTextAreaElement | null;

        click = true;
        

        if (selectedTool === "pencil") {
            currentPoints = [{x: startX, y: startY}]
        }
         
     if (selectedTool === "text" && textInput) {
        e.preventDefault();
        click = false; // don’t drag-draw
         
        textInput.style.left = `${startX}px`;
        textInput.style.top = `${startY}px`;
        textInput.style.font = "20px Arial";
        textInput.style.lineHeight = "20px";
        textInput.value = "";
        textInput.classList.remove("hidden");
        textInput.focus();

        textInput.onblur = () => {
            const val = textInput.value.trim();
            if (val) {
                const ctx = canvas.getContext("2d")!;
                ctx.font = "20px Arial";
                const metrics = ctx.measureText(val);
                const ascent = metrics.actualBoundingBoxAscent || 20;

                const shape: shape = {
                    type: "text",
                    x: startX,
                    y: startY + ascent, 
                    value: val
                };

                saveState(exsistinShape)
                exsistinShape.push(shape);
                clearCtx(ctx, canvas, exsistinShape);

                socket.send(JSON.stringify({
                    type: "chat",
                    message: { shape },
                    roomId
                }));
            }
            textInput.value = "";
            textInput.classList.add("hidden");
        };
    }
        
    })

    canvas.addEventListener("mouseup", (e) => {
        if (!click) return; // Don't process if not clicking (text tool case)
        
        click = false
        const rect = canvas.getBoundingClientRect();
        const width = e.clientX - rect.left - startX;
        const height = e.clientY - rect.top - startY;

        // @ts-ignore
        let selectedTool = window.selectedTool;
        let shape: shape | null = null;
        
       

        if (selectedTool === "rect") {
            shape = {
                type: "rect",
                x: startX,
                y: startY,
                height,
                width
            }
        } else if (selectedTool === "circle") {
            const radius = Math.max(Math.abs(width), Math.abs(height)) / 2
            const centerX = startX + width / 2
            const centerY = startY + height / 2
            shape = {
                type: "circle",
                radius: radius,
                centerX: centerX,
                centerY: centerY,
                startAngle: 0,
                endAngle: Math.PI * 2
            }
        } else if (selectedTool === "line") {
            shape = {
                type: "line",
                startx: startX,
                starty: startY,
                endx: e.clientX - rect.left,
                endy: e.clientY - rect.top
            };
        } else if (selectedTool === "pencil") {
            shape = {
                type: "pencil",
                points: currentPoints
            };
            currentPoints = [];
        }

        if (!shape) {
            return;
        }
        
        saveState(exsistinShape)
        exsistinShape.push(shape);

        clearCtx(ctx, canvas, exsistinShape)

        socket.send(JSON.stringify({
            type: "chat",
            message: {
                shape
            },
            roomId
        }))
    })

    canvas.addEventListener("mousemove", (e) => {
        
        if (click) {
            const rect = canvas.getBoundingClientRect();
            const currentX = e.clientX - rect.left;
            const currentY = e.clientY - rect.top;
            const width = currentX - startX
            const height = currentY - startY
            clearCtx(ctx, canvas, exsistinShape)
            ctx.strokeStyle = "rgba(255,255,255)"
            //@ts-ignore
            const selectedTool = window.selectedTool
            
            if (selectedTool === "rect") {
                ctx.strokeRect(startX, startY, width, height)
            } else if (selectedTool === "circle") {
                const centerX = startX + width / 2
                const centerY = startY + height / 2
                const radius = Math.max(Math.abs(width), Math.abs(height)) / 2
                ctx.beginPath()
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
                ctx.stroke()
                ctx.closePath()
            } else if (selectedTool === "line") {
                ctx.beginPath()
                ctx.moveTo(startX, startY)
                ctx.lineTo(currentX, currentY)
                ctx.stroke()
                ctx.closePath()
            } else if (selectedTool === "pencil") {
                currentPoints.push({x: currentX, y: currentY});
                ctx.beginPath();
                ctx.moveTo(currentPoints[0].x, currentPoints[0].y);
                for (let i = 1; i < currentPoints.length; i++) {
                    ctx.lineTo(currentPoints[i].x, currentPoints[i].y);
                }
                ctx.stroke();
                ctx.closePath();
            }
        }
    })

    function undo() {
        if (undoShape.length === 0) return
        redoShape.push([...exsistinShape.map((s) => ({ ...s }))])
        const prev = undoShape.pop()
        if (prev) {
            exsistinShape = [...prev]
            clearCtx(ctx!, canvas, exsistinShape)
        }
    }

    function redo() {
        if (redoShape.length === 0) return
        undoShape.push([...exsistinShape.map((s) => ({ ...s }))])
        const next = redoShape.pop()
        if (next) {
            exsistinShape = [...next]
            clearCtx(ctx!, canvas, exsistinShape)
        }
    }

    function saveState(existingShapes: shape[]) {
        undoShape.push([...existingShapes.map((s) => ({ ...s }))])
        redoShape = []
    }
    
    return { undo, redo }
}

function clearCtx(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, exsistinShape: shape[]) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    exsistinShape.map((shape) => {
        if (!shape) return; // skip undefined
        
        if (shape.type === "rect") {
            ctx.strokeStyle = "rgba(255, 255, 255)"
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        } else if (shape.type === "circle") {
            ctx.strokeStyle = "rgba(255, 255, 255)"
            ctx.beginPath();
            ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
        } else if (shape.type === "line") {
            ctx.strokeStyle = "rgba(255, 255, 255)"
            ctx.beginPath()
            ctx.moveTo(shape.startx, shape.starty)
            ctx.lineTo(shape.endx, shape.endy)
            ctx.stroke()
            ctx.closePath()
        } else if (shape.type === "pencil") {
            ctx.strokeStyle = "rgba(255, 255, 255)"
            ctx.beginPath();
            ctx.moveTo(shape.points[0].x, shape.points[0].y);
            for (let i = 1; i < shape.points.length; i++) {
                ctx.lineTo(shape.points[i].x, shape.points[i].y);
            }
            ctx.stroke();
            ctx.closePath();
        } else if (shape.type === "text") {
            ctx.font = "20px Arial";
            ctx.fillStyle = "white";
            ctx.textBaseline = "alphabetic";
            ctx.fillText(shape.value, shape.x, shape.y);
        }
        
    })
}

async function getExistingShape(roomId: string) {
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`)
    const messages = res.data.message

    const shapes = messages.map((x: {message: string}) => {
        const messageData = JSON.parse(x.message)
        return messageData.shape
    })
    return shapes
}

