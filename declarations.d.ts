declare interface ShadowRoot {
  adoptedStyleSheets: CSSStyleSheet[] | readonly CSSStyleSheet[];
}

interface CSSStyleSheet {
  replace(css: string): Promise<this>;

  replaceSync(css: string): void;
}
