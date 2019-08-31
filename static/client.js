// set up vue.js

const app = new Vue({
	el: '#app',
	data: {
		temp: 0,
		loadavg: 0,
		memUsed: 0,
		memTotal: 0,
		swapUsed: 0,
		swapTotal: 0
	}
});

// set up chart

const ctx = document.getElementById('chart').getContext('2d');
const chart = new Chart(ctx, {
	type: 'line',
	data: {
		labels: [],
		datasets: [{
			label: '',
			backgroundColor: 'rgba(76, 175, 80, 0.4)',
			borderColor: 'rgba(76, 175, 80, 1)',
			data: []
		}]
	},
	options: {
		events: [],
		legend: {
			display: false,
		},
		responsive: true,
		scales: {
			xAxes: [{
				display: false
			}],
			yAxes: [{
				ticks: {
					beginAtZero: true,
					callback: (value) => {
						if (value % 1 === 0) {
							return value + '%';
						}
					},
					suggestedMax: 5
				}
			}]
		}
	}
});

// set up websockets

const socket = io({ path: '/socket.io' });

socket.on('update', (data) => {
	app.temp = data.temp;
	app.loadavg = data.loadavg;
	app.memUsed = data.memUsed;
	app.memTotal = data.memTotal;
	app.swapUsed = data.swapUsed;
	app.swapTotal = data.swapTotal;
	if (chart.data.datasets[0].data.length < 20) {
		chart.data.labels.push('');
	} else {
		chart.data.datasets[0].data.shift();
	}
	chart.data.datasets[0].data.push(data.node);
	chart.update();
});
