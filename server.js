import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "✅ API is running!" });
});

// ❌ 不要使用 app.listen()
// ✅ 在 Vercel 上导出 app 即可
export default app;


