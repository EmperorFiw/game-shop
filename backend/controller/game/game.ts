import { Router } from "express";
import { getAllGames, getGameById, getTopGames, increaseGameSold } from "../../models/game";
import { addPurchase, checkAlreadyPurchased, hasPurchased } from "../../models/purchase";
import { getUserByID, getUserByUsername, getUserNameByID, updateUserMoney } from "../../models/user";

const router = Router();

// ดึงเกมทั้งหมด
router.get("/", async (req, res) => {
  try {
    const games = await getAllGames();
    return res.json({ status: true, games });
  } catch (err) {
    console.error("Error /game:", err);
    return res.status(500).json({ status: false, message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
});

router.get("/top", async (req: any, res) => {
  const { start, end } = req.query;

  try {
    const games = await getTopGames(start, end, 5);
    res.json({ status: true, games });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "ดึงข้อมูล Top 5 ไม่สำเร็จ" });
  }
});

// ดึงรายละเอียดเกมตาม id
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ status: false, message: "ID ไม่ถูกต้อง" });
    }

    const game = await getGameById(id);
    if (!game) {
      return res.status(404).json({ status: false, message: "ไม่พบเกม" });
    }

    return res.json({ status: true, game });
  } catch (err) {
    console.error("Error /game/:id:", err);
    return res.status(500).json({ status: false, message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
});

router.post("/purchase", async (req: any, res) => {
  const { gameId } = req.body;
  const { id } = req.auth;

  try {
    const username = await getUserNameByID(id);
    if (!username)
      return res.status(404).json({ status: false, message: "ไม่พบผู้ใช้"});
    // ดึง user + game
    const user = await getUserByUsername(username);
    if (!user) return res.status(404).json({ status: false, message: "ไม่พบผู้ใช้" });

    const game = await getGameById(gameId);
    if (!game) return res.status(404).json({ status: false, message: "ไม่พบเกม" });

    const alreadyBought = await hasPurchased(user.id, game.id);
    if (alreadyBought) {
      return res.status(400).json({ status: false, message: "คุณได้ซื้อเกมนี้ไปแล้ว" });
    }

    // เช็คเงินพอมั้ย
    if (user.money < game.price) {
      return res.status(400).json({ status: false, message: "ยอดเงินไม่เพียงพอ" });
    }
    // หักเงิน
    const newMoney = user.money - game.price;
    await updateUserMoney(user.id, newMoney);
    // insert purchase_history
    await addPurchase(user.id, game.id, game.price);

    // update sold
    await increaseGameSold(game.id);

    res.json({ status: true, message: "ซื้อเกมสำเร็จ", balance: newMoney });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "เกิดข้อผิดพลาด" });
  }
});
router.post("/basket_purchase", async (req: any, res) => {
	try {
		const { id } = req.auth;
		const { gameIds, discountCode, total } = req.body;

		const user = await getUserByID(id);
		if (!user) return res.status(404).json({ status: false, message: "ไม่พบผู้ใช้" });

		if (user.money < total) {
			return res.json({ status: false, message: "ยอดเงินไม่เพียงพอ" });
		}

		const purchasedGames = [];
		for (const game of gameIds) {
			const already = await checkAlreadyPurchased(user.id, game.id);
			if (already) purchasedGames.push(game.name);
		}

		if (purchasedGames.length > 0) {
			return res.json({
				status: false,
				message: `คุณเคยซื้อเกมเหล่านี้แล้ว: ${purchasedGames.join(", ")}`
			});
		}

		for (const game of gameIds) {
			await addPurchase(user.id, game.id, game.price);
		}

    await updateUserMoney(user.id, user.money - total);

		res.json({ status: true, message: "สั่งซื้อสำเร็จ" });

	} catch (err) {
		console.error("❌ basket_purchase error:", err);
		res.status(500).json({ status: false, message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
	}
});


export default router;
