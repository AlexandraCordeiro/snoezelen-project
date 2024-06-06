
///// SE DER TER PENSAR COMO FAZER O UPDATE DO GRÁFICO SEM CRIAR UMA FUNÇÃO 
/////ver aqui https://www.chartjs.org/docs/latest/charts/line.html
const DATES = 'https://api.cosmicjs.com/v3/buckets/ti-project-production/objects?pretty=true&query=%7B%22type%22:%22dates%22%7D&limit=10&read_key=gTRqDyjPMRAkcbCzQ0lkN6QowrCuKEnikL45ugW1p1hSee3a2s&depth=1&props=slug,title,metadata,id,'
let date;
import fetchApi from "./components/fetch.js";
let monthSelect = document.getElementById('month');
let crDate = new Date();
let crMonth = crDate.getMonth() + 1; // +1, os meses em JavaScript vão de 0 a 11
let ctx;
document.addEventListener ('DOMContentLoaded', function() {

//////// CRIAR O INPUT DO TIPO OPTION__________________________________________________________________________________________________________
//Retorna um array com os meses que existem na api
function getMonth(data){
    let month = new Set();
    data.forEach(date => {
          //split função
          var arr = date.metadata.date.split('-');
          month.add(arr[1]);
    });
    return Array.from(month);
}


//Função para criar opções <input option> com os meses que existem na api
function createMonthOptions(months) {
    let monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    
    months.forEach(month => {
        const option = document.createElement('option');
        option.value = month;
        //console.log(option.value);
        option.innerHTML = monthNames[month-1] + "  2024";
        if (month === "" + crMonth + "") { //começa pelo mês atual 
            option.setAttribute("selected", "selected");
        }
        monthSelect.appendChild(option);
    });
}

////////__________________________________________________________________________________________________________


function changeMonth(){
    //let month = monthSelect.value;
    let m = monthSelect.value; 
    //console.log(currentMonth);
    return m;
  }

  let currentDate = new Date();
  let currentMonth = currentDate.getMonth() + 1; // +1, os meses em JavaScript vão de 0 a 11
  let currentYear = currentDate.getFullYear();
  //let daysInMonth = getDaysInMonth(currentMonth, currentYear);


function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}
let months;

function update(data, mes) {
    
    let daysInMonth2 = getDaysInMonth( '' + mes + '', currentYear);
    let dia;

    months = Array.apply(null, Array(daysInMonth2+1)).map(Number.prototype.valueOf,0);

    data.forEach(month => {
        if(month.metadata.date.split('-')[1]===mes){
            //console.log("sucesso");
            //console.log(mes);
            //console.log(`Mês: ${mes}, dia: ${month.metadata.date.split('-')[0]}, counter: ${month.metadata.counter}`)
            dia = month.metadata.date.split('-')[0] - 1;
            //console.log(dia);

            months[dia]+=month.metadata.counter;
        }
    });

    //console.log(months);
    return months;
}

function generateLabels(month, year) {
  const daysInMonth = getDaysInMonth(month, year);
  const labels = [];

  for (let day = 1; day <= daysInMonth; day++) {
      labels.push(day.toString());
  }
  return labels;
}


let mes = currentMonth;
let dt = [];
let labels = [];
let myChart;

function graphic(date,labels,dt){
    if (myChart) {
        myChart.destroy();
    }

    const data = {
    labels: labels,
    datasets: [{
      label: 'Número de cliques',
      //data: [1, 3, 2, 10, 15, 20, 10, 8, 10, 2, 3, 0, 3, null, 0, 0],
      data: dt,
      fill: false,
      borderColor: '#E76F00',
      tension: 0.1
    }]
    };
    
    const config = {
    type: 'line',
    data: data,
    scales: {
        y: {
            stacked: true
        }
    }
    };
    
    ctx = document.getElementById('myChart').getContext('2d');
    const w = window.innerWidth;
    if(w<500){
        ctx.canvas.height = 400; 
    }else if(w>500 && w<650){
        ctx.canvas.height = 300; 
    }
    // Definir a altura do canvas caso seja em mobile
    myChart = new Chart(ctx, config);

}

let crDate2 = new Date();
let crMonth2 = crDate2.getMonth() + 1; // +1, os meses em JavaScript vão de 0 a 11

(async () => {
      try {
          date = await fetchApi(DATES);
          let labelsi = generateLabels('' + crMonth + '', currentYear);
          let dti = update(date,'' + crMonth + '');
           graphic(date, labelsi, dti);
          

          /////CRIAR O INPUT DO TIPO OPTION______________________________
          let monthsOption = getMonth(date);
          createMonthOptions(monthsOption);
          

          /////Quando se altera os valores do select______________________________
          monthSelect.addEventListener("change", function(){
            mes = changeMonth();
            console.log(mes);
            update(date, mes);
            dt = months;
            labels = generateLabels(mes, currentYear);
            console.log(labels);
            //let array =months.split(",").map(Number);
            //console.log("dt: " +  array);
            graphic(date, labels, dt);
        });


      } catch (error) {
          console.error('Fetching error:', error);
          throw error;
      }
})();

});
