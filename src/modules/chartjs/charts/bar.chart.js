const {
    reusableChartBuild,
    createDatasetColor,
    reusableOnClickFunction
} = require('../others/chartjs.utils');

/**
 * @memberOf ChartJSModule
 * @function
 * @name barChart
 * @desc function to build a bar chart
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
 *           ?backgroundColor: string, // rgba string of the background color of the value,
 *           ?borderColor: string, // rgba string the border color of the value,
 *           ?backgroundOpacity: boolean
 *         }
 * ]</code>
 * @param {boolean=} [horizontal=false] - Boolean that demarcates whether the chart is horizontal or not
 * @param {string=} [positionOfLegend='top'] - legend position, which can be (top | bottom | left | right)
 * @param {ChartJSModule.chartJSUtils.reusableOnClickFunction=} [clickEventForEachElement=null] - callback function on event click on chart element
 * @return {*|{}}
 * @example chartJS.barChart(
 *      'bar-chart', // title of chart
 *      document.getElementById('charts'), // id of container of the chart
 *      'bar_chart', // id of chart to build
 *      ['test_1', 'test_2', 'test_3'], // labels of data
 *      [
 *        {
 *          data: [58, 90, 50],
 *          label: 'a',
 *          backgroundColor: 'rgba(255,9,0,1)',
 *          backgroundOpacity: true,
 *          borderColor: 'rgba(255, 200, 150)'
 *        },
 *        {
 *          data: [50, 588, 20],
 *          label: 'b'
 *        }
 *      ], // data
 * );
 */
module.exports = (
    title,
    htmlElementContainer,
    idElement,
    labels,
    datasets,
    horizontal = false,
    positionOfLegend = 'top',
    clickEventForEachElement = () => { }
) => {
    const datasetsArray = [];
    let barChart = {};

    barChart = reusableChartBuild(
        datasets,
        (
            {
                data,
                label,
                backgroundColor = undefined,
                borderColor = undefined,
                backgroundOpacity = false
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
                borderWidth: 0.5
            })
        },
        htmlElementContainer,
        idElement, {
            type: horizontal ? 'horizontalBar' : 'bar',
            data: {
                labels,
                datasets: datasetsArray
            },
            options: {
                scales: {
                    yAxes: [{
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
                onClick: ($event) => reusableOnClickFunction($event, barChart, clickEventForEachElement)
            }
        }
    );

    return barChart;
};
