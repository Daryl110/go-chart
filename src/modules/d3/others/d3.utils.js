/**
 * @module D3Module.d3Utils
 * @namespace
 */

const d3 = require('d3/index');

/**
 * @name D3Module.d3Utils.appendChart
 * @function
 * @desc it add chart in htmlContainer with name idElement
 * @param {SVGElement} svg - element chart
 * @param {string} idElement - name of chart
 * @param {HTMLElement} htmlElementContainer - container element of chart
 */
const appendChart = (svg, idElement, htmlElementContainer) => {
    const chart = svg.node();
    chart.id = idElement;

    htmlElementContainer.append(chart);
}

module.exports = {
    appendChart,
    d3
};
