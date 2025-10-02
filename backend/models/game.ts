import { db } from "../db/db";

// อัปเดตยอดเงิน
export async function depositMoney(username: string, amount: number): Promise<void> {
  await db.query(
    "UPDATE users SET money = money + ? WHERE username = ?",
    [amount, username]
  );
}

// เก็บ history การเติมเงิน
export async function addDepositHistory(uid: number, amount: number): Promise<void> {
  await db.query(
    "INSERT INTO deposit_history (uid, amount) VALUES (?, ?)",
    [uid, amount]
  );
}

export async function getAllGames(): Promise<any[]> {
  const [rows]: any = await db.query("SELECT * FROM games ORDER BY sold ASC");
  return rows;
}

export async function getGameById(id: number): Promise<any | null> {
  const [rows]: any = await db.query(
    `SELECT g.*,
            (
              SELECT COUNT(*)+1
              FROM games g2
              WHERE g2.sold > g.sold
                 OR (g2.sold = g.sold AND g2.name < g.name)
            ) AS ranking
     FROM games g
     WHERE g.id = ?`,
    [id]
  );
  return rows[0] || null;
}

//buy game
export async function increaseGameSold(gameId: number): Promise<void> {
  await db.query("UPDATE games SET sold = sold + 1 WHERE id = ?", [gameId]);
}

// ดึง Top เกมขายดีที่สุดตามช่วงเวลา
export async function getTopGames(start: string, end: string, limit: number = 5) {
  const [rows]: any = await db.query(
    `SELECT g.*, COUNT(ph.id) AS total_sold
     FROM games g
     JOIN purchase_history ph ON g.id = ph.game_id
     WHERE ph.created_at BETWEEN ? AND ?
     GROUP BY g.id
     ORDER BY total_sold DESC
     LIMIT ?`,
    [start, end, limit]
  );
  return rows;
}