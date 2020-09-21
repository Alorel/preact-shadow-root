import {ComponentChildren, Fragment, h, JSX, VNode} from 'preact';
import {createPortal} from 'preact/compat';
import {useLayoutEffect, useRef, useState} from 'preact/hooks';

/** {@link ShadowHost} properties */
interface ShadowHostProps<E extends keyof HTMLElementTagNameMap = 'div'>
  extends JSX.HTMLAttributes<HTMLElementTagNameMap[E]> {

  /** Shadow root content */
  children: ComponentChildren;

  /**
   * Shadow root mode. Changes to this property are ignored.
   * @default open
   */
  mode?: ShadowRootMode;
}

/** Create an element with a shadow root */
function ShadowHost<E extends keyof HTMLElementTagNameMap = 'div'>(props: ShadowHostProps<E>): VNode<any> {
  const {
    children,
    mode
  } = props;

  // A placeholder element will be displayed before a shadow root is created
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);
  const ref = useRef<HTMLDivElement>();
  useLayoutEffect(() => {
    setShadowRoot(ref.current!.parentElement!.attachShadow({mode: mode!}));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!shadowRoot) {
    return <div ref={ref} style={'display:none!important'}/>;
  }

  return createPortal(<Fragment>{children}</Fragment>, shadowRoot as any);
}

ShadowHost.defaultProps = {
  mode: 'open'
} as Partial<ShadowHostProps>;

export {ShadowHost, ShadowHostProps};
