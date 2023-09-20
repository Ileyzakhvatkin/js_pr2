import { el, setChildren } from 'redom';
import { getBanksPoint } from './api-server.js';
import { main } from '../bandel.js';

export function createBanksMap() {
  getBanksPoint().then((data) => {
    console.log(data);

    const mapOffices = el('.map_yamap', { id: 'yamap' });
    setChildren(
      main,
      el('.map.container', [
        el('h1.map__title.title', 'Карта банкоматов'),
        mapOffices,
      ])
    );

    // ymaps.ready(init);
    // function init() {
    //   // Создание карты.
    //   let myMap = new ymaps.Map('yamap', {
    //     center: [55.71666704514293, 37.74550154640028],
    //     zoom: 14,
    //   });
    //   // Создание геообъекта с типом точка (метка).
    //   let myGeoObject = new ymaps.GeoObject({
    //     geometry: {
    //       type: 'Point', // тип геометрии - точка
    //       coordinates: [55.71666704514293, 37.74550154640028], // координаты точки
    //     },
    //   });
    //   myMap.geoObjects.add(myGeoObject);
    // }
  });
}
