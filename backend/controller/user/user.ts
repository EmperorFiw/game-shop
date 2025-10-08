import crypto from "crypto";
import { Response, Router } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { db } from "../../db/db";
import { addDepositHistory, depositMoney } from "../../models/game";
import { getAllHistory } from "../../models/purchase";
import { getUserByID, getUserNameByID, updateUserProfile, User } from "../../models/user";


const router = Router();
const upload = multer({ dest: "tmp/" }); // เก็บไฟล์ชั่วคราวใน tmp/

// -----------------------------------
// 🔹 ดึงข้อมูลผู้ใช้ปัจจุบัน
// -----------------------------------
router.get("/me", async (req: any, res: Response) => {
	try {
		const { id } = req.auth;
		const user = (await getUserByID(id)) as User | null;

		if (!user) {
			return res.status(404).json({ status: false, message: "ไม่พบผู้ใช้" });
		}

		const formattedUser = {
			id: user.id,
			username: user.username,
			profileImage: user.profile_image,
			email: user.email,
			money: user.money,
			role: user.role
		};

		return res.json({ status: true, user: formattedUser });
	} catch (err) {
		console.error("❌ Error /me:", err);
		return res
			.status(500)
			.json({ status: false, message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
	}
});


// -----------------------------------
// 💰 เติมเงิน
// -----------------------------------
router.post("/deposit", async (req: any, res: Response) => {
	try {
		const { id } = req.auth;
		const { amount } = req.body;
		const username = await getUserNameByID(id);
		
		if (!username) {
			return res.status(404).json({ status: false, message: "ไม่พบผู้ใช้" });
		}

		if (!amount || amount <= 0) {
			return res
				.status(400)
				.json({ status: false, message: "จำนวนเงินไม่ถูกต้อง" });
		}

		if (!id) {
			return res
				.status(404)
				.json({ status: false, message: "ไม่พบผู้ใช้" });
		}

		await depositMoney(username, amount);
		await addDepositHistory(id, amount);

		return res.json({
			status: true,
			message: `เติมเงิน ${amount} บาทสำเร็จ`
		});
	} catch (err) {
		console.error("❌ Error /deposit:", err);
		return res
			.status(500)
			.json({ status: false, message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
	}
});

// -----------------------------------
// 🧍‍♂️ อัปเดตข้อมูลผู้ใช้ + รองรับอัปโหลดรูป
// -----------------------------------
router.put("/update", upload.single("avatar"), async (req: any, res: Response) => {
	try {
		const { id } = req.auth;
		const { username, email } = req.body;
		const file = req.file;

		const oldUser = await getUserByID(id);
		if (!oldUser) {
			if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
			return res.status(404).json({ status: false, message: "ไม่พบผู้ใช้" });
		}

		// ตรวจสอบความถูกต้องของชื่อผู้ใช้
		const safeUsername = username?.trim();
		if (!safeUsername || /[<>]/.test(safeUsername)) {
			if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
			return res.status(400).json({ status: false, message: "ชื่อผู้ใช้ไม่ถูกต้อง" });
		}

		// ตรวจสอบอีเมล
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const safeEmail = email?.trim();
		if (!safeEmail || !emailRegex.test(safeEmail)) {
			if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
			return res.status(400).json({ status: false, message: "อีเมลไม่ถูกต้อง" });
		}

		let avatarPath: string | null = null;

		if (file) {
			const ext = path.extname(file.originalname).toLowerCase();
			const allowedExts = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
			if (!allowedExts.includes(ext)) {
				fs.unlinkSync(file.path);
				return res.status(400).json({ status: false, message: "ประเภทไฟล์ไม่ถูกต้อง" });
			}

			const uploadsDir = path.join(__dirname, "../../uploads/img");
			if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

			if (oldUser.profile_image && oldUser.profile_image !== "/uploads/default.jpg") {
				const oldPath = path.join(__dirname, "../../", oldUser.profile_image);
				if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
			}

			const uniqueName = `${crypto.randomUUID()}${ext}`;
			const newPath = path.join(uploadsDir, uniqueName);
			fs.renameSync(file.path, newPath);
			avatarPath = "/uploads/img/" + uniqueName;
		}

		const updateData: any = {
			username: safeUsername,
			email: safeEmail
		};

		if (avatarPath) updateData.profile_image = avatarPath;

		await updateUserProfile(id, updateData);

		return res.json({
			status: true,
			message: "อัปเดตข้อมูลสำเร็จ",
			avatar: avatarPath || oldUser.profile_image
		});
	} catch (err) {
		if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
		return res.status(500).json({ status: false, message: "อัปเดตข้อมูลไม่สำเร็จ" });
	}
});

router.get("/history/all", async (req: any, res: Response) => {
	try {
		const { id } = req.auth;
		if (!getUserByID(id)) return res.status(401).json({ status: false, message: "Forbidden" });

		const history = await getAllHistory(id);

		res.json({
			status: true,
			data: history
		});
	} catch (err) {
		console.error("❌ Error /history:", err);
		res.status(500).json({ status: false, message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
	}
});


router.get("/history/game", async (req: any, res: Response) => {
	try {
		const { id } = req.auth;
		const user = await getUserByID(id);
		if (!user) {
			return res.status(401).json({ status: false, message: "Forbidden" });
		}

		const [rows]: any = await db.query(
			`SELECT g.* FROM purchase_history p
			 JOIN games g ON g.id = p.game_id
			 WHERE p.uid = ?
			 ORDER BY p.created_at DESC`,
			[id]
		);

		res.json({ status: true, data: rows });
	} catch (err) {
		console.error("❌ Error /history/game:", err);
		res.status(500).json({
			status: false,
			message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์"
		});
	}
});


export default router;
