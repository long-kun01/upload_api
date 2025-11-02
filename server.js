import express from "express";
import cors from "cors";
import multer from "multer";
import { MongoClient } from "mongodb";

const app = express();
app.use(cors());
app.use(express.json());

// ===== MongoDB 连接配置 =====
const uri = process.env.MONGODB_URI; // 从 Zeabur 环境变量中读取
const client = new MongoClient(uri);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("dejiu_database"); // 你可以换成自己的库名
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}
connectDB();

// ===== 上传文件配置 =====
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ===== 上传接口 =====
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const collection = db.collection("uploads");
    await collection.insertOne({
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      uploadDate: new Date()
    });

    res.json({ message: "✅ File info saved to MongoDB" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// ===== 测试接口 =====
app.get("/", (req, res) => {
  res.json({ message: "✅ API running and connected to MongoDB" });
});

// ===== 启动服务 =====
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));



