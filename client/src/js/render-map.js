import { el, setChildren } from 'redom';
import { main } from '../bandel.js';
import { loaderWhiteCont } from './loaders.js';
import { formatCost } from './common.js';

export function createBanksMap() {

  setChildren(main, loaderWhiteCont);

  const mapScript = el('script', {
    type: 'text/javascript',
    charset: 'utf-8',
    async: 'async',
    src: 'https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A4605c963ede795642c18c71d501d50625944d73b90293cd385548e115b73f3ce&amp;width=100%25&amp;height=600&amp;lang=ru_RU&amp;scroll=true',
  });
  const mapOffices = el(
    '.map.container',
    el('h1.map__title.title', 'Карта банкоматов'),
    mapScript
  );

  setChildren(main, mapOffices);

}
