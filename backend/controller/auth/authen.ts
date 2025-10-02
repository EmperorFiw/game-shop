import { expressjwt } from "express-jwt";
import jwt from "jsonwebtoken";

export const secret = process.env.JWT_SECRET || "";

if (!secret) {
  throw new Error("JWT_SECRET environment variable is required but not defined");
}

export const jwtAuthen = expressjwt({
  secret: secret,
  algorithms: ["HS256"],
}).unless({
  path: [
    "/", 
    "/register", 
    "/login",
    /^\/uploads\/.*/
  ],
});


export function generateToken(payload: any): string {
  const token: string = jwt.sign(payload, secret, {
    expiresIn: "12h", // expires
    issuer: "0xFuse"
  });
  return token;
}

export function verifyToken(token: string,secretKey: string): { valid: boolean; decoded?: any; error?: string } {
  try {
    const decodedPayload: any = jwt.verify(token, secretKey);
    return { valid: true, decoded: decodedPayload };
  } catch (error) {
    return { valid: false, error: JSON.stringify(error) };
  }
}