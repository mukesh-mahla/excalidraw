import axios from "axios";

const HTTP_BACKEND = process.env.NEXT_PUBLIC_HTTP_BACKEND;

type Shape =
  | { type: "rect"; x: number; y: number; width: number; height: number }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
      startAngle: number;
      endAngle: number;
    }
  | { type: "line"; startx: number; starty: number; endx: number; endy: number }
  | {
      type: "pencil";
      points: { x: number; y: number }[];
      minX: number;
      maxX: number;
      minY: number;
      maxY: number;
    }
  | { type: "text"; x: number; y: number; value: string };

interface camara {
  x: number;
  y: number;
  scale: number;
}

export class DrawingCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private socket: WebSocket;
  private roomId: string;
  private Camara: camara;
  private existingShapes: Shape[] = [];
  private undoStack: Shape[][] = [];
  private redoStack: Shape[][] = [];
  private currentTool: string = "circle";

  private isPanning = false;
  private lastPanX = 0;
  private lastPanY = 0;

  setTool(tool: string) {
    this.currentTool = tool;
  }
  private isDrawing = false;
  private startX = 0;
  private startY = 0;
  private currentPoints: { x: number; y: number }[] = [];

  private textInput: HTMLTextAreaElement | null = null;

  private constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    roomId: string,
    socket: WebSocket,
    Camara: camara,
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.roomId = roomId;
    this.socket = socket;
    this.Camara = Camara;
  }

  // Factory method — async so we can fetch existing shapes before binding events
  static async init(
    canvas: HTMLCanvasElement,
    roomId: string,
    socket: WebSocket,
    textInput: HTMLTextAreaElement | null,
    Camara: camara,
  ) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas 2D context");

    const instance = new DrawingCanvas(canvas, ctx, roomId, socket, Camara);
    instance.existingShapes = await getExistingShapes(roomId);
    instance.textInput = textInput;

    instance.render();

    instance.bindSocketListener();
    instance.bindMouseEvents();

    return instance;
  }

  private handleWheel = (e: WheelEvent) => {
    e.preventDefault(); // Stop page from scrolling

    // Update camera coordinates
    this.Camara.x -= e.deltaX;
    this.Camara.y -= e.deltaY;
    this.onZoomChangeCallback?.(this.Camara.scale);
    this.render();
  };

  private zoom(factor: number, centerX?: number, centerY?: number) {
    // default → center of canvas
    const cx = centerX ?? this.canvas.width / 2;
    const cy = centerY ?? this.canvas.height / 2;

    // convert screen → world
    const worldX = (cx - this.Camara.x) / this.Camara.scale;
    const worldY = (cy - this.Camara.y) / this.Camara.scale;

    // apply zoom
    this.Camara.scale *= factor;

    // clamp
    this.Camara.scale = Math.max(0.1, Math.min(5, this.Camara.scale));

    // adjust camera to keep center stable
    this.Camara.x = cx - worldX * this.Camara.scale;
    this.Camara.y = cy - worldY * this.Camara.scale;
    this.onZoomChangeCallback?.(this.Camara.scale);
    this.render();
  }
  private onZoomChangeCallback: ((z: number) => void) | null = null;

  // ─── Public API ───────────────────────────────────────────────────────────

  undo() {
    if (this.undoStack.length === 0) return;
    this.redoStack.push(this.cloneShapes(this.existingShapes));
    const prev = this.undoStack.pop()!;
    this.existingShapes = prev;
    this.render();
  }

  redo() {
    if (this.redoStack.length === 0) return;
    this.undoStack.push(this.cloneShapes(this.existingShapes));
    const next = this.redoStack.pop()!;
    this.existingShapes = next;
    this.render();
  }

  destroy() {
    this.canvas.removeEventListener("wheel", this.handleWheel);
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    this.canvas.removeEventListener("mouseup", this.handleMouseUp);
    this.canvas.removeEventListener("dblclick", this.handleDoubleClick);
  }
  zoomIn() {
    this.zoom(1.05);
  }

  zoomOut() {
    this.zoom(1 / 1.05);
  }

  resetZoom() {
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;

    // world point currently at screen center
    const worldX = (cx - this.Camara.x) / this.Camara.scale;
    const worldY = (cy - this.Camara.y) / this.Camara.scale;

    // reset scale to 1
    this.Camara.scale = 1;

    // keep that same world point at screen center
    this.Camara.x = cx - worldX;
    this.Camara.y = cy - worldY;

    this.onZoomChangeCallback?.(1);
    this.render();
  }
  // Public method to register the callback
  onZoomChange(cb: (z: number) => void) {
    this.onZoomChangeCallback = cb;
  }
  // ──────────────────────────────────────────────────────────────

  // ─── Private helpers ──────────────────────────────────────────────────────

  private get selectedTool(): string {
    return this.currentTool;
  }
  private saveState() {
    this.undoStack.push(this.cloneShapes(this.existingShapes));
    this.redoStack = [];
  }

  private cloneShapes(shapes: Shape[]): Shape[] {
    return shapes.map((s) => ({ ...s }));
  }

  private addShape(shape: Shape) {
    this.saveState();
    this.existingShapes.push(shape);
    this.render();
    this.sendShape(shape);
  }

  private sendShape(shape: Shape) {
    if (this.socket.readyState !== WebSocket.OPEN) {
      alert("WebSocket is not connected.");
      return;
    }
    this.socket.send(
      JSON.stringify({ type: "chat", message: { shape }, roomId: this.roomId }),
    );
  }

  public render() {
    clearCtx(this.ctx, this.canvas, this.existingShapes, this.Camara);
  }

  // ─── Event binding ────────────────────────────────────────────────────────

  private bindSocketListener() {
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "chat") {
        this.existingShapes.push(message.message.shape);
        this.render();
      }
    });
  }

  private bindMouseEvents() {
    this.canvas.addEventListener("wheel", this.handleWheel, { passive: false });
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.addEventListener("dblclick", this.handleDoubleClick);
  }

  private handleMouseDown = (e: MouseEvent) => {
    if (this.selectedTool === "drag") {
      this.canvas.style.cursor = "grabbing";
      this.isPanning = true;
      this.lastPanX = e.clientX;
      this.lastPanY = e.clientY;
      return;
    }
    if (this.selectedTool === "drag") return;
    const { x, y } = this.getMouseWorldPos(e);
    this.startX = x;
    this.startY = y;
    this.isDrawing = true;

    if (this.selectedTool === "pencil") {
      this.currentPoints = [{ x, y }];
    }
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (this.isPanning) {
      const dx = e.clientX - this.lastPanX;
      const dy = e.clientY - this.lastPanY;

      this.Camara.x += dx;
      this.Camara.y += dy;

      this.lastPanX = e.clientX;
      this.lastPanY = e.clientY;

      this.render();
      return;
    }
    if (!this.isDrawing) return;

    const { x, y } = this.getMouseWorldPos(e);
    const width = x - this.startX;
    const height = y - this.startY;

    this.render();
    this.ctx.save();

    this.ctx.setTransform(
      this.Camara.scale,
      0,
      0,
      this.Camara.scale,
      this.Camara.x,
      this.Camara.y,
    );
    this.ctx.strokeStyle = "rgba(75,85,99,1)";

    switch (this.selectedTool) {
      case "rect":
        this.ctx.strokeRect(this.startX, this.startY, width, height);
        break;
      case "circle": {
        const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
        const cx = this.startX + width / 2;
        const cy = this.startY + height / 2;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();
        break;
      }
      case "line":
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        this.ctx.closePath();
        break;
      case "pencil":
        this.currentPoints.push({ x, y });
        this.ctx.beginPath();
        this.ctx.moveTo(this.currentPoints[0].x, this.currentPoints[0].y);
        for (let i = 1; i < this.currentPoints.length; i++) {
          this.ctx.lineTo(this.currentPoints[i].x, this.currentPoints[i].y);
        }
        this.ctx.stroke();
        this.ctx.closePath();
        break;
    }
    this.ctx.restore();
  };

  private handleMouseUp = (e: MouseEvent) => {
    if (this.selectedTool === "drag") {
      this.canvas.style.cursor = "crosshair";
      this.isPanning = false;
    }
    if (!this.isDrawing) return;
    this.isDrawing = false;

    const { x, y } = this.getMouseWorldPos(e);
    const width = x - this.startX;
    const height = y - this.startY;
    let shape: Shape | null = null;

    switch (this.selectedTool) {
      case "rect":
        shape = { type: "rect", x: this.startX, y: this.startY, width, height };
        break;
      case "circle":
        shape = {
          type: "circle",
          radius: Math.max(Math.abs(width), Math.abs(height)) / 2,
          centerX: this.startX + width / 2,
          centerY: this.startY + height / 2,
          startAngle: 0,
          endAngle: Math.PI * 2,
        };
        break;
      case "line":
        shape = {
          type: "line",
          startx: this.startX,
          starty: this.startY,
          endx: x,
          endy: y,
        };
        break;
      case "pencil": {
        const points = this.currentPoints;

        const xs = points.map((p) => p.x);
        const ys = points.map((p) => p.y);

        shape = {
          type: "pencil",
          points,
          minX: Math.min(...xs),
          maxX: Math.max(...xs),
          minY: Math.min(...ys),
          maxY: Math.max(...ys),
        };

        this.currentPoints = [];
        break;
      }
    }

    if (shape) this.addShape(shape);
  };

  private handleDoubleClick = (e: MouseEvent) => {
    if (this.selectedTool !== "text" || !this.textInput) return;
    if (!this.textInput.classList.contains("hidden")) return;

    const { x, y } = this.getMouseWorldPos(e);
    e.preventDefault();
    this.isDrawing = false;
    const screenX = x * this.Camara.scale + this.Camara.x;
    const screenY = y * this.Camara.scale + this.Camara.y;
    Object.assign(this.textInput.style, {
      left: `${screenX}px`,
      top: `${screenY}px`,
      font: "20px Arial",
      lineHeight: "20px",
      color: "black",
      caretColor: "black",
    });

    this.textInput.value = "";
    this.textInput.classList.remove("hidden");
    this.textInput.focus();
    this.textInput.onblur = () => this.finalizeText(x, y);
  };

  private finalizeText(startX: number, startY: number) {
    const val = this.textInput?.value.trim();
    if (val) {
      this.ctx.font = "20px Arial";
      const metrics = this.ctx.measureText(val);
      const ascent = metrics.actualBoundingBoxAscent || 20;
      this.addShape({
        type: "text",
        x: startX,
        y: startY + ascent,
        value: val,
      });
    }
    if (this.textInput) {
      this.textInput.value = "";
      this.textInput.classList.add("hidden");
    }
  }

  private getMouseWorldPos(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    // 1. Get position relative to canvas (Screen Space)
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;

    // 2. Adjust for camera (World Space = Screen - Camera)
    return {
      x: (screenX - this.Camara.x) / this.Camara.scale,
      y: (screenY - this.Camara.y) / this.Camara.scale,
    };
  }
}

