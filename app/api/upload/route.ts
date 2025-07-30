import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { unlink, writeFile } from "fs/promises";
import path from "path";
import { existsSync, mkdirSync } from "fs";

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const MAX_FILE_SIZE_MB = 5;

export async function POST(req: NextRequest) {
	try {
		// Authenticate session
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Parse multipart form
		const formData = await req.formData();
		const file = formData.get("file") as File;

		if (!file) {
			return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
		}

		// Validate MIME type
		if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
			return NextResponse.json({ error: "Unsupported image type" }, { status: 415 });
		}

		// Convert to Uint8Array
		const arrayBuffer = await file.arrayBuffer();
		const uint8Array = new Uint8Array(arrayBuffer);

		// Validate size (in MB)
		const sizeInMB = uint8Array.length / (1024 * 1024);
		if (sizeInMB > MAX_FILE_SIZE_MB) {
			return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 413 });
		}

		// Ensure media directory exists
		const mediaDir = path.join(process.cwd(), "public", "media");
		if (!existsSync(mediaDir)) {
			mkdirSync(mediaDir, { recursive: true });
		}

		// Safe file name
		const timestamp = Date.now();
		const safeName = file.name.replace(/\s+/g, "_");
		const fileName = `${timestamp}-${safeName}`;
		const filePath = path.join(mediaDir, fileName);

		// Save the file
		await writeFile(filePath, uint8Array);

		// Construct public URL
		const imageUrl = `/media/${fileName}`;

		return NextResponse.json({
			message: "Image uploaded successfully",
			fileName,
			url: imageUrl,
		}, { status: 201 });

	} catch (error) {
		console.error("Image upload error:", error);
		return NextResponse.json({ error: "Server error during upload" }, { status: 500 });
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { url } = await req.json();

		if (!url || typeof url !== "string" || !url.startsWith("/media/")) {
			return NextResponse.json({ error: "Invalid image path" }, { status: 400 });
		}

		const filePath = path.join(process.cwd(), "public", url);
		await unlink(filePath);

		return NextResponse.json({ message: "Image deleted" }, { status: 200 });
	} catch (err) {
		console.error("Delete error:", err);
		return NextResponse.json({ error: "Could not delete file" }, { status: 500 });
	}
}

