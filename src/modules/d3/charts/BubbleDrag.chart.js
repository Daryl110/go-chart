const {
    appendChart,
    d3
} = require('../others/d3.graphCharts.utils');

/**
 * @memberOf D3Module
 * @function
 * @name bubbleDragChart
 * @desc function for create a bubble drag chart
 * @param {HTMLBodyElement} htmlElementContainer - container html element, where the chart is inserted
 * @param {string} idElement - chart id
 * @param {object} data - data to be plotted within the chart, with the structure:
 * <code>[
 *       {
 *          id: <String> "A",
 *           value: <number> 150,
 *           group: <number> 1,
 *           properties?: <object> {
 *               opacity?: <number> 0.23,
 *               border_width?: <number> 5,
 *               background_color?: <String> '#000',
 *               border_color?: <String> '#523'
 *           },
 *           icon?: <String> '.../.../.../.png',
 *           description?: <String> 'Text'
 *       }, ...
 * ]</code>
 * @param {number=} [width=500] - chart width inside the container
 * @param {number=} [height=500] - chart height inside the container
 * @param {number=} [relativeRadius=null] - relative size radius to the circles length
 * @param {string=} [backgroundColor='white'] - background color for the chart
 * @param {function=} [onClickFunctionCallback=() => {}] - function callback to onClick event,
 * with parameter d = node of data or node selected, this node contains attributes of data[index] +
 * attributes of html element
 * @see <img src="https://i.imgur.com/BMPwD9E.png"></img>
 * @example D3.bubbleDragChart(
 *     document.getElementById('charts_container'),
 *     'bubble_drag_chart',
 *     [
 *       {
 *         id: "A",
 *         value: 150,
 *         group: 1,
 *         properties: {
 *             opacity: 0.23,
 *             border_width: 5,
 *             background_color: '#000',
 *             border_color: '#523'
 *         },
 *         icon: 'assets/img/exito.png',
 *         description: "Exito movil"
 *       },
 *       {
 *         id: "B",
 *         value: 20,
 *         group: 2,
 *         icon: 'assets/img/claro.png'
 *       },
 *       {
 *         id: "C",
 *         value: 20,
 *         group: 3
 *       },
 *       {
 *         id: "D",
 *         value: 20,
 *         group: 1
 *       },
 *       {
 *         id: "E",
 *         value: 20,
 *         group: 1
 *       },
 *               {
 *         id: "F",
 *         value: 20,
 *         group: 3
 *       },
 *       {
 *         id: "G",
 *         value: 20,
 *         group: 1
 *       },
 *       {
 *         id: "H",
 *         value: 20,
 *         group: 4
 *       }
 *    ]
 * );
 */
module.exports = (
    htmlElementContainer,
    idElement,
    data,
    width = 500,
    height = 500,
    relativeRadius = undefined,
    backgroundColor = 'white',
    onClickFunctionCallback = () => {}
) => {

    const svg = d3.create('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background-color', backgroundColor);

    const centerX = width / 50;
    const centerY = height / 50;
    const strength = 0.05;
    const scale = d3.scaleOrdinal(d3.schemeCategory10);

    const dragStart = (d) => {
        if (!d3.event.active) {
            simulation.alphaTarget(.5).restart();
        }
        d.fx = d.x;
        d.fy = d.y;
    };

    const drag = (d) => {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    };

    const dragEnd = (d) => {
        if (!d3.event.active) {
            simulation.alphaTarget(.003);
        }
        d.fx = null;
        d.fy = null;
    };

    const validateProperties = (d, property, result) => {
        if (d.properties && d.properties[property]) return d.properties[property]
        return result
    }

    const ticked = () => {
        node
            .attr('transform', d => `translate(${d.x},${d.y})`)
            .select('.node')
            .attr('r', d => d.r);
    };

    const node = svg.selectAll('.node')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'node')
        .call(d3.drag()
            .on('start', dragStart)
            .on('drag', drag)
            .on('end', dragEnd))
        .on('click', d => onClickFunctionCallback(d));

    node.append('circle')
        .attr('r', d => {
            d.r = relativeRadius !== undefined ? (d.value / relativeRadius) : d.value;
            return d.r;
        })
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .style('fill', d => validateProperties(d, 'background_color', scale(d.group)))
        .style('fill-opacity', d => validateProperties(d, 'opacity', 1))
        .attr('stroke', d => validateProperties(d, 'border_color', scale(d.group)))
        .style('stroke-width', d => validateProperties(d, 'border_width', 1));

    node.append('title')
        .text(d => d.description ? `id: ${d.id}\ndescription: ${d.description}` : `id: ${d.id}`);

    node.filter(d => String(d.icon).includes('img/'))
        .append('image')
        .classed('node-icon', true)
        .attr('clip-path', d => `url(#clip-${d.id})`)
        .attr('xlink:href', d => d.icon)
        .attr('x', d => (width / 2) - d.r * 0.7)
        .attr('y', d => ((height / 2) - d.r * 0.7))
        .attr('height', d => d.r * 2 * 0.7)
        .attr('width', d => d.r * 2 * 0.7);

    const simulation = d3.forceSimulation()
        .force('charge', d3.forceManyBody())
        .force('collide', d3.forceCollide(d => d.r + 1))
        .force('x', d3.forceX(centerX).strength(strength))
        .force('y', d3.forceY(centerY).strength(strength));

    simulation.nodes(data).on('tick', ticked);

    appendChart(svg, idElement, htmlElementContainer)
};
