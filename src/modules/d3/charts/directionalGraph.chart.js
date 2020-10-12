const {
    d3,
    drag,
    color,
    addTitleNode,
    addTitleArch,
    addNodeFunctions,
    addArchFunctions,
    appendChart
} = require('../others/d3.graphCharts.utils');

/**
 * @memberOf D3Module
 * @function
 * @name directionalGraphChart
 * @desc function for create a graph chart
 * @param {HTMLBodyElement} htmlElementContainer - container html element, where the chart is inserted
 * @param {string} idElement - chart id
 * @param {object} data - data to be plotted within the chart, with the structure:
 * <code>{
 *     nodes: [{ id: string, group: number }],
 *     arches: [{ source: string, target: string, type: string, ... }]
 * }</code>
 * @param {boolean=} [showIds=false] - it'll show id for each node
 * @param {number=} [spaceOfLegend=[]] - space between legends
 * @param {array=} [nodeFunctions=[]] - functions of each node within the chart, with the structure:
 * <code>nodeFunctions: [{ event: string // event type, handler: function(node?) // action to take }]</code>
 * @param {array=} [archesFunctions=null] - functions of each arch within the chart, with the structure:
 * <code>archesFunctions: [{ event: string // event type, handler: function(arch?) // action to take }]</code>
 * @param {number=} [width=500] - chart width inside the container
 * @param {number=} [height=500] - chart height inside the container
 * @param {string=} [backgroundColor='white'] - background color for the chart
 * @see <img src="https://i.imgur.com/hZxqGSc.jpg"></img>
 * @example
 * D3.directionalGraphChart(
 *   document.getElementById('charts'),
 *   'chart',
 *   {
 *     nodes: [
 *       { id: "Microsoft", group: 1 },
 *       { id: "Amazon", group: 2 },
 *       { id: "HTC", group: 1 },
 *       { id: "Samsung", group: 2 },
 *       { id: "Apple", group: 1 },
 *       { id: "Motorola", group: 1 },
 *       { id: "Nokia", group: 2 },
 *       { id: "Kodak", group: 2 },
 *       { id: "Barnes & Noble", group: 4 },
 *       { id: "Foxconn", group: 1 },
 *       { id: "Oracle", group: 2 },
 *       { id: "Google", group: 1 },
 *       { id: "Inventec", group: 5 },
 *       { id: "LG", group: 1 },
 *       { id: "RIM", group: 1 },
 *       { id: "Sony", group: 3 },
 *       { id: "Qualcomm", group: 3 },
 *       { id: "Huawei", group: 3 },
 *       { id: "ZTE", group: 1 },
 *       { id: "Ericsson", group: 1 }
 *     ],
 *     arches: [
 *       {
 *         source: "Microsoft",
 *         target: "Amazon",
 *         type: "licensing"
 *       }, {
 *         source: "Microsoft",
 *         target: "HTC",
 *         type: "licensing"
 *       }, {
 *         source: "Samsung",
 *         target: "Apple",
 *         type: "suit"
 *       }, {
 *         source: "Motorola",
 *         target: "Apple",
 *         type: "suit"
 *       }, {
 *         source: "Nokia",
 *         target: "Apple",
 *         type: "resolved"
 *       }, {
 *         source: "HTC",
 *         target: "Apple",
 *         type: "suit"
 *       }, {
 *         source: "Kodak",
 *         target: "Apple",
 *         type: "suit"
 *       }, {
 *         source: "Microsoft",
 *         target: "Barnes & Noble",
 *         type: "suit"
 *       }, {
 *         source: "Microsoft",
 *         target: "Foxconn",
 *         type: "suit"
 *       }, {
 *         source: "Oracle",
 *         target: "Google",
 *         type: "suit"
 *       }, {
 *         source: "Apple",
 *         target: "HTC",
 *         type: "suit"
 *       }, {
 *         source: "Microsoft",
 *         target: "Inventec",
 *         type: "suit"
 *       }, {
 *         source: "Samsung",
 *         target: "Kodak",
 *         type: "resolved"
 *       }, {
 *         source: "LG",
 *         target: "Kodak",
 *         type: "resolved"
 *       }, {
 *         source: "RIM",
 *         target: "Kodak",
 *         type: "suit"
 *       }, {
 *         source: "Sony",
 *         target: "LG",
 *         type: "suit"
 *       }, {
 *         source: "Kodak",
 *         target: "LG",
 *         type: "resolved"
 *       }, {
 *         source: "Apple",
 *         target: "Nokia",
 *         type: "resolved"
 *       }, {
 *         source: "Qualcomm",
 *         target: "Nokia",
 *         type: "resolved"
 *       }, {
 *         source: "Apple",
 *         target: "Motorola",
 *         type: "suit"
 *       }, {
 *         source: "Microsoft",
 *         target: "Motorola",
 *         type: "suit"
 *       }, {
 *         source: "Motorola",
 *         target: "Microsoft",
 *         type: "suit"
 *       }, {
 *         source: "Huawei",
 *         target: "ZTE",
 *         type: "suit"
 *       }, {
 *         source: "Ericsson",
 *         target: "ZTE",
 *         type: "suit"
 *       }, {
 *         source: "Kodak",
 *         target: "Samsung",
 *         type: "resolved"
 *       }, {
 *         source: "Apple",
 *         target: "Samsung",
 *         type: "suit"
 *       }, {
 *         source: "Kodak",
 *         target: "RIM",
 *         type: "suit"
 *       }, {
 *         source: "Nokia",
 *         target: "Qualcomm",
 *         type: "suit"
 *       }
 *     ]
 *   },
 *   false,
 *   [
 *     {
 *       event: 'click',
 *       handler: console.log
 *     }
 *   ],
 *   [
 *     {
 *       event: 'click',
 *       handler: console.log
 *     }
 *   ]
 *   );
 */
