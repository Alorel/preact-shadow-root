import {ComponentChildren, Fragment, h, VNode} from 'preact';
import {useState} from 'preact/hooks';
import {SUPPORTS_CONSTRUCTABLE_STYLESHEETS} from './adopted/support';
import {AdoptedStylesheetsCtx} from './AdoptedStylesheetsCtx';
import {CreateShadowHost} from './CreateShadowHost';
import {MaintainAdoptedStylesheets} from './MaintainAdoptedStylesheets';
import {RenderShadowHost, RenderShadowHostProps} from './RenderShadowHost';

/** {@link ShadowHost} properties */
interface Props {

  adoptedStyleSheets?: CSSStyleSheet[];

  /** Shadow root content */
  children: ComponentChildren;

  /**
   * @see {@link ShadowRootInit#delegatesFocus}
   * @default false
   */
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
function ShadowHost({adoptedStyleSheets, children, delegatesFocus, mode, slots}: Props): VNode<any> {
  // A placeholder element will be displayed before a shadow root is created
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot>(null as any);

  if (!shadowRoot) {
    return <CreateShadowHost
      mode={mode!}
      delegatesFocus={delegatesFocus}
      sheets={adoptedStyleSheets}
      setShadowRoot={setShadowRoot}
      slots={slots}/>;
  }

  const props: RenderShadowHostProps = {contents: children, root: shadowRoot, slots};

  if (!adoptedStyleSheets) {
    return <RenderShadowHost {...props}/>;
  }

  if (SUPPORTS_CONSTRUCTABLE_STYLESHEETS) {
    return (
      <Fragment>
        <MaintainAdoptedStylesheets root={shadowRoot} sheets={adoptedStyleSheets}/>
        <RenderShadowHost {...props}/>
      </Fragment>
    );
  }

  return (
    <AdoptedStylesheetsCtx.Provider value={adoptedStyleSheets}>
      <RenderShadowHost {...props}/>
    </AdoptedStylesheetsCtx.Provider>
  );
}

ShadowHost.displayName = 'ShadowHost';

ShadowHost.defaultProps = {
  delegatesFocus: false,
  mode: 'open'
} as Partial<Props>;

export {ShadowHost, Props as ShadowHostProps};

