import { el, setChildren } from 'redom';
import { getYuorCurrency, exchangeYuorCurrency } from './api-server.js';
import { renderSelect } from './common.js';
import { main } from '../bandel.js';
import changeUp from '../assets/images/icon-up.svg';
import changeDown from '../assets/images/icon-down.svg';

export async function createCurrencyPage() {
  // Получаем токен и список типов валют
  let tokenStorage = sessionStorage.getItem('coin-token');
  const allCurrency = JSON.parse(localStorage.getItem('allCurrencyCode'));

  // Рисуем и обрабатываем форму обмена валюты
  const yuorCurrencyListBox = el('.currency__list-box');
  const currencySelect1 = renderSelect(allCurrency, 'currency');
  currencySelect1.setAttribute('name', 'currency-1');
  const currencySelect2 = renderSelect(allCurrency, 'currency');
  currencySelect2.setAttribute('name', 'currency-2');
  const currencyInput = el('input.currency__input.input', { type: 'text', name: 'currency-amount' });
  const currencyInputError = el('.currency__input-error');
  const submitExButton = el(
    'button.currency__btn.btn',
    { disabled: 'disabled' },
    'Обменять'
  );
  const currencExMassage = el('.currency__ex-masage');
  const exchangeForm = el('form.currency__form', [
    el('.currency__box', [
      el('.currency__row', [
        el('lable.currency__lable', 'Из'),
        currencySelect1,
        el('lable.currency__lable', 'В'),
        currencySelect2,
      ]),
      el('.currency__row', [
        el('lable.currency__lable', 'Сумма'),
        currencyInput,
      ]),
    ]),
    submitExButton,
  ]);
  function validateInput() {
    if (
      currencySelect1.value != currencySelect2.value &&
      currencyInput.value > 0
    ) {
      submitExButton.removeAttribute('disabled', 'disabled');
    } else {
      submitExButton.setAttribute('disabled', 'disabled');
    }
  }
  currencySelect1.addEventListener('input', () => validateInput());
  currencySelect2.addEventListener('input', () => validateInput());
  currencyInput.addEventListener('input', () => {
    // console.log( currencyInput.value );
    if (/[0-9]/.test(currencyInput.value) === true) {
      currencyInputError.textContent = '';
    } else {
      currencyInputError.textContent = 'Введите любое число больше нуля';
    }
    validateInput();
  });
  exchangeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    exchangeYuorCurrency(
      tokenStorage,
      currencySelect1.value,
      currencySelect2.value,
      currencyInput.value
    ).then((result) => {
      console.log(result);
      switch (result.error) {
        case 'Invalid account from':
          currencExMassage.textContent =
            'Не указан адрес счёта списания, или этот счёт не принадлежит нам';
          break;
        case 'Invalid account to':
          currencExMassage.textContent =
            'Не указан счёт зачисления, или этого счёта не существует';
          break;
        case 'Invalid amount':
          currencExMassage.textContent =
            'Не указана сумма перевода, или она отрицательная';
          break;
        case 'Overdraft prevented':
          currencExMassage.textContent =
            'Вы попытались перевести больше денег, чем доступно на счёте списания';
          break;
        case '':
          currencExMassage.textContent = 'Обмен валюты произведен';
          break;
        default:
          currencExMassage.textContent =
            'Не определенная ошибка, обратитесь к администратору';
      }
      submitExButton.setAttribute('disabled', 'disabled');
      // Обновляем список валют
      getYuorCurrency(tokenStorage).then((res) => {
        yuorCurrencyListBox.innerHTML = '';
        yuorCurrencyListBox.append(res);
      });
    });
  });

  // Получаем и русуеи сокет-чат с изменнием курса валюты
  let socket = new WebSocket('ws://localhost:3000/currency-feed');
  const chatList = el('ul.currency__exch-list');
  let chatListArr = [];
  socket.onmessage = function (event) {
    let chatItem = JSON.parse(event.data);
    if (chatItem.type === 'EXCHANGE_RATE_CHANGE') {
      if (chatListArr.length > 20) chatListArr.pop();
      if (chatItem.change === 1) {
        chatItem.chatIcon = changeUp;
      } else if (chatItem.change === -1) {
        chatItem.chatIcon = changeDown;
      } else {
        chatItem.chatIcon = '';
      }
      // console.log(chatItem.chatIcon);
      chatListArr.unshift(chatItem);
    } else {
      console.log('Получили данные не об изенениях на валютном рынке');
    }

    setChildren(
      chatList,
      chatListArr.map((chatItem) =>
        el(`li.currency__exch-item.change${chatItem.change}`, [
          el('.currency__exch-from-to', [
            el('span', `${chatItem.from}`),
            el('span', `/`),
            el('span', `${chatItem.to}`),
          ]),
          el('span.currency__exch-rate-change', [
            el('span', `${chatItem.rate}`),
            el('img.currency__exch-change-img', {
              src: chatItem.chatIcon,
              alt: 'icon',
            }),
          ]),
        ])
      )
    );
  };

  // Рисуем основную сетку
  const currencyExchangeGrit = el('.currency.container', [
    el('h1.currency__title.title', 'Валютный обмен'),
    el('.currency__grid', [
      el('.currency__grid-item.white-box', [
        el('.currency__item-name', 'Ваши валюты'),
        yuorCurrencyListBox,
      ]),
      el('.currency__grid-item.grey-box', [
        el('.currency__item-name', 'Изменение курсов в реальном времени'),
        chatList,
      ]),
      el('.currency__grid-item.white-box', [
        el('.currency__item-name', 'Обмен валюты'),
        exchangeForm,
        currencyInputError,
        currencExMassage,
      ]),
    ]),
  ]);
  setChildren(main, currencyExchangeGrit);

  // Загружаем и выводим информацию и валютных счетах
  getYuorCurrency(tokenStorage).then((res) => {
    // console.log('Загрузили!');
    yuorCurrencyListBox.append(res);
  });
}
