import { el, setChildren } from 'redom';
import Navigo from 'navigo';
const router = new Navigo('/');
import { loaderWhiteCont } from './loaders.js';
import {
  formatCost,
  renderFormatData,
  renderSelect,
} from './common.js';
import { getAccounts, createNewAccount } from './api-server.js';
import { main } from '../bandel.js';
import iconPlus from '../assets/images/icon-plus.svg';

export async function createAccoutsList() {
  setChildren(main, loaderWhiteCont);

  let tokenStorage = sessionStorage.getItem('coin-token');

  getAccounts(tokenStorage).then((data) => {
    // console.log(data.payload);
    const accauntListData = data.payload;
    const allClientAccaunts = data.payload.map((acc) => acc.account);
    // console.log(allClientAccaunt);
    localStorage.setItem(
      'allClientAccaunts',
      JSON.stringify(allClientAccaunts)
    );

    const accItems = el('.list__grid');

    function renderAccList(array) {
      setChildren(
        accItems,
        array.map((acc) =>
          el('.list__item.white-box', [
            el('.list__item-account', `${acc.account}`),
            el('.list__item-balance', `${formatCost(acc.balance)} ₽`),
            el('.list__item-box', [
              el('.list__item-teransaction', [
                el('.list__item-teransaction-title', 'Последняя транзакция'),
                el('.list__item-teransaction-data', renderFormatData(acc)),
              ]),
              el(
                'a.list__item-button.btn',
                {
                  href: `account/${acc.account}`,
                  onclick(event) {
                    event.preventDefault();
                    router.navigate(event.target.getAttribute('href'));
                    localStorage.setItem(
                      'clientAccauntId',
                      JSON.stringify(acc.account)
                    );
                    location.reload();
                  },
                },
                'Открыть'
              ),
            ]),
          ])
        )
      );
    }
    renderAccList(accauntListData);

    const SORT_LIST_TYPE = [
      'Сортировка',
      'По номеру',
      'По балансу',
      'По последней транзакции',
    ];

    const sortSelectList = renderSelect(SORT_LIST_TYPE, 'list');
    const createAcc = el('button.list__button-add.btn', [
      el('img.list__icon-plus', { src: iconPlus }),
      el('span', 'Создать новый счет'),
    ]);
    const accList = el('.list.container', [
      el('.list__title-box.title', [
        el('.list__title.title', 'Ваши счета'),
        el('.list__title-sort', sortSelectList),
        createAcc,
      ]),
      accItems,
    ]);

    setChildren(main, accList);

    createAcc.addEventListener('click', () => {
      // console.log('Создаем новый счет!');
      createAcc.setAttribute('disabled', 'disabled');
      // setTimeout(() => {
      //   createAcc.removeAttribute('disabled', 'disabled');
      // }, 2000);
      createNewAccount(tokenStorage);
      location.reload();
    });

    sortSelectList.addEventListener('input', () => {
      switch (sortSelectList.value) {
        case 'По номеру':
          accauntListData.sort((a, b) => (a.account > b.account ? 1 : -1));
          break;
        case 'По балансу':
          accauntListData.sort((a, b) => (a.balance < b.balance ? 1 : -1));
          break;
        case 'По последней транзакции':
          accauntListData.forEach((el) => {
            if (el.transactions[0] === undefined) {
              el.sortDate = '1970-01-01T00:00:01.549Z';
            } else {
              el.sortDate = el.transactions[0].date;
            }
          });
          accauntListData.sort((a, b) => (a.sortDate < b.sortDate ? 1 : -1));
          break;
      }
      renderAccList(accauntListData);
    });
  });
}