// ─── Module-level helpers ────────────────────────────────────────────────────

function clearCtx(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  shapes: Shape[],
  Camara: camara,
) {
  const padding = 100;

  const viewLeft = -Camara.x / Camara.scale - padding;
  const viewTop = -Camara.y / Camara.scale - padding;

  const viewRight = viewLeft + canvas.width / Camara.scale + padding * 2;
  const viewBottom = viewTop + canvas.height / Camara.scale + padding * 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255,248,220,1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.setTransform(Camara.scale, 0, 0, Camara.scale, Camara.x, Camara.y);

  for (const shape of shapes) {
    if (!shape) continue;
    if (!isVisible(shape, viewLeft, viewTop, viewRight, viewBottom)) {
      continue; //  skip rendering
    }
    ctx.strokeStyle = "rgba(75,85,99,1)";

    switch (shape.type) {
      case "rect":
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        break;
      case "circle":
        ctx.beginPath();
        ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
        break;
      case "line":
        ctx.beginPath();
        ctx.moveTo(shape.startx, shape.starty);
        ctx.lineTo(shape.endx, shape.endy);
        ctx.stroke();
        ctx.closePath();
        break;
      case "pencil":
        if (shape.points.length === 0) break;
        ctx.beginPath();
        ctx.moveTo(shape.points[0].x, shape.points[0].y);
        for (let i = 1; i < shape.points.length; i++)
          ctx.lineTo(shape.points[i].x, shape.points[i].y);
        ctx.stroke();
        ctx.closePath();
        break;
      case "text":
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(shape.value, shape.x, shape.y);
        break;
    }
  }
  ctx.restore();
}

