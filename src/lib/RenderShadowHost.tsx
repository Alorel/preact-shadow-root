import {ComponentChildren, Fragment, h, VNode} from 'preact';
import {createPortal, memo} from 'preact/compat';

/** @internal */
interface Props {
  contents?: ComponentChildren;

  root: ShadowRoot;

  slots?(): ComponentChildren;
}

/** @internal */
function RenderShadowHost({contents, root, slots}: Props): VNode {
  return (
    <Fragment>
      {createPortal(contents as VNode, root as any)}
      {slots && slots()}
    </Fragment>
  );
}

/** @internal */
const memoed = memo(RenderShadowHost);

/** @internal */
export {memoed as RenderShadowHost};
