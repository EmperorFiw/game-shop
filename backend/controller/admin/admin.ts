import { Response, Router } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { addGame, deleteGame, getAllGames, getAllTransactions, updateGame } from "../../models/admin";
import { getUserByID } from "../../models/user";

const router = Router();

//  ตั้งค่า upload path
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const dir = path.join(__dirname, "../../uploads/game");
		if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
		cb(null, dir);
	},
	filename: (req, file, cb) => {
		const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
		cb(null, uniqueName);
	}
});
const upload = multer({ storage });

//  ดึงรายการเกมทั้งหมด
router.get("/games", async (req: any, res: Response) => {
	try {
		const { id } = req.auth;
		const user = await getUserByID(id);

		if (!user || user.role !== "admin") {
			return res.status(403).json({ status: false, message: "ไม่มีสิทธิ์เข้าถึง (Admin เท่านั้น)" });
		}

		const games = await getAllGames();
		res.json({ status: true, data: games });
	} catch (err) {
		console.error("❌ Error /admin/games:", err);
		res.status(500).json({ status: false, message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
	}
});

//  เพิ่มเกมใหม่
router.post("/add-game", upload.single("image"), async (req: any, res: Response) => {
	try {
		const { id } = req.auth;
		const user = await getUserByID(id);

		if (!user || user.role !== "admin") {
			return res.status(403).json({ status: false, message: "ไม่มีสิทธิ์เข้าถึง (Admin เท่านั้น)" });
		}

		const { name, price, category, description } = req.body;
		if (!req.file) return res.status(400).json({ status: false, message: "กรุณาอัปโหลดรูปภาพเกม" });

		const imagePath = `/uploads/game/${req.file.filename}`;
		await addGame(name, description, price, category, imagePath);

		res.json({ status: true, message: "เพิ่มเกมสำเร็จ" });
	} catch (err) {
		console.error("❌ Error /admin/add-game:", err);
		res.status(500).json({ status: false, message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
	}
});

//  อัปเดตข้อมูลเกม
router.put("/update-game/:id", upload.single("image"), async (req: any, res: Response) => {
	try {
		const { id: uid } = req.auth;
		const user = await getUserByID(uid);

		if (!user || user.role !== "admin") {
			return res.status(403).json({ status: false, message: "ไม่มีสิทธิ์เข้าถึง (Admin เท่านั้น)" });
		}

		const id = parseInt(req.params.id);
		const { name, price, category, description } = req.body;
		const imagePath = req.file ? `/uploads/game/${req.file.filename}` : undefined;

		await updateGame(id, name, description, price, category, imagePath);

		res.json({ status: true, message: "อัปเดตข้อมูลเกมสำเร็จ" });
	} catch (err) {
		console.error("❌ Error /admin/update-game:", err);
		res.status(500).json({ status: false, message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
	}
});

//  ลบเกม
router.delete("/delete-game/:id", async (req: any, res: Response) => {
	try {
		const { id: uid } = req.auth;
		const user = await getUserByID(uid);

		if (!user || user.role !== "admin") {
			return res.status(403).json({ status: false, message: "ไม่มีสิทธิ์เข้าถึง (Admin เท่านั้น)" });
		}

		const id = parseInt(req.params.id);
		await deleteGame(id);

		res.json({ status: true, message: "ลบเกมสำเร็จ" });
	} catch (err) {
		console.error("❌ Error /admin/delete-game:", err);
		res.status(500).json({ status: false, message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
	}
});

//  ประวัติธุรกรรม
router.get("/transactions", async (req: any, res: Response) => {
	try {
		const { id } = req.auth;
		const user = await getUserByID(id);

		if (!user || user.role !== "admin") {
			return res.status(403).json({ status: false, message: "Forbidden" });
		}

		const rows = await getAllTransactions();
		res.json({ status: true, data: rows });
	} catch (err) {
		console.error("❌ Error /admin/transactions:", err);
		res.status(500).json({ status: false, message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
	}
});

export default router;
