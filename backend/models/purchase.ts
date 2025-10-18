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

export async function getPurchaseHistory(uid: number): Promise<object[]> {
	const [rows]: any = await db.query(
		`SELECT 
			'purchase' AS type,
			p.id,
			p.game_id,
			g.name AS game_name,
			g.category AS category,
			g.image AS image,
			g.price AS price,
			p.amount,
			p.created_at
		FROM purchase_history p
		LEFT JOIN games g ON g.id = p.game_id
		WHERE p.uid = ?
		ORDER BY p.created_at DESC`,
		[uid]
	);
	return rows;
}

export async function getDepositHistory(uid: number): Promise<object[]> {
	const [rows]: any = await db.query(
		`SELECT 
			'deposit' AS type,
			d.id,
			NULL AS game_id,
			NULL AS game_name,
			NULL AS category,
			NULL AS image,
			NULL AS price,
			d.amount,
			d.created_at
		FROM deposit_history d
		WHERE d.uid = ?
		ORDER BY d.created_at DESC`,
		[uid]
	);
	return rows;
}

export async function getAllHistory(uid: number): Promise<object[]> {
	const purchases = await getPurchaseHistory(uid);
	const deposits = await getDepositHistory(uid);

	const all = [...purchases, ...deposits];

	all.sort(
		(a: any, b: any) =>
			new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
	);

	return all;
}

export async function checkAlreadyPurchased(uid: number, gameId: number): Promise<boolean> {
	const [rows]: any = await db.query(
		`SELECT id FROM purchase_history WHERE uid = ? AND game_id = ? LIMIT 1`,
		[uid, gameId]
	);
	return rows.length > 0;
}
