import { db } from "../db/db";

export async function getAllTransactions(): Promise<object[]> {
	const [rows]: any = await db.query(`
		SELECT 
			'purchase' AS type,
			u.username,
			u.email,
			g.name AS item_name,
			g.price AS price,
			p.created_at
		FROM purchase_history p
		JOIN users u ON u.id = p.uid
		JOIN games g ON g.id = p.game_id
		UNION ALL
		SELECT 
			'deposit' AS type,
			u.username,
			u.email,
			'เติมเงิน' AS item_name,
			d.amount AS price,
			d.created_at
		FROM deposit_history d
		JOIN users u ON u.id = d.uid
		ORDER BY created_at DESC
	`);
	return rows;
}

export async function addGame(
	name: string,
	description: string,
	price: number,
	category: string,
	imagePath: string
): Promise<void> {
	await db.query(
		`INSERT INTO games (name, description, price, category, image, created_at)
		 VALUES (?, ?, ?, ?, ?, NOW())`,
		[name, description, price, category, imagePath]
	);
}

export async function getAllGames(): Promise<any[]> {
	const [rows]: any = await db.query("SELECT * FROM games ORDER BY created_at DESC");
	return rows;
}

export async function deleteGame(id: number): Promise<void> {
	await db.query("DELETE FROM games WHERE id = ?", [id]);
}

export async function updateGame(
	id: number,
	name: string,
	description: string,
	price: number,
	category: string,
	imagePath?: string
): Promise<void> {
	if (imagePath) {
		await db.query(
			`UPDATE games SET name=?, description=?, price=?, category=?, image=? WHERE id=?`,
			[name, description, price, category, imagePath, id]
		);
	} else {
		await db.query(
			`UPDATE games SET name=?, description=?, price=?, category=? WHERE id=?`,
			[name, description, price, category, id]
		);
	}
}

export async function getDashboardStats(): Promise<any> {
	const [[gameCount]]: any = await db.query(`SELECT COUNT(*) AS total_games FROM games`);
	const [[orderCount]]: any = await db.query(`SELECT COUNT(*) AS total_orders FROM purchase_history`);
	const [[userCount]]: any = await db.query(`SELECT COUNT(*) AS total_users FROM users`);

	const [topGames]: any = await db.query(`
		SELECT g.id, g.name, g.price, COUNT(p.game_id) AS sold
		FROM purchase_history p
		JOIN games g ON g.id = p.game_id
		GROUP BY g.id
		ORDER BY sold DESC
		LIMIT 10
	`);

	return {
		total_games: gameCount.total_games || 0,
		total_orders: orderCount.total_orders || 0,
		total_users: userCount.total_users || 0,
		top_games: topGames || []
	};
}