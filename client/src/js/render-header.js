import { el } from 'redom';
import logo from '../assets/images/logo.svg';

export const headerUnlogin = el(
  'header.header',
  el(
    'div.header__container container',
    el(
      'a.header__logo-link',
      { href: '/' },
      el('img.header__logo', { src: logo })
    )
  )
);

export const exitButton = el(
  'a.header__nav-link',
  { href: '/', id: 'app-exit' },
  'Выйти'
);

export const header = el(
  'header.header',
  el('div.header__container container', [
    el(
      'a.header__logo-link',
      { href: '/' },
      el('img.header__logo', { src: logo })
    ),
    el('nav.header__nav', [
      el(
        'div.header__nav-item',
        el('a.header__nav-link', { href: '/' }, 'Счета')
      ),
      el(
        'div.header__nav-item',
        el('a.header__nav-link', { href: '/currency-exchange/' }, 'Валюта')
      ),
      el('div.header__nav-item', exitButton),
    ]),
  ])
);
