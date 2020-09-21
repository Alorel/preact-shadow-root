import {ComponentChildren, Fragment, h, JSX, VNode} from 'preact';
import {createPortal} from 'preact/compat';
import {useLayoutEffect, useRef, useState} from 'preact/hooks';

/** {@link ShadowHost} properties */
interface ShadowHostProps<E extends keyof HTMLElementTagNameMap = 'div'>
  extends JSX.HTMLAttributes<HTMLElementTagNameMap[E]> {

  /**
   * Host element type. Changes to this property are ignored.
   * @default div
   */
  host?: E;

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
    host,
    mode,
    ...otherProps
  } = props;

  // Ensure we don't destroy the old host element
  const [initialHost] = useState<E>(host!);

  // A placeholder element will be displayed before a shadow root is created
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);
  const ref = useRef<HTMLElement>();
  useLayoutEffect(() => {
    setShadowRoot(ref.current!.attachShadow({mode: mode!}));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!shadowRoot) {
    return h(initialHost as string, {ref, style: 'display:none!important'} as any);
  }

  return h(
    initialHost as string,
    {...otherProps, ref} as any,
    createPortal(<Fragment>{children}</Fragment>, shadowRoot as any)
  );
}

ShadowHost.defaultProps = {
  host: 'div',
  mode: 'open'
} as Partial<ShadowHostProps>;

export {ShadowHost, ShadowHostProps};
