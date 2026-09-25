/**
 * Compresses and downscales an image file entirely in the browser before upload.
 * This keeps Supabase Storage usage low (important on the free 1GB plan) and
 * makes uploads faster on guests' phone connections at the venue.
 *
 * Strategy:
 *  - Decode the file into an <img>, draw it to a <canvas> capped at maxDimension
 *    on the longest side (upscaling never happens, only downscaling).
 *  - Re-encode as JPEG at the given quality (JPEG compresses far better than
 *    PNG for photos, and guests are uploading photos, not screenshots/graphics).
 *  - Falls back to the original file if compression fails or would not help
 *    (e.g. HEIC files some mobile browsers can't decode via canvas, or the
 *    result somehow ended up larger than the original).
 */

const MAX_DIMENSION = 1920; // long edge, in px - plenty for a web gallery/lightbox
const JPEG_QUALITY = 0.8; // 0-1, 0.8 is a good visual-quality/size tradeoff

export async function compressImage(
  file: File,
  { maxDimension = MAX_DIMENSION, quality = JPEG_QUALITY } = {},
): Promise<File> {
  // Skip non-image files (shouldn't happen given the <input accept="image/*">,
  // but be defensive) and skip already-tiny files - not worth the CPU cost.
  if (!file.type.startsWith('image/') || file.size < 300_000) {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);

    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality),
    );
    if (!blob) return file;

    // If compression somehow didn't help (rare, e.g. a tiny already-optimized
    // image), keep the original rather than uploading a larger file.
    if (blob.size >= file.size) return file;

    const newName = file.name.replace(/\.[^.]+$/, '') + '.jpg';
    return new File([blob], newName, { type: 'image/jpeg' });
  } catch (err) {
    // Decoding failed (unsupported format, corrupt file, older browser, etc.)
    // Upload the original rather than blocking the guest's upload entirely.
    console.warn('Image compression skipped, uploading original:', err);
    return file;
  }
}