module.exports = (
    htmlElementContainer,
    idElement,
    data,
    showIds = false,
    nodeFunctions = [],
    archesFunctions = [],
    spaceOfLegend = undefined,
    width = 500,
    height = 500,
    backgroundColor = 'white'
) => {
    const links = data.arches.map(d => Object.create(d));
    const nodes = data.nodes.map(d => Object.create(d));
    const types = Array.from(new Set(links.map(d => d.type)));
    const scale = d3.scaleOrdinal(types, [
        '#7fc97f',
        '#beaed4',
        '#86cdfd',
        '#ffff99',
        '#386cb0',
        '#f0027f',
        '#bf5b17',
        '#666666'
    ]);

    const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id))
        .force('charge', d3.forceManyBody().strength(-400))
        .force('x', d3.forceX())
        .force('y', d3.forceY());

    const svg = d3.create('svg')
        .attr('height', height)
        .attr('width', width)
        .style('background-color', backgroundColor)
        .attr('viewBox', [-width / 2, -height / 2, width, height]);

    const linkArc = (d) => {
        const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);

        return `
            M${d.source.x},${d.source.y}
            A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
            `;
    }

    svg.append('defs').selectAll('marker')
        .data(types)
        .join('marker')
        .attr('id', d => `arrow-${d}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 15)
        .attr('refY', -0.5)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('fill', scale)
        .attr('d', 'M0,-5L10,0L0,5');

    let auxPositionLegend = 0;
    const typeSetSVG = [];

    const link = svg.append('g')
        .attr('fill', 'none')
        .attr('stroke-width', 1.3)
        .selectAll('path')
        .data(links)
        .join('path')
        .attr('stroke', d => {
            const colorScale = scale(d.type);
            const posX = -((width / 2) - 50);
            const posY = -((height / 2) - 50);
            const validateFindType = typeSetSVG.includes(d.type);

            if(!validateFindType) {
                svg.append('rect')
                    .attr('x', posX)
                    .attr('y', posY + auxPositionLegend)
                    .attr("width", 12)
                    .attr("height", 12)
                    .style('fill', colorScale);

                svg.append('text')
                    .attr('x', posX + 20)
                    .attr('y', posY + auxPositionLegend + 7)
                    .text(d.type)
                    .style('font-size', '15px')
                    .attr('alignment-baseline','middle');

                typeSetSVG.push(d.type);
            }

            auxPositionLegend += spaceOfLegend ? spaceOfLegend : ( ( - ( posX + posY ) / 10 ) / 5 );

            return colorScale;
        })
        .attr('marker-end', d => `url(${new URL(`#arrow-${d.type}`, location)})`);

    const node = svg.append("g")
        .attr("fill", "currentColor")
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .selectAll("g")
        .data(nodes)
        .join("g")
        .attr('fill', color(nodes))
        .call(drag(simulation));

    if (showIds) {
        node.append("text")
            .attr("x", 8)
            .attr("y", "0.31em")
            .text(d => d.id)
            .clone(true).lower()
            .attr("stroke", "white")
            .attr("stroke-width", 3);
    }

    addTitleArch(link, data);
    addTitleNode(node);

    node.append('circle')
        .attr('stroke', 'white')
        .attr('stroke-width', 1.5)
        .attr('r', 5);

    addNodeFunctions(nodeFunctions, node, data);
    addArchFunctions(archesFunctions, link, data);

    simulation.on('tick', () => {
        link.attr('d', linkArc);
        node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    appendChart(svg, idElement, htmlElementContainer);
}
