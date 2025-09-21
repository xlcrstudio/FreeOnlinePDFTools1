/**
 * Convert a title to a URL-safe slug
 * This function is shared between client and server to ensure consistent routing
 */
export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/\//g, '-')            // Convert '/' to '-' for PDF/A
    .replace(/[^\w-]/g, '')         // Remove other special characters
}