// import Plotly from 'plotly.js-dist-min';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const MONS = [
  '',
  'янв',
  'фев',
  'мар',
  'апр',
  'май',
  'июн',
  'июл',
  'авг',
  'сен',
  'окт',
  'ноя',
  'дек',
];

export function transDataAddDebit(arr, acauntId) {
  arr.forEach((el) => {
    if (el.from === acauntId) {
      el.debit = 'debit-minus';
    } else {
      el.debit = 'debit-plus';
    }
  });
  return arr;
}

export function createYearMonth(number) {
  let NOW_YEAR = new Date().getFullYear();
  let NOW_MONTH = new Date().getMonth() + 1;
  let numberMonth = [];
  for (let el = 0; el < number; el++) {
    let index = NOW_MONTH - el;
    if (index > 0) {
      if (index > 9) {
        numberMonth.push(`${NOW_YEAR}-${String(index)}`);
      } else {
        numberMonth.push(`${NOW_YEAR}-0${String(index)}`);
      }
    } else {
      if (index + 12 > 9) {
        numberMonth.push(`${NOW_YEAR - 1}-${String(index + 12)}`);
      } else {
        numberMonth.push(`${NOW_YEAR - 1}-0${String(index + 12)}`);
      }
    }
  }
  // console.log(numberMonth);
  return numberMonth;
}

function createMonthOfGraf(month) {
  const numberMon = [];
  // console.log(month);
  month.forEach((el) => {
    let addMonth = MONS[Number(el.split('-')[1])];
    numberMon.push(addMonth);
  });
  return numberMon;
}

export function calkTotalAmounts(arrData, arrMonth) {
  const totalAmounts = [];
  arrMonth.forEach((yearMonth) => {
    const mouthArr = arrData.filter(
      (el) => el.date.startsWith(yearMonth) === true
    );
    const totalAmountMonth = mouthArr.reduce(
      (total, item) => total + item.amount,
      0
    );
    totalAmounts.push(totalAmountMonth);
  });
  // console.log(totalAmounts);
  return totalAmounts;
}

export function calkTotalAmountsParam(arrData, arrMonth, paramDebit) {
  const totalAmountsParam = [];
  arrMonth.forEach((yearMonth) => {
    const mouthArr = arrData
      .filter((el) => el.date.startsWith(yearMonth) === true)
      .filter((el) => el.debit === paramDebit);
    const totalAmountMonth = mouthArr.reduce(
      (total, item) => total + item.amount,
      0
    );
    totalAmountsParam.push(totalAmountMonth);
  });
  // console.log(totalAmountsParam);
  return totalAmountsParam;
}

// Вариант на Chart
export function renderChartOne(month, totalAmounts, box) {
  const total = Math.round(
    totalAmounts.reduce((total, item) => total + item, 0)
  );
  const myChart1 = new Chart(box, {
    type: 'bar',
    data: {
      labels: createMonthOfGraf(month),
      datasets: [
        {
          label: total,
          data: totalAmounts,
          backgroundColor: 'rgba(17, 106, 204, 1)',
          borderColor: 'rgba(0, 0, 0, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          display: false,
        },
      },
    },
  });
}

export function renderChartTwo(
  month,
  totalAmountsPlus,
  totalAmountsMinus,
  box
) {
  const totalPlus = Math.round(
    totalAmountsPlus.reduce((total, item) => total + item, 0)
  );
  const totalMinus = Math.round(
    totalAmountsMinus.reduce((total, item) => total + item, 0)
  );
  const myChart2 = new Chart(box, {
    type: 'bar',
    data: {
      labels: createMonthOfGraf(month),
      datasets: [
        {
          label: totalMinus,
          data: totalAmountsMinus,
          backgroundColor: 'rgba(253, 78, 93, 1)',
          borderColor: 'rgba(0, 0, 0, 1)',
          borderWidth: 1,
        },
        {
          label: totalPlus,
          data: totalAmountsPlus,
          backgroundColor: 'rgba(118, 202, 102, 1)',
          borderColor: 'rgba(0, 0, 0, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
          beginAtZero: true,
          display: false,
        },
      },
    },
  });
}

// Вариант на Plotly
// export function renderPlotlyOne(month, totalAmounts, box) {
//   const dataGraf = [
//     {
//       type: 'bar',
//       marker: {
//         color: 'rgb(17,106,204)',
//       },
//       line: {
//         color: 'rgb(0,0,0)',
//         width: 1,
//       },
//     },
//   ];
//   dataGraf[0].x = createMonthOfGraf(month);
//   dataGraf[0].y = totalAmounts;
//   Plotly.newPlot(box, dataGraf);
// }

// export function renderPlotlyTwo(
//   month,
//   totalAmountsPlus,
//   totalAmountsMinus,
//   box
// ) {
//   const totalPlus = Math.round(
//     totalAmountsPlus.reduce((total, item) => total + item, 0)
//   );
//   const totalMinus = Math.round(
//     totalAmountsMinus.reduce((total, item) => total + item, 0)
//   );
//   const tracePlus = {
//     type: 'bar',
//     name: totalPlus,
//     marker: {
//       color: 'rgb(118,202,102)',
//     },
//     line: {
//       color: 'rgb(0,0,0)',
//       width: 1,
//     },
//   };
//   tracePlus.x = createMonthOfGraf(month);
//   tracePlus.y = totalAmountsPlus;
//   const traceMinus = {
//     type: 'bar',
//     name: totalMinus,
//     marker: {
//       color: 'rgb(253,78,93)',
//     },
//     line: {
//       color: 'rgb(0,0,0)',
//       width: 1,
//     },
//   };
//   traceMinus.x = createMonthOfGraf(month);
//   traceMinus.y = totalAmountsMinus;
//   const dataGrafPlusMinus = [traceMinus, tracePlus];
//   const layout = { barmode: 'stack' };
//   Plotly.newPlot(box, dataGrafPlusMinus, layout);
// }
