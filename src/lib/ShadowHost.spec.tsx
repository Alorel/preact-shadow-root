import {h} from 'preact';
import {ShadowHost} from './ShadowHost';
import {render, shallow} from 'enzyme';

describe('ShadowHost', () => {

  test('Should accept render in host param', () => {
    let args: ShadowRootInit | undefined;
    const fakeElement: Pick<Element, 'attachShadow'> = {
      attachShadow(init: ShadowRootInit): ShadowRoot {
        args = init;

        return null as any;
      }
    };

    render(
      <ShadowHost host={fakeElement as any} delegatesFocus={true} mode={'closed'}>.</ShadowHost>
    );

    expect(args).toEqual({delegatesFocus: true, mode: 'closed'});
  });

  test('Should render in parent node', () => {
    const rendered = shallow(
      <section className={'a-section'} data-foo={'bar'}>
        <ShadowHost>contents</ShadowHost>
      </section>
    );

    expect(rendered.find('section.a-section[data-foo="bar"]')).toBeTruthy();
  });

  test('Should render slotted content', () => {
    const rendered = render(
      <div>
        <ShadowHost slots={() => <span className={'slotted'}>I am slotted</span>}>
          <span>bar</span>
          <slot/>
        </ShadowHost>
      </div>
    );

    expect(rendered.find('.slotted').text()).toBe('I am slotted');
  });
});
