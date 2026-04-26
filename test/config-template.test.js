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

  it('MSG_TEMPLATE should include message field in output', () => {
    const collected = {
      service: 'buy',
      budget: '100000',
      district: 'Центр',
      name: 'Иван',
      phone: '+79991234567',
      message: 'Хочу купить квартиру',
    };
    const output = config.MSG_TEMPLATE(collected);
    expect(output).toMatch(/Сообщение: Хочу купить квартиру/);
    expect(output).toMatch(/Услуга: 🏠 Покупка недвижимости/);
    expect(output).toMatch(/Бюджет: 100000/);
    expect(output).toMatch(/Район: Центр/);
    expect(output).toMatch(/Имя: Иван/);
    expect(output).toMatch(/Телефон: \+79991234567/);
  });
});
