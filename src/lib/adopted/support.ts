/** Whether constructable stylesheets are supported or not */
export const SUPPORTS_CONSTRUCTABLE_STYLESHEETS: boolean =
  typeof window !== 'undefined' &&
  !!window.ShadowRoot &&
  !!window.CSSStyleSheet &&
  ShadowRoot.prototype.hasOwnProperty('adoptedStyleSheets') && // eslint-disable-line no-prototype-builtins
  CSSStyleSheet.prototype.hasOwnProperty('replace'); // eslint-disable-line no-prototype-builtins
