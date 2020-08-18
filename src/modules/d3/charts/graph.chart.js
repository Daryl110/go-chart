const d3 = require('d3/index');

/**
 * @memberOf D3Module
 * @function
 * @desc function for create a graph chart
 * @param {HTMLBodyElement} htmlElementContainer - container html element, where the chart is inserted
 * @param {string} idElement - chart id
 * @param {object} data - data to be plotted within the chart, with the structure:
 * <code>{
 *     nodes: [{ id: string, group: number }],
 *     arches: [{ source: string, target: string, value: object }]
 * }</code>
 * @param {array} nodeFunctions - functions of each node within the chart, with the structure:
 * <code>nodeFunctions: [{ event: string // event type, handler: function // action to take }]</code>
 * @param {array} archesFunctions - functions of each arch within the chart, with the structure:
 * <code>archesFunctions: [{ event: string // event type, handler: function // action to take }]</code>
 * @param {number} width - chart width inside the container
 * @param {number} height - chart height inside the container
 * @param {string} backgroundColor - background color for the chart
 * @example D3.graphChart(
 *   document.getElementById('charts'),
 *   'graph_chart',
 *   {
 *      nodes: [
 *        { id: 'Armenia', group: 1 },
 *        { id: 'Calarca', group: 1 },
 *        { id: 'Circasia', group: 1 },
 *        { id: 'Pereira', group: 2 },
 *        { id: 'Cali', group: 3 },
 *        { id: 'Bogota', group: 4 },
 *        { id: 'Soacha', group: 4 },
 *        { id: 'Medellin', group: 5 },
 *        { id: 'Itagui', group: 5 },
 *        { id: 'Envigado', group: 5 }
 *      ],
 *      arches: [
 *        { source: 'Armenia', target: 'Calarca', value: 5 },
 *        { source: 'Armenia', target: 'Circasia', value: 5 },
 *        { source: 'Cali', target: 'Medellin', value: 5 },
 *        { source: 'Medellin', target: 'Itagui', value: 5 },
 *        { source: 'Armenia', target: 'Medellin', value: 5 },
 *        { source: 'Cali', target: 'Bogota', value: 5 },
 *        { source: 'Bogota', target: 'Soacha', value: 5 },
 *        { source: 'Armenia', target: 'Bogota', value: 5 },
 *        { source: 'Medellin', target: 'Envigado', value: 5 },
 *        { source: 'Armenia', target: 'Pereira', value: 5 }
 *      ]
 *    }
 * );
 */
const graphChart = (
    htmlElementContainer,
    idElement,
    data,
    nodeFunctions = [],
    archesFunctions = [],
    width = 500,
    height = 500,
    backgroundColor = 'white'
) => {
    const svg = d3.create('svg');

    svg.attr('height', height);
    svg.attr('width', width);
    svg.style('background-color', backgroundColor);

    const links = data.arches.map(d => Object.create(d));
    const nodes = data.nodes.map(d => Object.create(d));

    const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id))
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(width / 2, height / 2));

    const color = () => {
        const scale = d3.scaleOrdinal(d3.schemeCategory10);
        return d => scale(d.group);
    };

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

    const link = svg.append('g')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke-width', d => Math.sqrt(d.value));

    const node = svg.append('g')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('r', 5)
        .attr('fill', color(nodes))
        .call(drag(simulation));

    link.append('title')
        .text(d => `Source: ${d.source}\nTarget: ${d.target}\nValue: ${d.value}`);

    node.append('title')
        .text(d => d.title ? d.title : d.id);

    nodeFunctions.forEach(({ event, handler }) => node.on(event, handler));
    archesFunctions.forEach(({ event, handler }) => link.on(event, handler));

    simulation.on('tick', () => {
        link.attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        node.attr('cx', d => d.x)
            .attr('cy', d => d.y);
    });

    const chart = svg.node();
    chart.id = idElement;

    htmlElementContainer.append(chart);
}

module.exports = graphChart;
