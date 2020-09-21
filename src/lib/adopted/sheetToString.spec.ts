import {sheetToString} from './sheetToString';

interface Rule {
  cssText: string;
}

class Rules {

  private readonly rules: Rule[];

  public constructor(rules) {
    this.rules = rules;
  }

  public get length(): number {
    return this.rules.length;
  }

  public item(idx: number): Rule | null {
    return this.rules[idx] || null;
  }
}

describe('sheetToString', () => {
  it('Should stringify empty sheet', () => {
    const cssRules = new Rules([]);
    const sheet: any = {cssRules};

    expect(sheetToString(sheet)).toBe('');
  });

  it('Should stringify rules', () => {
    const cssRules = new Rules([
      {cssText: '[text1]'},
      {cssText: '[text2]'}
    ]);

    const sheet: any = {cssRules};

    expect(sheetToString(sheet)).toBe('[text1][text2]');
  });
});
