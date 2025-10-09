import { db } from "../db/db";

interface Code {
    cid: number,
    code_name: String,
    discount: number,
    count: number,
    expire: Date,
    used: number,
    left: number,
}

export async function getAllCode(): Promise<Code[]> {
	const [rows]: any = await db.query(`
		SELECT 
			c.cid,
			c.code_name,
			c.discount,
			c.count,
			c.expire,
			(
				SELECT COUNT(*) 
				FROM discount_history h 
				WHERE h.cid = c.cid
			) AS used,
			(c.count - (
				SELECT COUNT(*) 
				FROM discount_history h 
				WHERE h.cid = c.cid
			)) AS left_count
		FROM discount_code c
	`);

	return rows.map((row: any) => ({
		cid: row.cid,
		code_name: row.code_name,
		discount: row.discount,
		count: row.count,
		expire: new Date(row.expire),
		used: row.used,
		left: row.left_count
	}));
}

export async function addCode(
	code_name: string,
	discount: number,
	count: number,
	expire: string
): Promise<void> {
	await db.query(
		`INSERT INTO discount_code (code_name, discount, count, expire) VALUES (?, ?, ?, ?)`,
		[code_name, discount, count, expire]
	);
}


export async function updateCode(
	cid: number,
	code_name: string,
	discount: number,
	count: number,
	expire: string
): Promise<void> {
	await db.query(
		`UPDATE discount_code SET code_name = ?, discount = ?, count = ?, expire = ? WHERE cid = ?`,
		[code_name, discount, count, expire, cid]
	);
}

export async function deleteCode(cid: number): Promise<void> {
	await db.query(`DELETE FROM discount_code WHERE cid = ?`, [cid]);
}