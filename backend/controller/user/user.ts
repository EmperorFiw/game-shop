import crypto from "crypto";
import { Response, Router } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { addDepositHistory, depositMoney } from "../../models/game";
import { getUserIDByName, getUserInfo, getUserNameByID, updateUserProfile, User } from "../../models/user";


const router = Router();
const upload = multer({ dest: "tmp/" }); // เก็บไฟล์ชั่วคราวใน tmp/

// -----------------------------------
// 🔹 ดึงข้อมูลผู้ใช้ปัจจุบัน
// -----------------------------------
router.get("/me", async (req: any, res: Response) => {
	try {
		const { username } = req.auth;
		const user = (await getUserInfo(username)) as User | null;

		if (!user) {
			return res.status(404).json({ status: false, message: "ไม่พบผู้ใช้" });
		}

		return res.json({ status: true, user });
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
		const { username } = req.auth;
		const { amount } = req.body;

		if (!amount || amount <= 0) {
			return res
				.status(400)
				.json({ status: false, message: "จำนวนเงินไม่ถูกต้อง" });
		}

		const uid = await getUserIDByName(username);
		if (!uid) {
			return res
				.status(404)
				.json({ status: false, message: "ไม่พบผู้ใช้" });
		}

		await depositMoney(username, amount);
		await addDepositHistory(uid, amount);

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
router.post("/update", upload.single("avatar"), async (req: any, res: Response) => {
	try {
		const { uid: id } = req.auth;
		const { username, email, balance } = req.body;
		const file = req.file;

		//  ดึงข้อมูลผู้ใช้เดิม
		const oldUser = (await getUserNameByID(id)) as User | null;
		if (!oldUser) {
			if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
			return res.status(404).json({ status: false, message: "ไม่พบผู้ใช้" });
		}

		let avatarPath: string = oldUser.profile_image || "/uploads/default.jpg";

		//  ถ้ามีการอัปโหลดรูปใหม่
		if (file) {
			const uploadsDir = path.join(__dirname, "../../uploads/img");
			if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

			// ลบรูปเก่า (ถ้ามี)
			if (oldUser.profile_image && oldUser.profile_image !== "/uploads/default.jpg") {
				const oldPath = path.join(__dirname, "../../", oldUser.profile_image);
				if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
			}

			//  ตั้งชื่อไฟล์ใหม่แบบไม่ซ้ำแน่นอน
			const ext = path.extname(file.originalname).toLowerCase();
			const uniqueName = `${crypto.randomUUID()}${ext}`;
			const newPath = path.join(uploadsDir, uniqueName);

			fs.renameSync(file.path, newPath);
			avatarPath = "/uploads/img/" + uniqueName;
		}

		//  อัปเดตข้อมูลในฐานข้อมูล
		await updateUserProfile(username, {
			username,
			email,
			balance: Number(balance),
			avatar: avatarPath
		});

		return res.json({
			status: true,
			message: "อัปเดตข้อมูลสำเร็จ",
			avatar: avatarPath
		});
	} catch (err) {
		console.error("❌ Error /update:", err);
		if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
		res
			.status(500)
			.json({ status: false, message: "อัปเดตข้อมูลไม่สำเร็จ" });
	}
});

export default router;
