import {SUPPORTS_CONSTRUCTABLE_STYLESHEETS} from '@alorel/commons-constructable-css';
import {ComponentChildren, h, VNode} from 'preact';
import {useLayoutEffect, useRef} from 'preact/hooks';

/** @internal */
interface Props {
  delegatesFocus?: boolean;

  host?: Element;

  mode: ShadowRootMode;

  sheets?: CSSStyleSheet[];

  setShadowRoot(root: ShadowRoot): void;

  slots?(): ComponentChildren;
}

/** @internal */
function CreateShadowHost({delegatesFocus, host, mode, slots, setShadowRoot, sheets}: Props): VNode | null {
  const ref = useRef<HTMLDivElement>();

  useLayoutEffect(() => {
    const root = (host || ref.current!.parentElement!).attachShadow({delegatesFocus, mode});
    if (SUPPORTS_CONSTRUCTABLE_STYLESHEETS && sheets) {
      root.adoptedStyleSheets = sheets;
    }

    setShadowRoot(root);

    return () => {
      ref.current = undefined as any;
    };
  }, [host]); // eslint-disable-line react-hooks/exhaustive-deps

  return host ? null : <div ref={ref} style={'display:none!important'}>{slots && slots()}</div>;
}

CreateShadowHost.displayName = 'CreateShadowHost';

/** @internal */
export {CreateShadowHost};
