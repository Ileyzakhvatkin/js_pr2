import { el, setChildren } from 'redom';
import Navigo from 'navigo';
const router = new Navigo('/');
import { main } from '../bandel.js';
import { getAccountDetails, transactionBetweenAcc } from './api-server.js';
import { loaderWhiteCont } from './loaders.js';
import {
  formatCost,
  renderDetailTitleBox,
  historyTableBox,
  renderTable,
} from './common.js';
import {
  transDataAddDebit,
  createYearMonth,
  calkTotalAmounts,
  renderChartOne,
} from './graf.js';
import iconMail from '../assets/images/icon-mail.svg';

export async function createAccoutsDatails() {
  setChildren(main, loaderWhiteCont);

  const tokenStorage = sessionStorage.getItem('coin-token');
  const clientAccauntId = JSON.parse(localStorage.getItem('clientAccauntId'));
  const allClientAccaunts = JSON.parse(
    localStorage.getItem('allClientAccaunts')
  );

  getAccountDetails(tokenStorage, clientAccauntId).then((data) => {
    // Обрабатываем данные с сервера
    // console.log(data.payload.transactions);
    const accauntTransData = data.payload.transactions;
    const accauntTransDataDebit = transDataAddDebit(
      accauntTransData,
      clientAccauntId
    ).reverse();

    // Определяем месяцы и расчитываем данные для грфика
    const numberMonth = createYearMonth(6);
    const totalAmounts = calkTotalAmounts(accauntTransDataDebit, numberMonth);
    const renderGraf = el('canvas.details__graf', {
      id: 'mainGraf',
      width: '510',
      height: '165',
    });

    // Рендер формы
    const inputAccNumber = el('input.details__form-input.input', {
      type: 'text',
      placeholder: 'Placeholder',
      name: 'trans-accaunt'
    });
    const inputTransAmount = el('input.details__form-input.input', {
      type: 'number',
      placeholder: 'Placeholder',
      name: 'trans-amount'
    });
    const submitTranslation = el(
      'button.details__form-btn.btn',
      { type: 'submit', disabled: 'disabled' },
      [el('img.details__icon-mail', { src: iconMail }), el('span', 'Отправить')]
    );
    const transError = el('.details__form-error');
    const transactionForm = el('form.details__form', [
      el('lable.details__form-lable', [
        el('span.details__form-span', 'Номер счёта получателя'),
        inputAccNumber,
      ]),
      el('lable.details__form-lable', [
        el('span.details__form-span', 'Сумма перевода'),
        inputTransAmount,
      ]),
      el('.details__form-btn-box', [submitTranslation]),
    ]);

    // Рендер основной сетки и таблицы
    const accDetails = el('.details.container', [
      renderDetailTitleBox(clientAccauntId, formatCost(data.payload.balance)),
      el('.details__grid', [
        el('.details__grid-box.grey-box', [
          el('h3.details__box-title', 'Новый перевод'),
          transactionForm,
          transError,
        ]),
        el('.details__grid-box.white-box', [
          el('h3.details__box-title', 'Динамика баланса'),
          el('.details__graf-box', renderGraf),
          el(
            '.details__more-box',
            el(
              'a.details__more',
              {
                href: `account-history/${clientAccauntId}`,
                onclick(event) {
                  event.preventDefault();
                  router.navigate(event.target.getAttribute('href'));
                  location.reload();
                },
              },
              'Подробнее...'
            )
          ),
        ]),
        el('.details__grid-box.grey-box', [
          el('h3.details__box-title', 'История переводов'),
          el('h3.details__table-cont', { id: 'table-cont' }, historyTableBox),
        ]),
      ]),
    ]);
    setChildren(main, accDetails);
    historyTableBox.append(renderTable(accauntTransDataDebit, 10));
    // Рисуем график
    renderChartOne(numberMonth, totalAmounts, renderGraf);

    // Делаем автоподставление в input
    inputAccNumber.addEventListener('input', () => {
      let sortArr = [];
      allClientAccaunts.forEach((element) => {
        if (element.startsWith(inputAccNumber.value)) sortArr.push(element);
      });
      if (sortArr.length === 1) inputAccNumber.value = sortArr[0];
    });

    // Проверяем все ли поля формы заполнены верно
    function validateForm() {
      transError.textContent = '';
      // console.log(JSON.stringify(inputAccNumber.value).length);
      if (
        JSON.stringify(inputAccNumber.value).length > 20 &&
        Number(inputTransAmount.value) > 0
      ) {
        submitTranslation.removeAttribute('disabled', 'disabled');
      } else {
        submitTranslation.setAttribute('disabled', 'disabled');
      }
    }
    inputAccNumber.addEventListener('input', () => validateForm());
    inputTransAmount.addEventListener('input', () => validateForm());

    // Обрабатываем форму перевода средств со счета на счет
    transactionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // console.log(inputAccNumber.value);
      transactionBetweenAcc(
        tokenStorage,
        clientAccauntId,
        String(inputAccNumber.value),
        inputTransAmount.value
      ).then((result) => {
        console.log(result);
        switch (result.error) {
          case 'Invalid account from':
            transError.textContent =
              'Не указан адрес счёта списания, или этот счёт не принадлежит нам';
            break;
          case 'Invalid account to':
            transError.textContent =
              'Не указан счёт зачисления, или этого счёта не существует';
            break;
          case 'Invalid amount':
            transError.textContent =
              'Не указана сумма перевода, или она отрицательная;';
            break;
          case 'Overdraft prevented':
            transError.textContent =
              'Вы попытались перевести больше денег, чем доступно Вам на счёте списания';
            break;
          case '':
            transError.textContent = 'Перевод средств осуществлен';
            break;
          default:
            transError.textContent =
              'Не определенная ошибка, обратитесь к администратору';
        }
        submitTranslation.setAttribute('disabled', 'disabled');

        getAccountDetails(tokenStorage, clientAccauntId).then((data) => {
          historyTableBox.innerHTML = '';
          historyTableBox.append(
            renderTable(
              transDataAddDebit(
                data.payload.transactions,
                clientAccauntId
              ).reverse(),
              10
            )
          );
        });
      });
    });
  });
}
