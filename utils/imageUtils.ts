/**
 * Transforms a standard Google Drive file viewing URL into a direct, embeddable
 * URL suitable for an `<img>` tag's src attribute.
 * @param url The original Google Drive URL (e.g., https://drive.google.com/file/d/FILE_ID/view?usp=sharing)
 * @returns A direct image URL or the original URL if it's not a recognized Google Drive link.
 */
export const transformGoogleDriveImageUrl = (url: string): string => {
  if (!url || !url.includes('drive.google.com/file/d/')) {
    // Return original URL if it's empty, null, or doesn't look like a GDrive file link
    return url;
  }

  const fileIdRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(fileIdRegex);

  if (match && match[1]) {
    const fileId = match[1];
    // The previous method using `drive.google.com/uc?export=view&id=` has become unreliable
    // as Google often serves a redirect or an interstitial page (like a virus scan warning)
    // which breaks direct embedding in `<img>` tags.
    //
    // This new format `lh3.googleusercontent.com/d/` provides a much more stable,
    // direct-access link to the image content.
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  // If the regex fails for some reason, return the original URL as a fallback
  return url;
};