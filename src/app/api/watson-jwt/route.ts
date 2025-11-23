// /app/api/watson-jwt/route.ts
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Load client private key
    const privateKeyPath = path.join(process.cwd(), "client_private_key.pem");
    const privateKey = fs.readFileSync(privateKeyPath, "utf8");

    // JWT payload
    const payload = {
      sub: "user123", // your user ID
      name: "Test User", // optional
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 5, // 5 min expiry
    };

    // Sign JWT with RS256 and include `kid` (must match IBM registration)
    const token = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      keyid: "YOUR_REGISTERED_KID", // ← replace with your IBM-assigned kid
    });

    return NextResponse.json({ token });
  } catch (err) {
    console.error("Error generating JWT:", err);
    return NextResponse.json(
      { error: "Failed to generate JWT" },
      { status: 500 }
    );
  }
}
