const {
    reusableChartBuild,
    createDatasetColor,
    reusableOnClickFunction
} = require('../others/chartjs.utils');

/**
 * @memberOf ChartJSModule
 * @function
 * @desc function to build a scatter chart
 * @param {string} title - chart title
 * @param {HTMLBodyElement} htmlElementContainer - container html element, where the chart is inserted
 * @param {string} idElement - chart id
 * @param {array} datasets - array of objects containing the dataset groups taking into account the group of labels,
 * with the structure:
 * <code> [
 *         {
 *           data: array // array of numbers containing the values to be graphed,
 *           label: string // title of the dataset,
 *           backgroundColor: string // rgba string of the background color of the value,
 *           backgroundOpacity: boolean,
 *           width: number // width of bubble
 *         }
 * ]</code>
 * @param {string} positionOfLegend - legend position, which can be (top | bottom | left | right)
 * @param {function} clickEventForEachElement - callback function on event click on chart element
 * @return {*|{}}
 * @example chartJS.scatterChart(
 *      'scatter-chart',
 *      document.getElementById('charts'),
 *      'scatter_chart',
 *      [
 *        {
 *          data: [
 *            { x: 5, y: 10 },
 *            { x: 4, y:  12 }
 *          ],
 *          label: 'test_1',
 *          backgroundColor: 'rgb(63,211,58)',
 *          width: 10
 *        },
 *        {
 *          data: [
 *            { x: 5, y: 20 },
 *            { x: 2, y:  15 }
 *          ],
 *          label: 'test_2'
 *        }
 *      ],
 *      'top',
 *      (value) => alert(`value is ${JSON.stringify(value)}`)
 * );
 */
const scatterChart = (
    title,
    htmlElementContainer,
    idElement,
    datasets,
    positionOfLegend = 'top',
    clickEventForEachElement = () => { }
) => {
    const datasetsArray = [];
    let scatterChart = {};

    scatterChart = reusableChartBuild(
        datasets,
        (
            {
                data,
                label,
                backgroundColor = undefined,
                backgroundOpacity = false,
                width = 8
            }
        ) => {
            const {
                backgroundColorLabelItem,
                borderColorLabelItem
            } = createDatasetColor(backgroundColor, undefined, backgroundOpacity);

            datasetsArray.push({
                label,
                data,
                backgroundColor: backgroundColorLabelItem,
                borderColor: borderColorLabelItem,
                fill: backgroundOpacity,
                pointRadius: width
            })
        },
        htmlElementContainer,
        idElement,
        {
            type: 'scatter',
            data: {
                datasets: datasetsArray
            },
            options: {
                scales: {
                    yAxes: [{
                        stacked: true,
                        type: 'linear',
                        position: 'bottom',
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                title: {
                    display: true,
                    text: title
                },
                responsive: true,
                legend: {
                    position: positionOfLegend
                },
                onClick: ($event) => reusableOnClickFunction($event, scatterChart, clickEventForEachElement)
            }
        }
    );

    return scatterChart;
};

module.exports = scatterChart;
