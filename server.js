import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 默认路由测试
app.get("/", (req, res) => {
  res.json({ message: "✅ API is running!" });
});

// 使用 Zeabur/Vercel 自动分配端口
const PORT = process.env.PORT || 3000;

// 仅当本地运行时才监听端口
if (process.env.ZEABUR_ENVIRONMENT !== "production") {
  app.listen(PORT, () => console.log(`Server running locally on port ${PORT}`));
}

// 导出 app（Zeabur 需要）
export default app;


