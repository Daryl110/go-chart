/**
 * @module ChartJSModule
 * @desc module of chartjs
 */

const numUtils = require('../utils/num.utils');
const chartJS = require('chart.js');

/**
 * @function
 * @desc reusable function that allows to use onclick function in different instances
 * @param {Object} $event - description of the event onclick
 * @param {Object} chart - constructed chart
 * @param {function} clickEventForEachElement - callback function that receives the basic values
 * @return {null|*}
 */
const reusableOnClickFunction = ($event, chart, clickEventForEachElement) => {
    const [item] = chart.getElementAtEvent($event);

    if (!item) return null;

    const { _datasetIndex: datasetIndex, _index: index } = item;
    const label = chart.data.labels[index];
    const value = chart.data.datasets[datasetIndex].data[index];

    return clickEventForEachElement(value, label, datasetIndex, index, chart);
};

/**
 * @function
 * @desc function to create rgba colors
 * @param {number} red - number between 0 and 255 that represents the amount of red within the rgba
 * @param {number} green - number between 0 and 255 that represents the amount of green within the rgba
 * @param {number} blue - number between 0 and 255 that represents the amount of blue within the rgba
 * @param {number} opacity - number between 0 and 1 that represents the amount of opacity within the rgba
 * @returns {string} value rgba color
 * @example createColor({
 *     red: 255,
 *     green: 150,
 *     blue: 25,
 *     opacity: 0.2
 * })
 */
const createColor = (
    {
        red,
        green,
        blue,
        opacity = 1
    }
) => `rgba(${red}, ${green}, ${blue}, ${opacity})`;

/**
 * @function
 * @desc function to create colors inside datasets
 * @param {string} backgroundColor - background color for a dataset
 * @param {string} borderColor - border color for a dataset
 * @param {boolean} backgroundOpacity - background color opacity is true or false
 * @returns {{borderColorLabelItem: (string|undefined), backgroundColorLabelItem: string}} colors to dataset
 */
const createDatasetColor = (
    backgroundColor = undefined,
    borderColor = undefined,
    backgroundOpacity = false
) => {
    const [
        red,
        green,
        blue,
        opacity = '1'
    ] = !backgroundColor ? [
        numUtils.getRandomInt(0, 255),
        numUtils.getRandomInt(0, 255),
        numUtils.getRandomInt(0, 255)
    ] : backgroundColor.substring(5, backgroundColor.length - 1).split(',');

    const backgroundColorLabelItem = createColor(
        {
            red,
            green,
            blue,
            opacity: backgroundOpacity ? (opacity !== '1' ? opacity : 0.2) : opacity
        }
    );

    const borderColorLabelItem = !borderColor ? createColor(
        {
            red,
            green,
            blue
        }
    ) : borderColor;

    return {
        borderColorLabelItem,
        backgroundColorLabelItem
    };
};

/**
 * @function
 * @desc function to build a chart reusable
 * @param {array} datasets - array of objects containing the dataset groups, its structure depends of chart
 * @param {function} datasetFunction - function for each dataset in datasets
 * @param {HTMLBodyElement} htmlElementContainer - container html element, where the chart is inserted
 * @param {string} idElement - chart id
 * @param {Object} options - object of preferences in chartjs
 * @return {Object} chart
 */
const reusableChartBuild = (
    datasets,
    datasetFunction,
    htmlElementContainer,
    idElement,
    options
) => {
    const canvas = document.createElement('canvas');

    canvas.id = idElement;
    htmlElementContainer.append(canvas);

    datasets.forEach(datasetFunction);

    return new chartJS(idElement, options)
}

/**
 * @function
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
 * @param {boolean} horizontal - Boolean that demarcates whether the chart is horizontal or not
 * @param {string} positionOfLegend - legend position, which can be (top | bottom | left | right)
 * @param {function} clickEventForEachElement - callback function on event click on chart element
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
const barChart = (
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

/**
 * @function
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
const pieChart = (
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
}

/**
 * @function
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
 * @param {string} positionOfLegend - legend position, which can be (top | bottom | left | right)
 * @param {function} clickEventForEachElement - callback function on event click on chart element
 * @return {*|{}}
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
const lineChart = (
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

/**
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

/**
 * @function
 * @desc function to build a doughnut chart
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
 * @example chartJS.doughnutChart(
 *    'doughnut-chart', // title of chart
 *    document.getElementById('charts'), // id of container of the chart
 *    'doughnut_chart', // id of chart to build
 *    ['test_1', 'test_2', 'test_3'], // labels of data
 *    [[58, 90, 50], [50, 20, 20]], // data
 * );
 */
const doughnutChart = (
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
    let doughnutChart = {};

    const [{ length }] = datasets;
    let colors = [];

    for (let i = 0; i < length; i++) {
        colors.push(createDatasetColor());
    }

    doughnutChart = reusableChartBuild(
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
            type: 'doughnut',
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
                animation: {
                    animateRotate: true,
                    animateScale: true
                },
                onClick: ($event) => reusableOnClickFunction($event, doughnutChart, clickEventForEachElement)
            }
        }
    );

    return doughnutChart;
}

/**
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
        colors.push(createDatasetColor(undefined, undefined, true));
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

            datasetsArray.push({
                data,
                backgroundColor: !backgroundColor ? backgroundColorLabel : backgroundColor,
                borderColor: !backgroundColor ? borderColorLabel : undefined
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

/**
 * @function
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
const radarChart = (
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

module.exports = {
    barChart,
    pieChart,
    doughnutChart,
    lineChart,
    scatterChart,
    polarAreaChart,
    radarChart
};
