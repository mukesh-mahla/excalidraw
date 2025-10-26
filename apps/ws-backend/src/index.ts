import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import Jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECERET } from "@repo/backend-common/config";
import { prisma } from "@repo/db/client";

dotenv.config();

const app = express();
const server = createServer(app);

const PORT = process.env.PORT || 8080;

// create WS server attached to HTTP server
const wss = new WebSocketServer({ server });

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users: User[] = [];

function authUser(token: string): string | null {
  try {
    const decoded = Jwt.verify(token, JWT_SECERET);
    if (typeof decoded === "string") return null;
    if (!decoded || !(decoded as JwtPayload).id) return null;
    return (decoded as JwtPayload).id as string;
  } catch (e) {
    return null;
  }
}

wss.on("connection", (ws, request) => {
  console.log("New client connected");
  const url = request.url;
  if (!url) return;

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") ?? "";
  const userId = authUser(token);

  if (!userId) {
    ws.close();
    return;
  }
  console.log("User authenticated:")

  users.push({ userId, rooms: [], ws });

  ws.on("message", async (data) => {
    const parseData = JSON.parse(data.toString());

    if (parseData.type === "join_room") {
      const user = users.find((x) => x.ws === ws);
      user?.rooms.push(parseData.roomId);
    }

    if (parseData.type === "leave_room") {
      const user = users.find((x) => x.ws === ws);
      if (!user) return;
      user.rooms = user.rooms.filter((x) => x !== parseData.roomId);
    }

    if (parseData.type === "chat") {
      const { roomId, message } = parseData;

      await prisma.chat.create({
        data: {
          roomId: Number(roomId),
          message: JSON.stringify(message),
          userId,
        },
      });

      users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(
            JSON.stringify({ type: "chat", message, roomId })
          );
        }
      });
    }
  });
});

// health check route for Render


server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
