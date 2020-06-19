const ChartJSModule = module.exports;
const numUtils = require('../utils/num.utils');
const chartJS = require('../../lib/chartjs/Chart');

const createColor = (
  {
    red,
    green,
    blue,
    opacity = 1
  }
) => `rgba(${red}, ${green}, ${blue}, ${opacity})`;

/**
 * Bar chart build with library chart.js
 * @param title
 * @param htmlElementContainer
 * @param idElement
 * @param labels
 * @param datasets
 * @param horizontal
 * @param positionOfLegend
 * @param clickEventForEachElement
 */
ChartJSModule.barChart = (
  title,
  htmlElementContainer,
  idElement,
  labels,
  datasets,
  horizontal = false,
  positionOfLegend = 'top',
  clickEventForEachElement = () => { }
) => {
  const canvas = document.createElement('canvas');

  canvas.id = idElement;
  htmlElementContainer.append(canvas);

  const datasetsArray = [];

  datasets.forEach((
    {
      data,
      label,
      backgroundColor = undefined,
      borderColor = undefined,
      backgroundOpacity = false
    }
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
    ] : backgroundColor.substring(5, backgroundColor.length-1).split(',');

    const backgroundColorLabel = createColor(
      {
        red,
        green,
        blue,
        opacity: backgroundOpacity ? (opacity !== 1 ? opacity : 0.2) : opacity
      }
    );

    const borderColorLabel = !borderColor ? createColor(
      {
        red,
        green,
        blue
      }
    ) : borderColor;

    datasetsArray.push({
      label,
      data,
      backgroundColor: backgroundColorLabel,
      borderColor: borderColorLabel,
      borderWidth: 0.5
    })
  });

  let barChart = { };

  barChart = new chartJS(idElement, {
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
      onClick: ($event) => {
        const [item] = barChart.getElementAtEvent($event);

        if (!item) return null;

        const { _datasetIndex: datasetIndex, _index: index } = item;
        const label = barChart.data.labels[index];
        const value = barChart.data.datasets[datasetIndex].data[index];

        return clickEventForEachElement(value, label, datasetIndex, index, barChart);
      }
    }
  });

  return barChart;
};
