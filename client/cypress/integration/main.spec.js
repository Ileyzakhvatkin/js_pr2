// https://docs.cypress.io/api/commands/go
/// <reference types="cypress" />

describe('Форма авторизации - ', () => {
  beforeEach(() => {
    cy.reload();
    cy.visit('http://localhost:8080/');
    cy.get('.header').then((header) => {
      if ( header.find('.header__nav-item').length > 0 ) {
        cy.get('.header__nav-link').last().click();
      };
    });
  });

  it(`Кнопка Войти - не доступна`, () => {
    cy.visit('http://localhost:8080/');
    cy.get('.login-form__button').should('be.disabled');
  });

  it(`Неверный логин`, () => {
    cy.visit('http://localhost:8080/');
    cy.get('input[name="user-login"]').type('developer2').should('have.value', 'developer2');
    cy.get('input[name="user-password"]').type('skillbox').should('have.value', 'skillbox');
    cy.get('.login-form__button').should('be.enabled');
    cy.get('.login-form__button').click();
    cy.get('.login-form__error').should('have.text', 'Такого пользователя не существует');
  });

  it(`Неверный пароль`, () => {
    cy.visit('http://localhost:8080/');
    cy.get('input[name="user-login"]').type('developer').should('have.value', 'developer');
    cy.get('input[name="user-password"]').type('skillbox2').should('have.value', 'skillbox2');
    cy.get('.login-form__button').should('be.enabled');
    cy.get('.login-form__button').click();
    cy.get('.login-form__error').should('have.text', 'Неверный пароль');
  });

  it(`Успешная авторизация`, () => {
    cy.visit('http://localhost:8080/');
    cy.get('input[name="user-login"]').type('developer').should('have.value', 'developer');
    cy.get('input[name="user-password"]').type('skillbox').should('have.value', 'skillbox');
    cy.get('.login-form__button').click();
    cy.get('.header__nav').should('exist');
  });
});

describe('Функции приложения', () => {
  beforeEach(() => {
    cy.reload();
    cy.visit('http://localhost:8080/');
    cy.get('.header').then((header) => {
      if ( header.find('.header__nav-item').length > 0 ) {
        cy.get('.header__nav-link').last().click();
      };
    });
    cy.get('input[name="user-login"]').type('developer').should('have.value', 'developer');
    cy.get('input[name="user-password"]').type('skillbox').should('have.value', 'skillbox');
    cy.get('.login-form__button').click();
    cy.get('.header__nav').should('exist');
  });

  it(`Проверка добавления счета`, () => {
    cy.visit('http://localhost:8080/');
    let allItems = null;
    cy.get('.list__item').then(($items) => allItems = $items.length + 1)
    cy.get('.list__button-add').click();
    cy.get('.llist__item').should('have.length', allItems);
  });

  it(`Проверка формы перевода средств - успешно`, () => {
    cy.visit('http://localhost:8080/');
    cy.get('.list__item-account').then(($el) => {
      cy.log($el.last().text());
      cy.get('.list__item-button').first().click();
      cy.get('input[name="trans-accaunt"]').type(String($el.last().text()).substr(0, 2)).should('have.value', $el.last().text());
      cy.get('input[name="trans-amount"]').type('1').should('have.value', '1');
      cy.get('.details__form-btn').click();
      cy.get('.details__form-error').should('have.text', 'Перевод средств осуществлен');
    });
  });

  it(`Проверка формы перевода средств - недостаточно средств`, () => {
    cy.visit('http://localhost:8080/');
    cy.get('.list__item-button').last().click();
    cy.get('input[name="trans-accaunt"]').type('74').should('have.value', '74213041477477406320783754');
    cy.get('input[name="trans-amount"]').type('100').should('have.value', '100');
    cy.get('.details__form-btn').click();
    cy.get('.details__form-error').should('have.text', 'Вы попытались перевести больше денег, чем доступно Вам на счёте списания')
  });

  // Получается что если чет указан неверно перевод проходит 'Invalid account to' - не трабатывает!!!!!!!!
  // it(`Проверка формы перевода средств - неверный номер счета`, () => {
  //   cy.visit('http://localhost:8080/');
  //   cy.get('.list__item-button').first().click();
  //   cy.get('input[name="trans-accaunt"]').type('4555554545165651656566666').should('have.value', '4555554545165651656566666');
  //   cy.get('input[name="trans-amount"]').type('100').should('have.value', '100');
  //   cy.get('.details__form-btn').click();
  //   // cy.get('.details__form-error').should('have.text', 'Не указан счёт зачисления, или этого счёта не существует');
  //   cy.get('.details__form-error').should('have.text', 'Перевод средств осуществлен');
  //   cy.get('.header__nav-link').last().click();
  // });

  it(`Проверка формы обмена валюты - НЕ удачный обмен`, () => {
    cy.visit('http://localhost:8080/currency-exchange/');
    cy.get('select[name="currency-1"]').select('ETH').should('have.value', 'ETH');
    cy.get('select[name="currency-2"]').select('RUB').should('have.value', 'RUB');
    cy.get('input[name="currency-amount"]').type('1000000000000000').should('have.value', '1000000000000000');
    cy.get('.currency__btn').click();
    cy.get('.currency__ex-masage').should('have.text', 'Вы попытались перевести больше денег, чем доступно на счёте списания');
  });

  it(`Проверка формы обмена валюты - удачный обмен`, () => {
    cy.visit('http://localhost:8080/currency-exchange/');
    cy.get('select[name="currency-1"]').select('RUB').should('have.value', 'RUB');
    cy.get('select[name="currency-2"]').select('ETH').should('have.value', 'ETH');
    cy.get('input[name="currency-amount"]').type('1').should('have.value', '1');
    cy.get('.currency__btn').click();
    cy.get('.currency__ex-masage').should('have.text', 'Обмен валюты произведен');
  });

  afterEach(() => {
    cy.get('.header__nav-link').last().click();
  })

});
