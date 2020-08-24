const {
    reusableChartBuild,
    createDatasetColor,
    reusableOnClickFunction
} = require('../others/chartjs.utils');

/**
 * @memberOf ChartJSModule
 * @function
 * @name radarChart
 * @desc function to build a radar chart
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
 *           borderColor: string, // rgba string border color
 *           backgroundOpacity: boolean
 *         }
 * ]</code>
 * @param {string} positionOfLegend - legend position, which can be (top | bottom | left | right)
 * @param {function} clickEventForEachElement - callback function on event click on chart element
 * @returns {*|{}}
 * @example chartJS.radarChart(
 *      'radar-chart', // title of chart
 *      document.getElementById('charts'), // id of container of the chart
 *      'radar_chart', // id of chart to build
 *      ['test_1', 'test_2', 'test_3'], // labels of data
 *      [
 *        {
 *          label: 'a',
 *          data: [52, 56, 95],
 *          backgroundColor: 'rgba(255, 89, 52)',
 *          borderColor: 'rgb(12,238,148)',
 *          backgroundOpacity: true
 *        },
 *        {
 *          label: 'b',
 *          data: [86, 20, 59]
 *        }
 *      ], // data
 *      'top', // legend position
 *      (value, label) => alert(`value: ${value} - label: ${label}`) // onclick basic function
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
    let radarChart = {};

    radarChart = reusableChartBuild(
        datasets,
        (
            {
                data,
                label,
                backgroundColor = undefined,
                borderColor = undefined,
                backgroundOpacity = true,
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
                borderWidth: 1,
            })
        },
        htmlElementContainer,
        idElement,
        {
            type: 'radar',
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
                scale: {
                    angleLines: {
                        display: false
                    }
                },
                onClick: ($event) => reusableOnClickFunction($event, radarChart, clickEventForEachElement)
            }
        }
    );

    return radarChart;
};
