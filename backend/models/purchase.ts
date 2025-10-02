import { db } from "../db/db";

// insert purchase_history
export async function addPurchase(uid: number, gameId: number, amount: number) {
	await db.query(
		"INSERT INTO purchase_history (uid, game_id, amount) VALUES (?, ?, ?)",
		[uid, gameId, amount]
	);
}

export async function hasPurchased(uid: number, gameId: number): Promise<boolean> {
    const [rows]: any = await db.query(
      "SELECT 1 FROM purchase_history WHERE uid = ? AND game_id = ? LIMIT 1",
      [uid, gameId]
    );
    return rows.length > 0;
  }
