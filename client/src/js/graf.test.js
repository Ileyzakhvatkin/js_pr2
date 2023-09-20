import { createYearMonth } from './graf';
test('Проверка массива дат для графиков', () => {
  expect(createYearMonth(12).length).toBe(12);
});
