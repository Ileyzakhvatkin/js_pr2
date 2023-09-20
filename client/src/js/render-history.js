import { el, setChildren } from 'redom';
import { getAccountDetails } from './api-server.js';
import { main } from '../bandel.js';
import { loaderWhiteCont } from './loaders.js';
import {
  formatCost,
  renderDetailTitleBox,
  historyTableBox,
  renderTable,
  createPagination,
} from './common.js';
import {
  transDataAddDebit,
  createYearMonth,
  calkTotalAmounts,
  renderChartOne,
  calkTotalAmountsParam,
  renderChartTwo,
} from './graf.js';

export function createAccoutsHistory() {
  setChildren(main, loaderWhiteCont);

  const tokenStorage = sessionStorage.getItem('coin-token');
  const clientAccauntId = JSON.parse(localStorage.getItem('clientAccauntId'));

  getAccountDetails(tokenStorage, clientAccauntId).then((data) => {
    // console.log(data);
    const accauntTransData = data.payload.transactions;
    const accauntTransDataDebit = transDataAddDebit(
      accauntTransData,
      clientAccauntId
    ).reverse();

    // Определяем месяцы и расчитываем данные для грфика
    const numberMonth = createYearMonth(12);
    const totalAmounts = calkTotalAmounts(accauntTransDataDebit, numberMonth);
    const boxGrafOne = el('canvas.balanse__graf', {
      id: 'mainGrafOne',
      width: '1000',
      height: '165',
    });
    renderChartOne(numberMonth, totalAmounts, boxGrafOne);

    const totalAmountsPlus = calkTotalAmountsParam(
      accauntTransDataDebit,
      numberMonth,
      'debit-plus'
    );
    const totalAmountsMinus = calkTotalAmountsParam(
      accauntTransDataDebit,
      numberMonth,
      'debit-minus'
    );
    const boxGrafTwo = el('canvas.balanse__graf', {
      id: 'mainGrafTwo',
      width: '1000',
      height: '165',
    });
    renderChartTwo(
      numberMonth,
      totalAmountsPlus,
      totalAmountsMinus,
      boxGrafTwo
    );

    const paginationBox = el('.balanse__pagination');
    const pagination = createPagination(accauntTransDataDebit);
    paginationBox.append(pagination.paginationBox);
    paginationBox.append(pagination.allPages);

    const balanseHistory = el('.balanse.container', [
      renderDetailTitleBox(clientAccauntId, formatCost(data.payload.balance)),
      el('.balanse__grid', [
        el('.balanse__item.white-box', [
          el('h2.balanse__box-title', 'Динамика баланса'),
          boxGrafOne,
        ]),
        el('.balanse__item.white-box', [
          el(
            'h2.balanse__box-title',
            'Соотношение входящих исходящих транзакций'
          ),
          boxGrafTwo,
        ]),
        el('.balanse__item.grey-box', [
          el('h2.balanse__box-title', 'История переводов'),
          historyTableBox,
          paginationBox,
        ]),
      ]),
    ]);
    historyTableBox.append(renderTable(accauntTransDataDebit, 25));

    setChildren(main, balanseHistory);

    pagination.allBullits.forEach((element) => {
      element.addEventListener('click', (event) => {
        pagination.allBullits.forEach((el) => {
          el.classList.remove('pagination__bulit-active');
        });
        event.target.classList.toggle('pagination__bulit-active');
        // console.log(event.target.innerText);
        let start = (event.target.innerText - 1) * 25;
        let end = start + 25;
        historyTableBox.innerHTML = '';
        historyTableBox.append(
          renderTable(accauntTransDataDebit, 25, start, end)
        );
        pagination.allBullits.forEach((el, index) => {
          // console.log(typeof Number(event.target.innerText));
          if (
            index < Number(event.target.innerText) - 5 ||
            index > Number(event.target.innerText) + 5
          ) {
            el.classList.add('pagination__bulit-none');
          } else {
            el.classList.remove('pagination__bulit-none');
          }
        });
      });
    });
    pagination.allButton.addEventListener('click', () => {
      pagination.allBullits.forEach((el) => {
        el.classList.remove('pagination__bulit-none');
      });
    });
  });
}
