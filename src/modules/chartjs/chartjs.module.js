/**
 * @module ChartJSModule
 * @namespace
 * @desc module of chartjs
 */

module.exports = {
    barChart: require('./charts/bar.chart'),
    pieChart: require('./charts/pie.chart'),
    lineChart: require('./charts/line.chart'),
    scatterChart: require('./charts/scatter.chart'),
    doughnutChart: require('./charts/doughnut.chart'),
    polarAreaChart: require('./charts/polarArea.chart'),
    radarChart: require('./charts/radar.chart')
};
