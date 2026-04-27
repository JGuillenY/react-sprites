/**
 * Replaces (or injects) width/height attributes on the root <svg> element.
 * Operates on the raw SVG string to avoid a full DOM parse.
 */
export function resizeSvg(svgContent: string, width?: number, height?: number): string {
  if (!width && !height) return svgContent;
  return svgContent.replace(/<svg([^>]*)>/, (_, attrs: string) => {
    let newAttrs = attrs
      .replace(/\s+width="[^"]*"/g, '')
      .replace(/\s+height="[^"]*"/g, '');
    if (width) newAttrs += ` width="${width}"`;
    if (height) newAttrs += ` height="${height}"`;
    return `<svg${newAttrs}>`;
  });
}
