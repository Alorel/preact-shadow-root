import {ComponentChildren, h, VNode} from 'preact';
import {useLayoutEffect, useRef} from 'preact/hooks';

/** @internal */
interface Props {
  delegatesFocus?: boolean;

  mode: ShadowRootMode;

  setShadowRoot(root: ShadowRoot): void;

  slots?(): ComponentChildren;
}

/** @internal */
export function CreateShadowHost({delegatesFocus, mode, slots, setShadowRoot}: Props): VNode {
  const ref = useRef<HTMLDivElement>();
  useLayoutEffect(() => {
    setShadowRoot(ref.current!.parentElement!.attachShadow({delegatesFocus, mode}));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={ref} style={'display:none!important'}>{slots && slots()}</div>;
}
