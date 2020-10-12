const {
    appendChart,
    d3
} = require('../others/d3.utils');

/**
 * @memberOf D3Module
 * @function
 * @name collapsableTreeChart
 * @desc function for create a collapsable tree chart
 * @param {HTMLBodyElement} htmlElementContainer - container html element, where the chart is inserted
 * @param {string} idElement - chart id
 * @param {object} data - data to be plotted within the chart, with the structure:
 * <code>{ name: string, children: array[data] }</code>
 * @param {number=} [width=1050] - chart width inside the container
 * @param {number=} [height=300] - chart height inside the container
 * @param {Object=} [margin={ top: 10, right: 120, bottom: 10, left: 120 }] - view box container
 * @param {string=} [backgroundColor='white'] - background color for the chart
 * @see <img src="https://i.imgur.com/cOzfwr9.jpg"></img>
 * @example D3.collapsableTreeChart(
 *    document.getElementById('charts'),
 *    'collapsable_tree_chart',
 *    {
 *     name: 'root',
 *     children: [
 *       {
 *         name: 'node_1',
 *         children: [
 *           {
 *             name: 'node_1.1',
 *             children: [
 *               {
 *                 name: 'node_1.1.1'
 *               },
 *               {
 *                 name: 'node_1.1.2'
 *               },
 *               {
 *                 name: 'node_1.1.3'
 *               }
 *             ]
 *           }
 *         ]
 *       },
 *       {
 *         name: 'node_2',
 *         children: [
 *           {
 *             name: 'node_2.1',
 *             children: [
 *               {
 *                       name: 'node_2.1.1'
 *               },
 *               {
 *                 name: 'node_2.1.2'
 *               },
 *               {
 *                 name: 'node_2.1.3',
 *                 children: [
 *                   {
 *                     name: 'node_2.1.3.1',
 *                     children: [
 *                       {
 *                         name: 'node_2.1.3.1.1'
 *                       },
 *                       {
 *                         name: 'node_2.1.3.1.2'
 *                       },
 *                       {
 *                         name: 'node_2.1.3.1.3'
 *                       }
 *                     ]
 *                   }
 *                 ]
 *               }
 *             ]
 *           },
 *           {
 *             name: 'node_2.2'
 *           },
 *           {
 *             name: 'node_2.3'
 *           },
 *         ]
 *       }
 *     ]
 *   }
 * );
 */
module.exports = (
    htmlElementContainer,
    idElement,
    data,
    width = 1050,
    height = 300,
    margin = { top: 10, right: 120, bottom: 10, left: 120 },
    backgroundColor = 'white'
) => {
    const root = d3.hierarchy(data);
    const dx = 10, dy = 159;
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
    };

    update(root);
    appendChart(svg, idElement, htmlElementContainer);
}
