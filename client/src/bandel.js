import 'babel-polyfill';
import { el, setChildren } from 'redom';
import './styles/styles.scss';
import favicon from './assets/images/favicon.svg';
import Navigo from 'navigo';
import { header, headerUnlogin, exitButton } from './js/render-header.js';
import { getAllCurrencyCode } from './js/api-server.js';
import { loginApp, exitApp } from './js/render-login.js';
import { createAccoutsList } from './js/render-list.js';
import { createAccoutsDatails } from './js/render-account.js';
import { createAccoutsHistory } from './js/render-history.js';
import { createCurrencyPage } from './js/render-currency.js';

const router = new Navigo('/');
export const body = window.document.body;
export const main = el('main.main');

window.document.head.append(
  el('link', { rel: 'icon', type: 'image/svg+xml', href: favicon })
);

// Получение данных из sessionStorage
let tokenStorage = sessionStorage.getItem('coin-token');

// Загружаем список Валют в localstorage
getAllCurrencyCode().then((data) => {
  let initialCurrencyCodeArray = JSON.parse(
    localStorage.getItem('allCurrencyCode')
  );
  if (initialCurrencyCodeArray === null) {
    localStorage.setItem('allCurrencyCode', JSON.stringify(data.payload));
  }
});

// Формируем навигацию
if (tokenStorage === null || tokenStorage === 'exit') {
  router.on('/', () => {
    setChildren(body, [headerUnlogin, loginApp]);
  });
} else {
  router.on('/', () => {
    setChildren(body, [header, main]);
    createAccoutsList();
  });
  router.on('/currency-exchange/', () => {
    setChildren(body, [header, main]);
    createCurrencyPage();
  });
  router.on(`/account/:id`, () => {
    setChildren(body, [header, main]);
    createAccoutsDatails();
  });
  router.on(`/account-history/:id`, () => {
    setChildren(body, [header, main]);
    createAccoutsHistory();
  });
}
router.resolve();
// Выхд из приложеия
exitApp(exitButton);
