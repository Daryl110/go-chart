const d3 = require('d3/index');

/**
 * @module D3Module
 * @desc module of d3
 */
const D3Module = {
  collapsableTreeChart,
  graphChart
};

/**
 * @function
 * @desc function for create a collapsable tree chart
 * @param {HTMLBodyElement} htmlElementContainer - container html element, where the chart is inserted
 * @param {string} idElement - chart id
 * @param {object} data - data to be plotted within the chart, with the structure:
 * <code>data: { name: string, children: array[data] }</code>
 * @param {number} width - chart width inside the container
 * @param {number} height - chart height inside the container
 * @param {string} backgroundColor - background color for the chart
 */
const collapsableTreeChart = (
    htmlElementContainer,
    idElement,
    data,
    width = 1050,
    height = 300,
    backgroundColor = 'white'
) => {
  const root = d3.hierarchy(data);
  const dx = 10, dy = 159;
  const margin = ({top: 10, right: 120, bottom: 10, left: 40});
  const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);
  const tree = d3.tree().nodeSize([dx, dy]);

  root.x0 = dy / 2;
  root.y0 = 0;
  root.descendants().forEach((d, i) => {
    d.id = i;
    d._children = d.children;
    if (d.depth && d.data.name.length !== 7) d.children = null;
  });

  const svg = d3.create('svg');

  svg.attr('height', height);
  svg.attr('width', width);
  svg.style('background-color', backgroundColor);

  const gLink = svg.append('g')
      .attr('fill', 'none')
      .attr('stroke', '#555')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 1.5);

  const gNode = svg.append('g')
      .attr('cursor', 'pointer')
      .attr('pointer-events', 'all');

  const update = (source) => {
    const duration = d3.event && d3.event.altKey ? 2500 : 250;
    const nodes = root.descendants().reverse();
    const links = root.links();

    tree(root);

    let left = root;
    let right = root;
    root.eachBefore(node => {
      if (node.x < left.x) left = node;
      if (node.x > right.x) right = node;
    });

    const height = right.x - left.x + margin.top + margin.bottom;

    const transition = svg.transition()
        .duration(duration)
        .attr('viewBox', [-margin.left, left.x - margin.top, width, height])
        .tween('resize', window.ResizeObserver ? null : () => () => svg.dispatch('toggle'));

    const node = gNode.selectAll('g')
        .data(nodes, d => d.id);

    const nodeEnter = node.enter().append('g')
        .attr('transform', d => `translate(${source.y0},${source.x0})`)
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0)
        .on('click', d => {
          d.children = d.children ? null : d._children;
          update(d);
        });

    nodeEnter.append('circle')
        .attr('r', 2.5)
        .attr('fill', d => d._children ? '#555' : '#999')
        .attr('stroke-width', 10);

    nodeEnter.append('text')
        .attr('dy', '0.31em')
        .attr('x', d => d._children ? -6 : 6)
        .attr('text-anchor', d => d._children ? 'end' : 'start')
        .text(d => d.data.name)
        .clone(true).lower()
        .attr('stroke-linejoin', 'round')
        .attr('stroke-width', 3)
        .attr('stroke', 'white');

    node.merge(nodeEnter).transition(transition)
        .attr('transform', d => `translate(${d.y},${d.x})`)
        .attr('fill-opacity', 1)
        .attr('stroke-opacity', 1);

    node.exit().transition(transition).remove()
        .attr('transform', d => `translate(${source.y},${source.x})`)
        .attr('fill-opacity', 0)
        .attr('stroke-opacity', 0);

    const link = gLink.selectAll('path')
        .data(links, d => d.target.id);

    const linkEnter = link.enter().append('path')
        .attr('d', d => {
          const o = {x: source.x0, y: source.y0};
          return diagonal({source: o, target: o});
        });

    link.merge(linkEnter).transition(transition)
        .attr('d', diagonal);

    link.exit().transition(transition).remove()
        .attr('d', () => {
          const o = {x: source.x, y: source.y};
          return diagonal({source: o, target: o});
        });

    root.eachBefore(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  update(root);

  const chart = svg.node();
  chart.id = idElement;

  htmlElementContainer.append(chart);
}

/**
 * @function
 * @desc function for create a graph chart
 * @param {HTMLBodyElement} htmlElementContainer - container html element, where the chart is inserted
 * @param {string} idElement - chart id
 * @param {object} data - data to be plotted within the chart, with the structure:
 * <code>data: {
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

  nodeFunctions.forEach(({event, handler}) => node.on(event, handler));
  archesFunctions.forEach(({event, handler}) => link.on(event, handler));

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

module.exports = D3Module;
