import { Router } from "express";
import { addDepositHistory, depositMoney } from "../../models/game";
import { getUserIDByName, getUserInfo } from "../../models/user";

const router = Router();

// get info
router.get("/me", async (req: any, res) => {
  try {
    const { username } = req.auth; 
    const user = await getUserInfo(username);

    if (!user) {
      return res.status(404).json({ status: false, message: "ไม่พบผู้ใช้" });
    }

    return res.json({
      status: true,
      user
    });
  } catch (err) {
    console.error("Error /me:", err);
    return res.status(500).json({ status: false, message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
});

// เติมเงิน
router.post("/deposit", async (req: any, res) => {
  try {
    const { username } = req.auth;           
    const { amount } = req.body;        

    if (!amount || amount <= 0) {
      return res.status(400).json({ status: false, message: "จำนวนเงินไม่ถูกต้อง" });
    }

    // ดึง user id
    const uid = await getUserIDByName(username);
    if (!uid) {
      return res.status(404).json({ status: false, message: "ไม่พบผู้ใช้" });
    }

    // update เงิน + insert history
    await depositMoney(username, amount);
    await addDepositHistory(uid, amount);

    return res.json({
      status: true,
      message: `เติมเงิน ${amount} บาทสำเร็จ`
    });
  } catch (err) {
    console.error("Error /deposit:", err);
    return res.status(500).json({ status: false, message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
});

export default router;
