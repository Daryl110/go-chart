const {
    reusableChartBuild,
    createDatasetColor,
    reusableOnClickFunction
} = require('../others/chartjs.utils');

/**
 * @memberOf ChartJSModule
 * @function
 * @name pieChart
 * @desc function to build a pie chart
 * @param {string} title - chart title
 * @param {HTMLBodyElement} htmlElementContainer - container html element, where the chart is inserted
 * @param {string} idElement - chart id
 * @param {array} labels - array of strings containing the labels of each value within the dataset
 * @param {array} datasets - array of integers with data. structure: <code>
 *     [
 *        [number, number, ...],
 *        [number, number, ...],
 *        ...
 *     ]
 * </code>
 * @param {string} positionOfLegend - legend position, which can be (top | bottom | left | right)
 * @param {array} backgroundColor - array of colors rgba with length equal to data length
 * @param {function} clickEventForEachElement - callback function on event click on chart element
 * @returns {*|{}}
 * @example chartJS.pieChart(
 *      'pie-chart', // title of chart
 *      document.getElementById('charts'), // id of container of the chart
 *      'pie_chart', // id of chart to build
 *      ['test_1', 'test_2', 'test_3'], // labels of data
 *      [[58, 90, 50], [50, 588, 20]], // data
 *      'top', // position of legend
 *      ['rgba(139, 89, 121, 1)','rgba(251, 234, 177, 1)','rgba(34, 244, 142, 1)'], // array of colors rgba equal to data length
 *      (value, label) => alert(`the value ${value} belongs to ${label}`) // basic function in event on click
 * );
 */
module.exports = (
    title,
    htmlElementContainer,
    idElement,
    labels,
    datasets,
    positionOfLegend = 'top',
    backgroundColor = undefined,
    clickEventForEachElement = () => { }
) => {
    const datasetsArray = [];
    let pieChart = {};

    const [{ length }] = datasets;
    let colors = [];

    for (let i = 0; i < length; i++) {
        colors.push(createDatasetColor());
    }

    pieChart = reusableChartBuild(
        datasets,
        (data) => {
            const backgroundColorLabel = [];

            if (!backgroundColor) {
                let count = 0;
                data.forEach(() => {
                    const { backgroundColorLabelItem } = colors[count];
                    backgroundColorLabel.push(backgroundColorLabelItem);
                    count++;
                });
            }

            datasetsArray.push({
                data,
                backgroundColor: !backgroundColor ? backgroundColorLabel : backgroundColor
            });
        },
        htmlElementContainer,
        idElement,
        {
            type: 'pie',
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
                onClick: ($event) => reusableOnClickFunction($event, pieChart, clickEventForEachElement)
            }
        }
    );

    return pieChart;
};
