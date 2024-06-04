// @leonor aqui tou so a dar import do outro
// ficheiro script.js para não estar a repetir código...

//import { fetchApi, DATES} from "./script";
const DATES = 'https://api.cosmicjs.com/v3/buckets/ti-project-production/objects?pretty=true&query=%7B%22type%22:%22dates%22%7D&limit=10&read_key=gTRqDyjPMRAkcbCzQ0lkN6QowrCuKEnikL45ugW1p1hSee3a2s&depth=1&props=slug,title,metadata,id,'
let date;
import fetchApi from "./components/fetch.js";

document.addEventListener ('DOMContentLoaded', function() {



////______________________________________________________________________________________________________________

function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function generateLabels(month, year) {
    const daysInMonth = getDaysInMonth(month, year);
    const labels = [];

    for (let day = 1; day <= daysInMonth; day++) {
        labels.push(day.toString());
    }
    return labels;
}

const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1; // +1, os meses em JavaScript vão de 0 a 11
const currentYear = currentDate.getFullYear();
//jan 0 | fev 1 | mar 2 | abr 3 | maio 4 | jun 5 | jul 6 | ago 7 | set 8 | out 9 | nov 10 | dez 11

//const labels = ['1', '2','3', '4','5', '6','7'];
const labels = generateLabels(currentMonth, currentYear);
const data = {
  labels: labels,
  datasets: [{
    label: 'Número de cliques',
    data: [1, 3, 2, 10, 15, 20, 10, 8, 10, 2, 3, 0, 3, null, 0, 0],
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  }]
};
// </block:setup>

// <block:config:0>
const config = {
  type: 'line',
  data: data,
};
// </block:config>

/*module.exports = {
  actions: [],
  config: config,
};*/


// @leonor esta função deve dar-te jeito para depois usares
// na função que cria o gráfico

// returns an array with the number of clicks per day
// month: inteiro de 1-12, sem zeros, por exemplo, mês junho = '6' e não '06'

/*async function getMonthStats() {
  async () => {
    try {

      let dates = fetchApi(DATES);

      dates.forEach(date => {
        console.log[dates];
        // acede ao 2o numero na data AKA mês
        // @leonor isto ainda nao esta acabado, vou jantar...mas a ideia é por aqui
        // falta testar...
        getMonth = date.metadata.date.split('-');
        console.log(getMonth[1]);
      });
    } catch (error) {
      throw error;
    }
  }
}

getMonthStats();*/

//// @xana não apaguei o teu código, mas estive a continuar isto que tinhas em cima que não sei pq
//// não me estava a funcionar dentro da async(), mas assim funfa
//// criei o option dinamicamente (dependendo dos meses que estão no cosmic, provavalmente depois temos de fazer o mesmo com os anos)
//// falta fazer a função que retorna o counter para cada mês em array


// @leonor ja atualizei esta função
function getMonthStats(data, daysInMonth) {
  let months = Array.apply(null, Array(daysInMonth + 1)).map(Number.prototype.valueOf,0);
  data.forEach(date => {
        var arr = date.metadata.date.split('-');
        months[arr[0]] = date.metadata.counter;
  });

  return Array.from(months);
}

// Função para criar opções <input option>
function createMonthOptions(months) {
  let monthSelect = document.getElementById('month');
  let monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  
  months.forEach(month => {
      const option = document.createElement('option');
      option.value = month;
      option.innerHTML = monthNames[month-1];
      monthSelect.appendChild(option);
  });
}

//@xana esta função 
//função que retorne o array de counter de cada dia //dia associado a um mês, associado a um ano
function getCounter(day, month){

}


(async () => {
      try {
           date = await fetchApi(DATES);
          //displayDays(date);
          //console.log(getMonths(DATES));
          console.log(date);
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth() + 1; 
          const currentYear = currentDate.getFullYear();

          // @leonor counterPerDay retorna um array de tamanho igual ao nº de dias num mês
          // cada índice do array tem o contador do género...
          // só tens de aceder aos dias e tens la o contador
          // tecnicamente existe um indice 0, mas isso nao conta
          // array[diaX] = counterX

          let daysInMonth = getDaysInMonth(currentMonth, currentYear);
          let counterPerDay = getMonthStats(date, daysInMonth);
          console.log(counterPerDay);

          createMonthOptions(getMonthStats(date, daysInMonth));
      } catch (error) {
          console.error('Fetching error:', error);
          throw error;
      }
})();




const ctx = document.getElementById('myChart').getContext('2d');
new Chart(ctx, config);
});


/*
function getMonths(data) {
  let months = new Set();
  data.forEach(date => {

      console.log(date);
      //for(let i=0; i<date.length; i++){
      //}
        console.log(date.metadata.date);
        //split função
        var arr1 = date.metadata.date.split('-');
        console.log('date: ', arr1[0]);
        //console.log('month: ', arr1[1]);
        console.log('year: ', arr1[2]);

        const months = new Set();
        const month = arr1[1];
        months.add(month);
  });
}*/
