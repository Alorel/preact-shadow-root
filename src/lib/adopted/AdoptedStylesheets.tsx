import {h, VNode} from 'preact';
import {memo} from 'preact/compat';
import {useContext} from 'preact/hooks';
import {AdoptedStylesheetsCtx} from '../AdoptedStylesheetsCtx';
import {sheetToString} from './sheetToString';
import {SUPPORTS_CONSTRUCTABLE_STYLESHEETS} from './support';

/** @internal */
const Sheets = memo(function Sheets({sheets}: { sheets: CSSStyleSheet[] }): VNode {
  return <style>{sheets.map(sheetToString).join('')}</style>;
});

/** @internal */
function Contextual(): VNode | null {
  const sheets = useContext(AdoptedStylesheetsCtx);

  return sheets ? <Sheets sheets={sheets}/> : null;
}

function AdoptedStylesheets(): VNode | null {
  return SUPPORTS_CONSTRUCTABLE_STYLESHEETS ? null : <Contextual/>;
}

AdoptedStylesheets.displayName = 'AdoptedStylesheets';

export {AdoptedStylesheets};
