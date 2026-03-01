import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16;
const KEY_LENGTH = 32;

function getKey() {
  const keyBase64 = process.env.CONTENT_ENCRYPTION_KEY;
  if (!keyBase64) {
    throw new Error("Missing CONTENT_ENCRYPTION_KEY in .env (32-byte key, base64)");
  }
  const key = Buffer.from(keyBase64, "base64");
  if (key.length !== KEY_LENGTH) {
    throw new Error("CONTENT_ENCRYPTION_KEY must be 32 bytes (base64 decoded)");
  }
  return key;
}

export function encryptContent(plainText) {
  if (plainText == null || plainText === "") return "";
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plainText, "utf8"),
    cipher.final(),
  ]);
  return Buffer.concat([iv, encrypted]).toString("base64");
}

export function decryptContent(encryptedBase64) {
  if (!encryptedBase64 || typeof encryptedBase64 !== "string") return "";
  try {
    const key = getKey();
    const buf = Buffer.from(encryptedBase64, "base64");
    const iv = buf.subarray(0, IV_LENGTH);
    const ciphertext = buf.subarray(IV_LENGTH);
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    return decipher.update(ciphertext) + decipher.final("utf8");
  } catch {
    return "";
  }
}