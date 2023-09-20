import { el, setChildren } from 'redom';
import { formatCost } from './common.js';
import { loaderWhitebox } from './loaders.js';

export let user = {};

export async function getToken(user) {
  let response = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(user),
  });
  let result = await response.json();
  return result;
}

export async function getAccounts(token) {
  const response = await fetch('http://localhost:3000/accounts', {
    headers: {
      Authorization: `Basic ${token}`,
    },
  });
  const data = await response.json();
  return data;
}

export async function getAccountDetails(token, id) {
  const response = await fetch(`http://localhost:3000/account/${id}`, {
    headers: {
      Authorization: `Basic ${token}`,
    },
  });
  const data = await response.json();
  return data;
}

export async function createNewAccount(token) {
  const response = await fetch('http://localhost:3000/create-account', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${token}`,
      'Content-type': 'application/json',
    },
    body: JSON.stringify({}),
  });
  let result = await response.json();
  return result;
}

export async function transactionBetweenAcc(token, form, to, amount) {
  const response = await fetch('http://localhost:3000/transfer-funds', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${token}`,
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      from: form,
      to: to,
      amount: amount,
    }),
  });
  let result = await response.json();
  return result;
}

export async function getCurrenciesAccounts(token) {
  const response = await fetch('http://localhost:3000/currencies', {
    headers: {
      Authorization: `Basic ${token}`,
    },
  });
  const data = await response.json();
  return data;
}

export async function getAllCurrencyCode() {
  const response = await fetch('http://localhost:3000/all-currencies');
  const data = await response.json();
  return data;
}

export async function getYuorCurrency(token) {
  const yuorCurrencyList = el(`ul.currency__yuor-currency-list`);
  setChildren(yuorCurrencyList, loaderWhitebox);

  const response = await fetch('http://localhost:3000/currencies', {
    headers: {
      Authorization: `Basic ${token}`,
    },
  });
  const data = await response.json();
  const currencyArr = Object.values(data.payload);

  setChildren(
    yuorCurrencyList,
    currencyArr.map((element) =>
      el('li.currency__yuor-currency-item', [
        el('span.currency__yuor-currency-code', `${element.code}`),
        el(
          'span.currency__yuor-currency-amount',
          `${formatCost(Math.round(element.amount * 100) / 100)}`
        ),
      ])
    )
  );
  return yuorCurrencyList;
}

export async function exchangeYuorCurrency(token, form, to, amount) {
  const response = await fetch('http://localhost:3000/currency-buy', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${token}`,
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      from: form,
      to: to,
      amount: amount,
    }),
  });
  let result = await response.json();
  return result;
}

export async function getBanksPoint() {
  const response = await fetch('http://localhost:3000/banks');
  const data = await response.json();
  return data;
}
