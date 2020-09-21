import {ComponentChildren, h, JSX, VNode} from 'preact';
import {useState} from 'preact/hooks';
import {CreateShadowHost} from './CreateShadowHost';
import {RenderShadowHost} from './RenderShadowHost';

/** {@link ShadowHost} properties */
interface Props<E extends keyof HTMLElementTagNameMap = 'div'>
  extends JSX.HTMLAttributes<HTMLElementTagNameMap[E]> {

  /** Shadow root content */
  children: ComponentChildren;

  /** @see {@link ShadowRootInit#delegatesFocus} */
  delegatesFocus?: boolean;

  /**
   * Shadow root mode. Changes to this property are ignored.
   * @default open
   */
  mode?: ShadowRootMode;

  /** Slot elements to render */
  slots?(): ComponentChildren;
}

/** Create an element with a shadow root */
function ShadowHost<E extends keyof HTMLElementTagNameMap = 'div'>(props: Props<E>): VNode<any> {
  const {
    children,
    delegatesFocus,
    mode,
    slots
  } = props;

  // A placeholder element will be displayed before a shadow root is created
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot>(null as any);

  return (
    shadowRoot ?
      <RenderShadowHost contents={children} root={shadowRoot} slots={slots}/> :
      <CreateShadowHost mode={mode!} delegatesFocus={delegatesFocus} setShadowRoot={setShadowRoot} slots={slots}/>
  );
}

ShadowHost.defaultProps = {
  mode: 'open'
} as Required<Pick<Props, 'mode'>>;

export {ShadowHost, Props as ShadowHostProps};

