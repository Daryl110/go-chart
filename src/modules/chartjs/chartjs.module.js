/**
 * @module ChartJSModule
 * @namespace
 * @desc module of chartjs
 */

const barChart = require('./charts/bar.chart');
const pieChart = require('./charts/pie.chart');
const lineChart = require('./charts/line.chart');
const scatterChart = require('./charts/scatter.chart');
const doughnutChart = require('./charts/doughnut.chart');
const polarAreaChart = require('./charts/polarArea.chart');
const radarChart = require('./charts/radar.chart');

module.exports = {
    barChart,
    pieChart,
    lineChart,
    scatterChart,
    doughnutChart,
    polarAreaChart,
    radarChart
};
