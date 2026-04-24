// Unit test to ensure config templates always work with any collected object
const config = require('../settings/config');

describe('Config template interface', () => {
  it('LEAD_TEMPLATE and MSG_TEMPLATE should accept any collected object', () => {
    const collected = { name: 'Test', phone: '123', foo: 'bar', extra: 42 };
    expect(() => config.LEAD_TEMPLATE(collected)).not.toThrow();
    expect(() => config.MSG_TEMPLATE(collected)).not.toThrow();
    expect(typeof config.LEAD_TEMPLATE(collected)).toBe('string');
    expect(typeof config.MSG_TEMPLATE(collected)).toBe('string');
  });
});
