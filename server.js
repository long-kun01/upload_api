import express from "express";
import cors from "cors";
import multer from "multer";
import { MongoClient } from "mongodb";

const app = express();
app.use(cors());
app.use(express.json());

// Multer 内存存储
const storage = multer.memoryStorage();
const upload = multer({ storage });

// MongoDB 连接
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// 测试接口
app.get("/", (req, res) => {
  res.json({ message: "✅ API is running and connected to MongoDB!" });
});

// 上传接口
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    await client.connect();
    const db = client.db("dejiuweb");
    const collection = db.collection("uploads");

    const record = {
      filename: req.file?.originalname || null,
      size: req.file?.size || 0,
      uploadTime: new Date(),
    };

    await collection.insertOne(record);
    res.json({ success: true, message: "上传成功", data: record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "上传失败", error: err.message });
  } finally {
    await client.close();
  }
});

// 🚫 不再使用 app.listen()
// ✅ 导出 Express 实例，让 Vercel 作为 Serverless Function 使用
export default app;


