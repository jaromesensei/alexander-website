/**
 * מקטין תמונה בדפדפן לפני ההעלאה: צד ארוך עד 2000px, WebP באיכות 0.85.
 * תמונה מטלפון (4–8MB) יורדת לכמה מאות KB — העלאה מהירה ואתר מהיר יותר.
 * אם משהו נכשל (פורמט לא נתמך וכו') מעלים את הקובץ המקורי.
 */
export async function compressImage(file: File, maxSize = 2000, quality = 0.85) {
  if (!file.type.startsWith('image/') || /gif|svg/.test(file.type)) return file

  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) return file
    context.drawImage(bitmap, 0, 0, width, height)
    bitmap.close()

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', quality),
    )
    if (!blob || blob.type !== 'image/webp' || blob.size >= file.size) return file

    const name = file.name.replace(/\.[^.]+$/, '') + '.webp'
    return new File([blob], name, { type: 'image/webp' })
  } catch {
    return file
  }
}
