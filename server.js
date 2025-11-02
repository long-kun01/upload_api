import express from "express";
import cors from "cors";
import multer from "multer";
import { MongoClient } from "mongodb";

const app = express();
app.use(cors());
app.use(express.json());

// 使用 Multer 临时存文件（Vercel 只支持内存模式）
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 读取环境变量中的 MongoDB URI
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// 测试接口
app.get("/", (req, res) => {
  res.json({ message: "✅ API is running and ready for upload!" });
});

// 上传接口
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    await client.connect();
    const db = client.db("dejiuweb");
    const collection = db.collection("uploads");

    const record = {
      filename: req.file ? req.file.originalname : null,
      size: req.file ? req.file.size : 0,
      uploadTime: new Date(),
    };

    await collection.insertOne(record);

    res.json({ success: true, message: "上传成功", data: record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "上传失败" });
  } finally {
    await client.close();
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));

