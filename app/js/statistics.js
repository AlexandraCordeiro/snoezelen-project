

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

window.onload = function() {
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, config);
};