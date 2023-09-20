import { el } from 'redom';
import loaderBlueSvg from '../assets/images/loader-blue.svg';
import loaderWhiteSvg from '../assets/images/loader-white.svg';

export const loaderWhiteCont = el(
  '.loader.container',
  el('img.loader__img', { src: loaderBlueSvg, alt: 'Loader...' })
);

export const loaderWhitebox = el(
  '.loader',
  el('img.loader__img', { src: loaderBlueSvg, alt: 'Loader...' })
);

export const loaderBlueBox = el(
  '.loader-bluebox.container',
  el('img.loader__img', { src: loaderWhiteSvg, alt: 'Loader...' })
);
