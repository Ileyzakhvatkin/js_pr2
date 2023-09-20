import { formatCost, renderFormatData, renderFormatDataDatails, renderSelect, renderDetailTitleBox } from './common';

test('Валидация функции преобразования цены', () => {
  expect(formatCost('123456.00')).toBe('123 456.00');
  expect(formatCost('22123456.41')).toBe('22 123 456.41');
  expect(formatCost('56.40')).toBe('56.40');
  expect(formatCost('0')).toBe('0.00');
});

test('Проверка формата даты на детальной странице счета', () => {
  const testAccaunt = {
    account: '74213041477477406320783754',
    balance: 16350034.91,
    transactions: [
      {
        amount: 238.63,
        date: '2022-02-10T19:23:09.752Z',
        from: '11445783216836387427542410',
        to: '74213041477477406320783754'
      }
    ]
  };
  expect(renderFormatData(testAccaunt)).toBe('10 февраля 2022');
});

test('Проверка формата даты на странице списка счетов', () => {
  expect(renderFormatDataDatails('2022-02-10T13:02:00.130Z')).toBe('10.02.2022');
  expect(renderFormatDataDatails('2021-02-19T00:21:36.053Z')).toBe('19.02.2021');
});

test('Проверка формирования селекта', () => {
  const SORT_LIST_TYPE = [
    'Сортировка',
    'По номеру',
    'По балансу',
    'По последней транзакции',
  ];
  // const expectedText = `<select class=\"select list__select\"><option class=\"select__option list__option\" value=\"Сортировка\">Сортировка</option><option class=\"select__option list__option\" value=\"По номеру\">По номеру</option><option class=\"select__option list__option\" value=\"По балансу\">По балансу</option><option class=\"select__option list__option\" value=\"По последней транзакции\">По последней транзакции</option></select>`;
  expect(renderSelect(SORT_LIST_TYPE, 'list')).toBeInstanceOf(HTMLSelectElement);
  // expect(renderSelect(SORT_LIST_TYPE, 'list')).toEqual(expectedText);
});

test('Проверка сутруктуры заголовка страницы', () => {
  expect(renderDetailTitleBox('74213041477477406320783754', 16350034.91)).toBeInstanceOf(HTMLDivElement);
});
