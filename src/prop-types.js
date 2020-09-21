import {ShadowHost} from '@alorel/preact-shadow-root';
import {arrayOf, bool, func, node, oneOf} from 'prop-types';

ShadowHost.propTypes = {
  adoptedStyleSheets: arrayOf(
    function(arr, idx, compName, loc, propFullName) {
      return arr[idx] instanceof CSSStyleSheet ?
        null :
        new Error('Invalid ' + loc + ' ' + propFullName + ' supplied to ' + compName + ': expected instance of CSSStyleSheet'); // eslint-disable-line prefer-template
    }
  ),
  children: node,
  delegatesFocus: bool,
  mode: oneOf(['open', 'closed']),
  slots: func
};
