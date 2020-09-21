import {h} from 'preact';
import {ShadowHost} from './ShadowHost';
import {render, shallow} from 'enzyme';

describe('ShadowHost', () => {

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
