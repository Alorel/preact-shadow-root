import {useEffect} from 'preact/hooks';

/** @internal */
interface Props {
  root: ShadowRoot;

  sheets: CSSStyleSheet[];
}

/** @internal */
export function MaintainAdoptedStylesheets({root, sheets}: Props): null {
  useEffect(() => {
    if (root && sheets) {
      root.adoptedStyleSheets = sheets;
    }
  }, [root, sheets]);

  return null;
}
