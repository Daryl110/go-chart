const ChartJSModule = module.exports;
const numUtils = require('../utils/num.utils');
const chartJS = require('chart.js');

const createColor = (
    {
      red,
      green,
      blue,
      opacity = 1
    }
) => `rgba(${red}, ${green}, ${blue}, ${opacity})`;

const createDatasetColor = (
    backgroundColor = undefined,
    borderColor = undefined,
    backgroundOpacity = undefined
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

  const backgroundColorLabelItem = createColor(
      {
        red,
        green,
        blue,
        opacity: backgroundOpacity ? (opacity !== 1 ? opacity : 0.2) : opacity
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
 * Bar chart build with library chartjs.module.js
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
    const { backgroundColorLabelItem, borderColorLabelItem } = createDatasetColor(backgroundColor, borderColor, backgroundOpacity);

    datasetsArray.push({
      label,
      data,
      backgroundColor: backgroundColorLabelItem,
      borderColor: borderColorLabelItem,
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

ChartJSModule.pieChart = (
    title,
    htmlElementContainer,
    idElement,
    labels,
    datasets,
    positionOfLegend = 'top',
    clickEventForEachElement = () => { }
) => {
  const canvas = document.createElement('canvas');
  const datasetsArray = [];
  let pieChart = { };

  canvas.id = idElement;
  htmlElementContainer.append(canvas);

  const [{ data: { length }}] = datasets;
  let colors = [];

  for (let i = 0; i < length; i++) {
    colors.push(createDatasetColor());
  }

  let flag = true;

  datasets.forEach((
      {
        data,
        label,
        backgroundColor = undefined,
        backgroundOpacity = false
      }
  ) => {
    const backgroundColorLabel = [];

    if ((backgroundColor || backgroundOpacity) && flag) {
      colors = [];
    }

    let count = 0;
    if (!backgroundColor && !backgroundOpacity) {
      data.forEach(() => {
        const { backgroundColorLabelItem } = colors[count];
        backgroundColorLabel.push(backgroundColorLabelItem);
        count++;
      });
    } else {
      flag = false;
      data.forEach(() => {
        let backgroundColorLabelItem;
        try {
          const {backgroundColorLabelItem: color} = colors[count];
          backgroundColorLabelItem = color;
        } catch (e) {
          colors.push(createDatasetColor(backgroundColor, undefined, backgroundOpacity));
          const { backgroundColorLabelItem: color } = colors[count];
          backgroundColorLabelItem = color;
        }
        backgroundColorLabel.push(backgroundColorLabelItem);
        count++;
      });
    }

    console.log(backgroundColorLabel);

    datasetsArray.push({
      label,
      data,
      backgroundColor: !backgroundColor ? backgroundColorLabel : backgroundColor
    })
  });

  pieChart = new chartJS(idElement, {
    type: 'pie',
    data: {
      labels,
      datasets: datasetsArray
    },
    options: {
      title: {
        display: true,
        text: title
      },
      responsive: true,
      legend: {
        position: positionOfLegend
      },
      onClick: ($event) => {
        const [item] = pieChart.getElementAtEvent($event);

        if (!item) return null;

        const { _datasetIndex: datasetIndex, _index: index } = item;
        const label = pieChart.data.labels[index];
        const value = pieChart.data.datasets[datasetIndex].data[index];

        return clickEventForEachElement(value, label, datasetIndex, index, pieChart);
      }
    }
  });

  return pieChart;
}
