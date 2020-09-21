import {createContext} from 'preact';

/** @internal */
export const AdoptedStylesheetsCtx = createContext<CSSStyleSheet[]>(null as any);
