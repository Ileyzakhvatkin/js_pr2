import { el, setChildren } from 'redom';
import { main } from '../bandel.js';

export function create404() {
  setChildren(
    main,
    el('.map.container', [
      el('h1.map__title.title', 'Ошибка 404'),
    ])
  );
}

