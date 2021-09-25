# preact-shadow-root

Adapted from and inspired by [react-shadow-root](https://github.com/apearce/react-shadow-root).

A tiny 1.3 kB minified library for rendering a Preact component inside a ShadowRoot.
Supports constructable stylesheets and slotted elements.

-----

# Table of contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation](#installation)
  - [Peer dependencies](#peer-dependencies)
- [Usage](#usage)
  - [API](#api)
  - [Basic usage](#basic-usage)
  - [Slots](#slots)
  - [Constructable stylesheets](#constructable-stylesheets)
- [Build flavours](#build-flavours)
- [Prop types](#prop-types)
  - [Prop type build flavours](#prop-type-build-flavours)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Installation

Add the registry to `.npmrc`:

```
@alorel:registry=https://npm.pkg.github.com
```

Then install it:

```
npm install @alorel/preact-shadow-root
```

## Peer dependencies

The library uses hooks depends on `preact@^10.0.0`

# Usage

## API

```typescript
interface Props {

  adoptedStyleSheets?: CSSStyleSheet[];

  /** Shadow root content */
  children: ComponentChildren;

  /**
   * @see {@link ShadowRootInit#delegatesFocus}
   * @default false
   */
  delegatesFocus?: boolean;

  /** Attach the shadow root to this host element instead of creating one */
  host?: Element;

  /**
   * Shadow root mode. Changes to this property are ignored.
   * @default open
   */
  mode?: ShadowRootMode;

  /** Slot elements to render */
  slots?(): ComponentChildren;
}
```

## Basic usage

```jsx
import {ShadowHost} from '@alorel/preact-shadow-root';
import {h} from 'preact';

function MyShadowComponent() {
  return (
    <div>
      {/* The div will be the shadow root host; most elements would do */}
      <ShadowHost>
         <span>I am inside a shadow root</span>
      </ShadowHost>
    </div>
  );
}
```

![Result](https://user-images.githubusercontent.com/4998038/93812976-498d5500-fc4a-11ea-88ee-0d4666f2acae.png)

## Slots

Slotted content is provided through a render function. Both named and default slots are supported.

```jsx
import {ShadowHost} from '@alorel/preact-shadow-root';
import {Fragment, h} from 'preact';
import {useCallback} from 'preact/hooks';

function MyNamedSlottedComponent({children}) {
  const slotFn = useCallback(() => children, [children]);

  return (
    <header>
      {/* The div will be the shadow root host; most elements would do */}
      <ShadowHost slots={slotFn}>
        <slot name={'named'}/>
      </ShadowHost>
    </header>
  );
}

function MySlottedShadowComponent({children}) {
  const slotFn = useCallback(() => children, [children]);

  return (
    <section data-foo={'bar'}>
      {/* The div will be the shadow root host; most elements would do */}
      <ShadowHost slots={slotFn}>
        <slot>Default content</slot>
      </ShadowHost>
    </section>
  );
}

function App() {
  return (
    <Fragment>
      <MySlottedShadowComponent/>
      <hr/>
      <MySlottedShadowComponent>Provided content</MySlottedShadowComponent>
      <hr/>
      <MyNamedSlottedComponent>
        <span slot={'named'}>I'm slotted!</span>
        <span slot={'other'}>I'm skipped</span>
      </MyNamedSlottedComponent>
    </Fragment>
  );
}
```

![Result](https://user-images.githubusercontent.com/4998038/93814069-f2887f80-fc4b-11ea-93ec-d294bfd54c30.png)

## Constructable stylesheets

```jsx
import {AdoptedStylesheets, ShadowHost} from '@alorel/preact-shadow-root';
import {h} from 'preact';

const sheet = new CSSStyleSheet();
sheet.replaceSync(':host{background:yellow;color:blue}');

const stylesheets = [sheet];

function AdoptedStylesheetsExample() {
  return (
    <div>
      <ShadowHost adoptedStyleSheets={stylesheets}>
        {/* A standard non-adopted stylesheet */}
        <style>{':host{display:inline-block}'}</style>
        <AdoptedStylesheets/>
        <span>Top tier colour combo</span>
      </ShadowHost>
    </div>
  );
}

function App() {
  return <AdoptedStylesheetsExample/>;
}
```

When constructable stylesheets are supported, this results in the following:

![Result](https://user-images.githubusercontent.com/4998038/93815216-87d84380-fc4d-11ea-95af-0276d675b377.png)

When they aren't, `<AdoptedStylesheets/>` will render them as regular styles:

![Result](https://user-images.githubusercontent.com/4998038/93816202-20bb8e80-fc4f-11ea-999f-5ea576ab6a7c.png)

Notes:

- Adopted stylesheets are applied *after* all the `<style>` attributes - position `<AdoptedStylesheets/>` accordingly
- Maintain the same reference to the stylesheets array unless a sheet gets added/removed, otherwise they'll keep getting reapplied

# Build flavours

The library is packaged in the following variants:

| **module** | **ES version** | **file**         | **main fields** |
|------------|----------------|------------------|------------------|
| commonjs   | ES6            | index.js         | main             |
| es2015     | ES5            | index.esm5.js    | esm5, module     |
| es2015     | ES6            | index.esm2015.js | es2015, esm2015  |
| umd        | ES5            | index.umd.js     | browser          |

You can configure your build system accordingly.

# Prop types

If you use Typescript you won't need proptype definitions as the compiler will just throw an error.

If you use Javascript you'll need to install the following:

```
npm install prop-types@>=15.6.0 @alorel/preact-shadow-root-proptypes
```

Then, make sure the proptype definitions are imported before you make use of the library:

```javascript
import '@alorel/preact-shadow-root-proptypes';

// Your app component etc
```

## Prop type build flavours

| **module** | **ES version** | **file**      | **main fields** |
|------------|----------------|---------------|------------------|
| commonjs   | ES5            | index.js      | main             |
| es2015     | ES5            | index.esm5.js | esm5, module     |
| umd        | ES5            | index.umd.js  | browser          |
