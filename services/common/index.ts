export async function urlToFile(url?: string): Promise<File | null> {
	try {
		if (!url) return null;
		const response = await fetch(url);
		if (!response.ok) return null;
		const blob = await response.blob();
		// Guess filename from URL
		const cleanUrl = url.split(/[?#]/)[0];
		const filename = cleanUrl.split("/").pop() || "downloaded-file";
		// Use blob.type as mimetype
		return new File([blob], filename, { type: blob.type });
	} catch {
		return null;
	}
}

export function toGrosz(zl: number | null | undefined): number | undefined {
  if (typeof zl !== "number") return undefined;
  return Math.round(zl * 100);
}

export function toZloty(grosz: number | null | undefined): number | undefined {
  if (typeof grosz !== "number") return undefined;
  return grosz / 100;
}
