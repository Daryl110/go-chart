/**
 * @module ChartJSModule.chartJSUtils
 * @namespace
 */

const numUtils = require('../../../utils/num.utils');
const chartJS = require('chart.js');

/**
 * @name ChartJSModule.chartJSUtils.reusableOnClickFunction
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
 * @name ChartJSModule.chartJSUtils.createColor
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
 * @name ChartJSModule.chartJSUtils.createDatasetColor
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
        opacity = 1
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
            opacity: backgroundOpacity ? (parseInt(opacity) !== 1 ? opacity : 0.2) : opacity
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
 * @name ChartJSModule.chartJSUtils.reusableChartBuild
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

module.exports = {
    reusableOnClickFunction,
    createColor,
    createDatasetColor,
    reusableChartBuild
};
