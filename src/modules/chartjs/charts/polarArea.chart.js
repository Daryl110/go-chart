const {
    reusableChartBuild,
    createDatasetColor,
    reusableOnClickFunction
} = require('../others/chartjs.utils');

/**
 * @memberOf ChartJSModule
 * @function
 * @desc function to build a polar area chart, it should be noted that although more than 1 dataset can be handled,
 * it is not recommended to do so, since the data could be visual obfuscated
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
 * @param {boolean} backgroundOpacity - boolean that marks if the background color is opaque
 * @param {function} clickEventForEachElement - callback function on event click on chart element
 * @returns {*|{}}
 * @example chartJS.polarAreaChart(
 *    'polar-area-chart', // title of chart
 *    document.getElementById('charts'), // id of container of the chart
 *    'polar_area_chart', // id of chart to build
 *    ['test_1', 'test_2', 'test_3'], // labels of data
 *    [[58, 90, 50], [50, 20, 20]], // data
 *    'top', // legend position
 *    ['rgba(139, 89, 121, 1)','rgba(251, 234, 177, 1)','rgba(34, 244, 142, 1)'], // array of colors rgba equal to data length
 *    true, // background opacity
 *    (value, label) => alert(`value: ${value} - label: ${label}`) // basic function in event on click
 * );
 */
const polarAreaChart = (
    title,
    htmlElementContainer,
    idElement,
    labels,
    datasets,
    positionOfLegend = 'top',
    backgroundColor = undefined,
    backgroundOpacity = false,
    clickEventForEachElement = () => { }
) => {
    const datasetsArray = [];
    let polarAreaChart = {};

    const [{ length }] = datasets;
    let colors = [];

    for (let i = 0; i < length; i++) {
        colors.push(createDatasetColor(undefined, undefined, backgroundOpacity));
    }

    polarAreaChart = reusableChartBuild(
        datasets,
        (data) => {
            const backgroundColorLabel = [], borderColorLabel = [];

            if (!backgroundColor) {
                let count = 0;
                data.forEach(() => {
                    const {
                        backgroundColorLabelItem,
                        borderColorLabelItem
                    } = colors[count];
                    backgroundColorLabel.push(backgroundColorLabelItem);
                    borderColorLabel.push(borderColorLabelItem);
                    count++;
                });
            }

            if (backgroundOpacity && backgroundColor) {
                backgroundColor.forEach((color) => {
                    const {
                        backgroundColorLabelItem,
                        borderColorLabelItem
                    } = createDatasetColor(color, undefined, true);

                    backgroundColorLabel.push(backgroundColorLabelItem);
                    borderColorLabel.push(borderColorLabelItem);
                });

                backgroundColor = undefined;
            }

            datasetsArray.push({
                data,
                backgroundColor: !backgroundColor ? backgroundColorLabel : backgroundColor,
                borderColor: !backgroundColor ? borderColorLabel : undefined,
                borderWidth: 3
            });
        },
        htmlElementContainer,
        idElement,
        {
            type: 'polarArea',
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
                    ticks: {
                        beginAtZero: true
                    },
                    reverse: false
                },
                animation: {
                    animateRotate: true,
                    animateScale: true
                },
                onClick: ($event) => reusableOnClickFunction($event, polarAreaChart, clickEventForEachElement)
            }
        }
    );

    return polarAreaChart;
};

module.exports = polarAreaChart;