async function getExistingShapes(roomId: string): Promise<Shape[]> {
  const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
  return res.data.message.map(
    (x: { message: string }) => JSON.parse(x.message).shape,
  );
}

function isVisible(
  shape: Shape,
  left: number,
  top: number,
  right: number,
  bottom: number,
): boolean {
  switch (shape.type) {
    case "rect": {
      const minX = Math.min(shape.x, shape.x + shape.width);
      const maxX = Math.max(shape.x, shape.x + shape.width);
      const minY = Math.min(shape.y, shape.y + shape.height);
      const maxY = Math.max(shape.y, shape.y + shape.height);

      return !(maxX < left || minX > right || maxY < top || minY > bottom);
    }

    case "circle":
      return !(
        shape.centerX + shape.radius < left ||
        shape.centerX - shape.radius > right ||
        shape.centerY + shape.radius < top ||
        shape.centerY - shape.radius > bottom
      );

    case "line":
      return !(
        Math.max(shape.startx, shape.endx) < left ||
        Math.min(shape.startx, shape.endx) > right ||
        Math.max(shape.starty, shape.endy) < top ||
        Math.min(shape.starty, shape.endy) > bottom
      );

    case "pencil":
      return !(
        shape.maxX < left ||
        shape.minX > right ||
        shape.maxY < top ||
        shape.minY > bottom
      );

    case "text":
      const padding = 50;
      return !(
        shape.x + padding < left ||
        shape.x - padding > right ||
        shape.y + padding < top ||
        shape.y - padding > bottom
      );
  }
}
