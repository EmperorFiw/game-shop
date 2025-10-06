import { db } from "../db/db";

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  profile_image: string;
  money: number;
  role: string;
}

export interface UserProfileUpdate {
	username: string;
	email: string;
	balance: number;
	avatar?: string | null;
}

//  ดึง user ด้วย email หรือ username
export async function getUserByEmailOrUsername(value: string, by: "email" | "username"): Promise<User | null> {
  const query = `SELECT * FROM users WHERE ${by} = ? LIMIT 1`;
  const [rows]: any = await db.query(query, [value]);
  return rows.length > 0 ? rows[0] : null;
}

//  ตรวจ username/email ซ้ำ
export async function checkUserExists(username: string, email: string): Promise<boolean> {
  const [rows]: any = await db.query(
    "SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1",
    [username, email]
  );
  return rows.length > 0;
}

//  สร้าง user ใหม่
export async function createUser(username: string, email: string, password: string, profileImage: string): Promise<void> {
  await db.query(
    "INSERT INTO users (username, profile_image, email, password, money, role) VALUES (?, ?, ?, ?, ?, ?)",
    [username, profileImage, email, password, 0, "member"]
  );
}

//user info 
export async function getUserInfo(username: string): Promise<Partial<User> | null> {
  const [rows]: any = await db.query(
    "SELECT username, email, profile_image as profileImage, money, role FROM users WHERE username = ? LIMIT 1",
    [username]
  );
  return rows.length > 0 ? rows[0] : null;
}

export async function getUserByUsername(username: string) {
	const [rows]: any = await db.query("SELECT * FROM users WHERE username = ?", [username]);
	return rows.length > 0 ? rows[0] : null;
}

export async function getUserIDByName(username: string): Promise<number | null> {
  const [rows]: any = await db.query(
    "SELECT id FROM users WHERE username = ? LIMIT 1",
    [username]
  );
  return rows.length > 0 ? rows[0].id : null;
}
export async function getUserNameByID(id: number): Promise<String | null> {
  const [rows]: any = await db.query(
    "SELECT username FROM users WHERE id = ? LIMIT 1",
    [id]
  );
  return rows.length > 0 ? rows[0].id : null;
}
// อัปเดตเงิน user
export async function updateUserMoney(uid: number, newMoney: number) {
	await db.query("UPDATE users SET money = ? WHERE ID = ?", [newMoney, uid]);
}

export async function updateUserProfile(currentUser: string, data: UserProfileUpdate): Promise<boolean> {
	const { username, email, balance, avatar } = data;
	await db.query(
		"UPDATE users SET username = ?, email = ?, money = ?, profile_image = ? WHERE username = ?",
		[username, email, balance, avatar, currentUser]
	);
	return true;
}