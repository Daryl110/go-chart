const {
    reusableChartBuild,
    createDatasetColor,
    reusableOnClickFunction
} = require('../others/chartjs.utils');

/**
 * @memberOf ChartJSModule
 * @function
 * @name lineChart
 * @desc function to build a line chart
 * @param {string} title - chart title
 * @param {HTMLBodyElement} htmlElementContainer - container html element, where the chart is inserted
 * @param {string} idElement - chart id
 * @param {array} labels - array of strings containing the labels of each value within the dataset
 * @param {array} datasets - array of objects containing the dataset groups taking into account the group of labels,
 * with the structure:
 * <code> [
 *         {
 *           data: array, // array of numbers containing the values to be graphed,
 *           label: string, // title of the dataset,
 *           backgroundColor: string, // rgba string of the background color of the value,
 *           borderColor: string, // rgba string the border color of the value,
 *           backgroundOpacity: boolean,
 *           withFilling: boolean // extend color between origin to data on chart
 *         }
 * ]</code>
 * @param {string=} [positionOfLegend='top'] - legend position, which can be (top | bottom | left | right)
 * @param {ChartJSModule.chartJSUtils.reusableOnClickFunction=} [clickEventForEachElement=() => {}] - callback function on event click on chart element
 * @return {*|{}}
 * @see <img src="https://i.imgur.com/UzAlHwi.jpg"></img>
 * @example chartJS.lineChart(
 *   'line-chart', // title of chart
 *   document.getElementById('charts'), // id of container of the chart
 *   'line_chart', // id of chart to build
 *   [
 *      'January',
 *      'February',
 *      'March',
 *      'April',
 *      'May',
 *      'June',
 *      'July',
 *      'August',
 *      'September',
 *      'October',
 *      'November',
 *      'December'
 *   ], // labels of data
 *   [
 *     {
 *       data: [58, 90, 50, 25, 80, 96, 100, 53, 26, 10, 52, 0],
 *       label: 'a',
 *       backgroundColor: 'rgba(255,213,0,0.33)',
 *     },
 *     {
 *       data: [50, 20, 20, 29, 40, 45, 21, 5, 56, 98, 100, 90],
 *       label: 'b',
 *       withFilling: true,
 *       backgroundOpacity: true
 *     }
 *   ], // data
 * );
 */
module.exports = (
    title,
    htmlElementContainer,
    idElement,
    labels,
    datasets,
    positionOfLegend = 'top',
    clickEventForEachElement = () => { }
) => {
    const datasetsArray = [];
    let lineChart = {};

    lineChart = reusableChartBuild(
        datasets,
        (
            {
                data,
                label,
                backgroundColor = undefined,
                borderColor = undefined,
                backgroundOpacity = false,
                withFilling = false
            }
        ) => {
            const {
                backgroundColorLabelItem,
                borderColorLabelItem
            } = createDatasetColor(backgroundColor, borderColor, backgroundOpacity);

            datasetsArray.push({
                label,
                data,
                backgroundColor: backgroundColorLabelItem,
                borderColor: borderColorLabelItem,
                pointRadius: 6,
                fill: withFilling
            });
        },
        htmlElementContainer,
        idElement,
        {
            type: 'line',
            data: {
                labels,
                datasets: datasetsArray
            },
            options: {
                title: {
                    display: true,
                    text: title
                },
                responsive: true,
                legend: {
                    position: positionOfLegend
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                onClick: ($event) => reusableOnClickFunction($event, lineChart, clickEventForEachElement)
            }
        }
    );

    return lineChart;
};
