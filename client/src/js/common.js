import { el, setChildren } from 'redom';

export const MONTHES = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
];

export function formatCost(price) {
  const arrCost = String(price).split('.');
  const formCost = arrCost[0].split('').reverse();
  let tempArr = [];
  let finArr = [];
  formCost.forEach((el) => {
    if (tempArr.length < 3) {
      tempArr.push(el);
    } else {
      finArr.push(tempArr.reverse().join(''));
      tempArr = [];
      tempArr.push(el);
    }
  });
  if (tempArr.length > 0) {
    finArr.push(tempArr.reverse().join(''));
    tempArr = [];
  };
  let pennes = null;
  if ( arrCost[1] === undefined ) {
    pennes = '00';
  } else {
    const pennesArr = arrCost[1].split('');
    if ( pennesArr.length === 2 ) {
      pennes = arrCost[1];
    } else if ( pennesArr.length === 1 ) {
      pennes = `${pennesArr}0`;
    }
  };
  const finalCostStr = `${finArr.reverse().join(' ')}.${pennes}`;
  return finalCostStr;
}

export function renderFormatData(acc) {
  // console.log(acc);
  if (acc.transactions.length === 0 || acc.transactions[0].nowData === true) {
    return 'Без транзакций';
  } else {
    const dataTrans = acc.transactions[0].date.split('T')[0].split('-');
    return `${dataTrans[2]} ${MONTHES[Number(dataTrans[1]) - 1]} ${
      dataTrans[0]
    }`;
  }
}

export function renderFormatDataDatails(date) {
  const dataTrans = date.split('T')[0].split('-');
  return `${dataTrans[2]}.${dataTrans[1]}.${dataTrans[0]}`;
}

export function renderSelect(arr, cssClass) {
  const select = el(`select.select.${cssClass}__select`);
  setChildren(
    select,
    arr.map((option) =>
      el(
        `option.select__option.${cssClass}__option`,
        { value: `${option}` },
        `${option}`
      )
    )
  );
  return select;
}

import iconBack from '../assets/images/icon-back.svg';
export function renderDetailTitleBox(accId, balance) {
  let accBalance = '0.00';
  // console.log(balance);
  if (balance !== '0.00') accBalance = balance;
  const detailTitleBox = el('.details__title-box', [
    el('.details__title-item', [
      el('h1.details__title', 'Просмотр счёта'),
      el('.details__acc-number', `№ ${accId}`),
    ]),
    el('.details__title-item', [
      el('a.details__title-btn.btn', { href: '/' }, [
        el('img.details__icon-back', { src: iconBack }),
        el('span', 'Вернуться назад'),
      ]),
      el('.details__balanse', [
        el('span.details__balanse-title', 'Баланс: '),
        el('span.details__balanse-value', `${accBalance} ₽`),
      ]),
    ]),
  ]);
  return detailTitleBox;
}

// Формируем пагинацию по страницам категори
export const historyTableBox = el('.balanse__box-table');
export function renderTable(allList, numbItems, start, end) {
  let showListItems = null;
  if (!start) {
    showListItems = allList.slice(0, numbItems);
  } else {
    showListItems = allList.slice(start, end);
  }
  const accauntTransList = el('tbody.details__tbody');
  setChildren(
    accauntTransList,
    showListItems.map((element) =>
      el('tr.details__tr', [
        el('td.details__td', `${element.from}`),
        el('td.details__td', `${element.to}`),
        el(
          'td.details__td',
          el(`span.${element.debit}`, `${formatCost(element.amount)}`)
        ),
        el('td.details__td', `${renderFormatDataDatails(element.date)}`),
      ])
    )
  );
  const detailsTable = el('table.details__table', [
    el('thead.details__thead', [
      el('tr.details__tr', [
        el('td.details__th', 'Счет отправителя'),
        el('td.details__th', 'Счет получателя'),
        el('td.details__th', 'Сумма'),
        el('td.details__th', 'Дата'),
      ]),
    ]),
    accauntTransList,
  ]);
  return detailsTable;
}

export function createPagination(allList) {
  const paginationBox = el('.pagination');
  let allBullits = [];
  let counterPages = Math.ceil(allList.length / 25);
  for (let pageNumb = 1; pageNumb <= counterPages; pageNumb++) {
    const paginationBulit = el('.pagination__bulit', `${pageNumb}`);
    allBullits.push(paginationBulit);
    paginationBox.append(paginationBulit);
    paginationBulit.classList.remove('pagination__bulit-none');
    if (counterPages === 1) {
      paginationBulit.classList.add('pagination__bulit-none');
    }
    if (pageNumb > 10) {
      paginationBulit.classList.add('pagination__bulit-none');
    }
  }
  const allButton = el(
    'button.pagination__btn-all.pagination__btn-none',
    'Показать все'
  );
  if (counterPages > 10) allButton.classList.remove('pagination__btn-none');
  const allPages = el('.pagination__desc', [
    el('span.pagination__text', `Всего страниц - ${counterPages}`),
    allButton,
  ]);
  return {
    paginationBox,
    allBullits,
    allPages,
    allButton,
  };
}
