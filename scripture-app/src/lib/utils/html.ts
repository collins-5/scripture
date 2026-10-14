export function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h[1-6]|li)>/gi, '\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function isEmptyHtml(html: string | undefined | null): boolean {
  if (!html) return true;
  const trimmed = html.trim();
  if (!trimmed) return true;
  if (
    trimmed === '<p></p>' ||
    trimmed === '<p><br></p>' ||
    trimmed === '<p><br/></p>'
  ) {
    return true;
  }
  return stripHtml(trimmed).length === 0;
}