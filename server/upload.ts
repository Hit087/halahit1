import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 20 * 1024 * 1024; // 20 ميجابايت

export async function saveUploadedFile(file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("نوع الملف غير مدعوم. استخدم PNG أو JPG أو WebP");
  }

  if (file.size > MAX_SIZE) {
    throw new Error("حجم الملف يتجاوز 20 ميجابايت");
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext)
    ? ext
    : "jpg";
  const filename = `${randomUUID()}.${safeExt}`;

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(path.join(uploadsDir, filename), buffer);

  return `/uploads/${filename}`;
}

export async function saveUploadedFiles(files: File[]): Promise<string[]> {
  return Promise.all(files.map((f) => saveUploadedFile(f)));
}