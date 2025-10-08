import bcrypt from "bcrypt";
import { Router } from "express";
import { getUserByEmail } from "../../models/user";
import { generateToken } from "./authen";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if ((!email) || !password) {
      return res.status(400).json({ status: false, message: "กรอกข้อมูลไม่ครบ" });
    }

    // ดึง user
    const user = await getUserByEmail(email);

    if (!user) {
      return res.json({ status: false, message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    }

    // ตรวจสอบรหัสผ่าน
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ status: false, message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    }

    // JWT token
    const payload = {
      id: user.id,
      username: user.username,
      profileImage: user.profile_image,
      email: user.email,
      money: user.money,
      role: user.role
    };

    const token = generateToken(payload);

    return res.json({
      status: true,
      message: "เข้าสู่ระบบสำเร็จ",
      token
    });
  } catch (err) {
    console.error("DB Error:", err);
    return res.status(500).json({ status: false, message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
});

export default router;
