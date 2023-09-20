import { el } from 'redom';
import { user, getToken } from './api-server.js';

let toketfin = undefined;
let inputErrorSratus = [false, false];
const inputLogin = el('input.login-form__input.input', {
  id: 'user-login',
  name: 'user-login',
  placeholder: 'Placeholder',
});
const inputLoginError = el('.login-form__input-error.error');
const inputPassword = el('input.login-form__input.input', {
  id: 'user-password',
  name: 'user-password',
  placeholder: 'Placeholder',
});
const inputPasswordError = el('.login-form__input-error.error');
const errorBox = el('.login-form__error.error', { id: 'login-error' });
const submitButton = el(
  'button.login-form__button.btn',
  { disabled: 'disabled' },
  'Войти'
);

export const loginApp = el('form.login-form', [
  el('h2.login-form__title.title', 'Вход в аккаунт'),
  el('lable.login-form__lable', { for: 'user-login' }, [
    el('.login-form__text', 'Логин'),
    el('.login-form__input-box', [inputLogin, inputLoginError]),
  ]),
  el('lable.login-form__lable', { for: 'user-password' }, [
    el('.login-form__text', 'Пароль'),
    el('.login-form__input-box', [inputPassword, inputPasswordError, errorBox]),
  ]),
  el('.login-form__button-box', [submitButton]),
]);

function validateInput(input, errorBox, index) {
  input.addEventListener('input', () => {
    errorBox.textContent = '';
    setTimeout(() => {
      if (input.value.length < 6) {
        errorBox.textContent = 'Не менее 6 символов';
        inputErrorSratus[index] = false;
      } else if (input.value.includes(' ')) {
        errorBox.textContent = 'Без пробелов';
        inputErrorSratus[index] = false;
      } else {
        errorBox.textContent = '';
        inputErrorSratus[index] = true;
        // console.log(inputErrorSratus);
      }
      if (inputErrorSratus[0] === true && inputErrorSratus[1] === true)
        submitButton.removeAttribute('disabled', 'disabled');
      else submitButton.setAttribute('disabled', 'disabled');
    }, 300);
  });
}

validateInput(inputLogin, inputLoginError, 0);
validateInput(inputPassword, inputPasswordError, 1);

loginApp.addEventListener('submit', (e) => {
  e.preventDefault();
  user.login = inputLogin.value;
  user.password = inputPassword.value;
  // console.log(user);
  getToken(user).then((data) => {
    console.log(data);
    if (data.error === 'No such user')
      errorBox.textContent = 'Такого пользователя не существует';
    else if (data.error === 'Invalid password')
      errorBox.textContent = 'Неверный пароль';
    else if (data.error === '') {
      toketfin = data.payload.token;
      errorBox.textContent = '';
      console.log(`Успешна авторизация token - ${toketfin}`);
      // Сохранение данных в sessionStorage
      sessionStorage.setItem('coin-token', toketfin);
      location.reload();
    }
  });
});

export function exitApp(node) {
  node.addEventListener('click', () => {
    sessionStorage.setItem('coin-token', 'exit');
    location.reload();
  });
}
