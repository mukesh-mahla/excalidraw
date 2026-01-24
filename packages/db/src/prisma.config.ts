import "dotenv/config";
import { defineConfig } from "prisma/config";
const DATABASE_URL = process.env.DATABASE_URL;

console.log("DATABASE_URL =", DATABASE_URL);
export default defineConfig({
  datasource: {
    url: DATABASE_URL,
  },
});
