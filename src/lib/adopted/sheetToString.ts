/** @internal */
export function sheetToString(sheet: CSSStyleSheet): string {
  let out = '';

  const cssRules = sheet.cssRules; // Don't invoke getter repeatedly
  for (let i = 0; i < cssRules.length; i++) {
    out += cssRules.item(i)!.cssText;
  }

  return out;
}
