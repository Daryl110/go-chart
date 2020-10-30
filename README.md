# Go-Chart

go-chart is a project in development, which allows by calling a simple function to create straightforward or complex charts, which help to improve the development time of projects that perform data analysis.

# Implemented libraries and charts
* [Chartjs](https://www.chartjs.org/)
    * [bar chart](https://github.com/Daryl110/go-chart/wiki#bar-chart)
    * [pie chart](https://github.com/Daryl110/go-chart/wiki#pie-chart)
    * [line chart](https://github.com/Daryl110/go-chart/wiki#line-chart)
    * [scatter chart](https://github.com/Daryl110/go-chart/wiki#scatter-chart)
    * [doughnut chart](https://github.com/Daryl110/go-chart/wiki#doughnut-chart)
    * [polar area chart](https://github.com/Daryl110/go-chart/wiki#polar-area-chart)
    * [radar chart](https://github.com/Daryl110/go-chart/wiki#radar-chart)
* [D3](https://d3js.org/)
    * [collapsible tree chart](https://github.com/Daryl110/go-chart/wiki#collapsible-tree-chart)
    * [graph chart](https://github.com/Daryl110/go-chart/wiki#graph-chart)
    * [directional graph chart](https://github.com/Daryl110/go-chart/wiki#directional-graph-chart)
    * [bubble drag chart](https://github.com/Daryl110/go-chart/wiki#bubble-drag-chart)
    
# GET STARTED

### Preview Visualization

  [preview](https://pruebas-graph.firebaseapp.com/)

### install

    npm i @daryl110/go-chart
   
### implement
   <ul>
      <li>
        <h5>typescript or ecma</h5>
        <code>import { D3, chartJS } from '@daryl110/go-chart';</code>
      </li>
      <li>
        <h5>nodejs</h5>
        <code>const { D3, chartJS } = require('@daryl110/go-chart');</code>
      </li>
   </ul>
   
### usage

  To use the go-chart library it consists of the following, each library implemented within it is called a module and each public function of each graphical module is called a     graph, taking into account:

    module.chart(<parameters>);
  
  [more info](https://daryl110.github.io/go-chart-doc)
