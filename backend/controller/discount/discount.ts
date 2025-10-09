import { Response, Router } from "express";
import { addCode, deleteCode, getAllCode, updateCode } from "../../models/discount";
import { getUserByID } from "../../models/user";

const router = Router();

router.get("/getAllCode", async (req: any, res: Response) => {
	console.log("call get discount");
	try {
		const { id } = req.auth;
		const user = await getUserByID(id);

		if (!user || user.role !== "admin") {
			return res.status(403).json({ status: false, message: "Forbidden" });
		}

		const code = await getAllCode();
		res.json({ status: true, data: code });
	} catch (err) {
		console.error("❌ Error /admin/discount:", err);
		res.status(500).json({ status: false, message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
	}
});
router.post("/addCode", async (req: any, res: Response) => {
	try {
		const { id } = req.auth || {};
		if (!id) {
			return res.status(401).json({ status: false, message: "Unauthorized: missing id" });
		}

		const user = await getUserByID(id);
		if (!user || user.role !== "admin") {
			return res.status(403).json({ status: false, message: "Forbidden" });
		}

		let { code, amount, count, date } = req.body;

		if (!code || !amount || !count || !date) {
			return res.status(400).json({ status: false, message: "กรอกข้อมูลไม่ครบ" });
		}

		const expireDate = new Date(date);
		expireDate.setHours(23, 59, 59, 0);

		// แปลงให้เป็น YYYY-MM-DD HH:MM:SS
		const formattedExpire = expireDate.toISOString().slice(0, 19).replace("T", " ");

		await addCode(code, amount, count, formattedExpire);

		res.json({ status: true, message: "เพิ่มโค้ดส่วนลดเรียบร้อย" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ status: false, message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์", debug: String(err) });
	}
});


router.put("/updateCode/:cid", async (req: any, res: Response) => {
	try {
		const { id } = req.auth;
		const user = await getUserByID(id);
		if (!user || user.role !== "admin") {
			return res.status(403).json({ status: false, message: "Forbidden" });
		}

		const { cid } = req.params;
		const { code, amount, count, date } = req.body;

		if (!code || !amount || !count || !date) {
			return res.status(400).json({ status: false, message: "กรอกข้อมูลไม่ครบ" });
		}

		await updateCode(Number(cid), code, amount, count, date);
		res.json({ status: true, message: "อัปเดตโค้ดส่วนลดเรียบร้อย" });
	} catch (err) {
		console.error("❌ Error /discount/updateCode:", err);
		res.status(500).json({ status: false, message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
	}
});

router.delete("/deleteCode/:cid", async (req: any, res: Response) => {
	try {
		const { id } = req.auth;
		const user = await getUserByID(id);
		if (!user || user.role !== "admin") {
			return res.status(403).json({ status: false, message: "Forbidden" });
		}

		const { cid } = req.params;
		if (!cid) {
			return res.status(400).json({ status: false, message: "ไม่พบรหัสโค้ดส่วนลด" });
		}

		await deleteCode(Number(cid));
		res.json({ status: true, message: "ลบโค้ดส่วนลดเรียบร้อย" });
	} catch (err) {
		console.error("❌ Error /discount/deleteCode:", err);
		res.status(500).json({ status: false, message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
	}
});


export default router;
