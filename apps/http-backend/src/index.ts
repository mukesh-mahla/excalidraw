import dotenv from "dotenv"
import  express  from "express";
import userRouter from "./routes/user"
import cors from "cors"
dotenv.config()
const app = express();

app.use(cors())
app.use(express.json())
app.use("/api/v1/",userRouter)
const PORT = Number(process.env.PORT) || 4000
app.listen(PORT)