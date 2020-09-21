import {ComponentChildren, h, VNode} from 'preact';
import {useLayoutEffect, useRef} from 'preact/hooks';
import {SUPPORTS_CONSTRUCTABLE_STYLESHEETS} from './adopted/support';

/** @internal */
interface Props {
  delegatesFocus?: boolean;

  mode: ShadowRootMode;

  sheets?: CSSStyleSheet[];

  setShadowRoot(root: ShadowRoot): void;

  slots?(): ComponentChildren;
}

/** @internal */
function CreateShadowHost({delegatesFocus, mode, slots, setShadowRoot, sheets}: Props): VNode {
  const ref = useRef<HTMLDivElement>();

  useLayoutEffect(() => {
    const root = ref.current!.parentElement!.attachShadow({delegatesFocus, mode});
    if (SUPPORTS_CONSTRUCTABLE_STYLESHEETS && sheets) {
      root.adoptedStyleSheets = sheets;
    }

    setShadowRoot(root);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={ref} style={'display:none!important'}>{slots && slots()}</div>;
}

CreateShadowHost.displayName = 'CreateShadowHost';

/** @internal */
export {CreateShadowHost};
