import {h} from 'preact';
import {mount} from 'enzyme';
import {MaintainAdoptedStylesheets} from './MaintainAdoptedStylesheets';

describe('MaintainAdoptedStylesheets', () => {
  let root: {adoptedStyleSheets: any};
  beforeEach(() => {
    root = {adoptedStyleSheets: undefined};
  });

  test('Shouldn\'t assign if sheets are falsy', () => {
    mount(<MaintainAdoptedStylesheets root={root} sheets={null}/>);

    expect(root.adoptedStyleSheets).toBeUndefined();
  });

  it('Should assign sheets if root & sheets are truthy', () => {
    const sheets: any[] = [{}, {}, {}];
    mount(<MaintainAdoptedStylesheets root={root} sheets={sheets}/>);

    expect(root.adoptedStyleSheets).toEqual(sheets);
  });
});
