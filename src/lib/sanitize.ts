/**
 * Sanitize a font-family string to prevent CSS injection.
 * Allows only alphanumeric characters, spaces, hyphens, and commas.
 */
export function sanitizeFontFamily(font: string): string {
  const sanitized = font.replace(/[^a-zA-Z0-9\s,\-]/g, '');
  return sanitized || 'inherit';
}

/**
 * Sanitize a color value to prevent CSS injection.
 * Only allows valid hex colors (#RRGGBB).
 */
export function sanitizeColor(color: string): string {
  return /^#[0-9A-Fa-f]{6}$/.test(color) ? color : '#cccccc';
}
