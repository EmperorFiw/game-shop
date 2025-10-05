import bcrypt from "bcrypt";
import crypto from "crypto";
import { Router } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { checkUserExists, createUser } from "../../models/user";
import { generateToken } from "./authen";

const router = Router();
const upload = multer({ dest: "tmp/" });

router.post("/register", upload.single("profileImage"), async (req, res) => {
	try {
		const { username, email, password } = req.body;
		const file = req.file;

		if (!username || !email || !password) {
			if (file) fs.unlinkSync(file.path);
			return res.status(400).json({ status: false, message: "ข้อมูลไม่ครบ" });
		}

		// ตรวจว่าซ้ำไหม
		const exists = await checkUserExists(username, email);
		if (exists) {
			if (file) fs.unlinkSync(file.path);
			return res.json({ status: false, message: "Email หรือ Username นี้ถูกใช้งานแล้ว" });
		}

		// เข้ารหัสรหัสผ่าน
		const hashedPassword = await bcrypt.hash(password, 10);

		// Default รูปโปรไฟล์
		let profileImage: string = "/uploads/default.jpg";

		if (file) {
			const uploadsDir = path.join(__dirname, "../../uploads/img");
			if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

			const ext = path.extname(file.originalname).toLowerCase();
			const uniqueName = `${crypto.randomUUID()}${ext}`; 
			const newPath = path.join(uploadsDir, uniqueName);

			fs.renameSync(file.path, newPath);

			profileImage = "/uploads/img/" + uniqueName;
		}

		await createUser(username, email, hashedPassword, profileImage);

		const payload = {
			username,
			email,
			profileImage,
			money: 0,
			role: "member"
		};

		const token = generateToken(payload);

		return res.json({
			status: true,
			message: "สมัครสมาชิกสำเร็จ",
			token,
			user: payload
		});
	} catch (err) {
		console.error("DB Error:", err);
		if (req.file) fs.unlinkSync(req.file.path);
		return res.status(500).json({ status: false, message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
	}
});

export default router;
