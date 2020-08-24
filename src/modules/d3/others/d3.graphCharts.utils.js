/**
 * @module D3Module.d3GraphChartsUtils
 * @namespace
 */

const {
    d3,
    appendChart
} = require('./d3.utils');

/**
 * @name D3Module.d3GraphChartsUtils.drag
 * @function
 * @desc function to perform drag action on chart
 * @param {Object} simulation - simulation object where the drag will be performed
 * @return {*} drag function started
 */
const drag = (simulation) => {
    const dragstart = (d) => {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    };
    const dragged = (d) => {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    };
    const dragend = (d) => {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    };

    return d3.drag().on('start', dragstart)
        .on('drag', dragged)
        .on('end', dragend);
};

/**
 * @name D3Module.d3GraphChartsUtils.color
 * @function
 * @desc function to create colors using schemeCategory10 colors
 * @return {function(*): *} function to create color according to group
 */
const color = () => {
    const scale = d3.scaleOrdinal(d3.schemeCategory10);
    return d => scale(d.group);
};

/**
 * @name D3Module.d3GraphChartsUtils.addTitleNode
 * @function
 * @desc function to add title tooltip on node
 * @param {HTMLElement} node - element html node
 * @return {Selection<BaseType, any, BaseType, any> | void} element html title tooltip
 */
const addTitleNode = (node) => node.append('title')
    .text(d => d.title ? d.title : d.id);

/**
 * @name D3Module.d3GraphChartsUtils.addTitleArch
 * @function
 * @desc function to add title tooltip on arch
 * @param {HTMLElement} link - element html arch
 * @param {Object} data - data contains of nodes and arches
 * @return {Selection<BaseType, any, BaseType, any> | void} element html title tooltip
 */
const addTitleArch = (link, data) => link.append('title')
    .text(
        ({
             source: {
                 index: sourceIndex
             },
             target: {
                 index: targetIndex
             },
             ...d
         }) => {
            const arch = data.arches[d.index];

            arch.source = data.nodes[sourceIndex];
            arch.target = data.nodes[targetIndex];

            return JSON.stringify(arch);
        }
    );

/**
 * @name D3Module.d3GraphChartsUtils.addNodeFunctions
 * @function
 * @desc function to add actions on nodes
 * @param {Array<Object>} nodeFunctions - actions to add
 * @param {HTMLElement} node - container of actions
 * @param {Object} data - data contains of nodes and arches
 */
const addNodeFunctions = (nodeFunctions, node, data) => {
    nodeFunctions.forEach(({ event, handler }) => node.on(event, ({ index }) => handler(data.nodes[index])));
};

/**
 * @name D3Module.d3GraphChartsUtils.addArchFunctions
 * @function
 * @desc function to add actions on arches
 * @param {Array<Object>} archesFunctions - actions to add
 * @param {HTMLElement} link - container of actions
 * @param {Object} data - data contains of nodes and arches
 */
const addArchFunctions = (archesFunctions, link, data) => {
    archesFunctions.forEach(({ event, handler }) =>
        link.on(event, (
            {
                index,
                source: { index: sourceIndex },
                target: { index: targetIndex }
            }
        ) => {
            const arch = data.arches[index];

            arch.source = data.nodes[sourceIndex];
            arch.target = data.nodes[targetIndex];

            return handler(arch);
        })
    );
};

module.exports = {
    drag,
    color,
    addTitleNode,
    addTitleArch,
    addArchFunctions,
    addNodeFunctions,
    appendChart,
    d3
}