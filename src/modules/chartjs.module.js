/**
 * @module ChartJSModule
 * @desc module of chartjs
 */

const numUtils = require('../utils/num.utils');
const chartJS = require('chart.js');


/**
 * @function
 * @desc function to create rgba colors
 * @param {number} red - number between 0 and 255 that represents the amount of red within the rgba
 * @param {number} green - number between 0 and 255 that represents the amount of green within the rgba
 * @param {number} blue - number between 0 and 255 that represents the amount of blue within the rgba
 * @param {number} opacity - number between 0 and 1 that represents the amount of opacity within the rgba
 * @returns {string} value rgba color
 */
const createColor = (
    {
      red,
      green,
      blue,
      opacity = 1
    }
) => `rgba(${red}, ${green}, ${blue}, ${opacity})`;

/**
 * @function
 * @desc function to create colors inside datasets
 * @param {string} backgroundColor - background color for a dataset
 * @param {string} borderColor - border color for a dataset
 * @param {boolean} backgroundOpacity - background color opacity is true or false
 * @returns {{borderColorLabelItem: (string|undefined), backgroundColorLabelItem: string}} colors to dataset
 */
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
 * @function
 * @desc function to build a bar chart
 * @param {string} title - chart title
 * @param {HTMLBodyElement} htmlElementContainer - container html element, where the chart is inserted
 * @param {string} idElement - chart id
 * @param {array} labels - array of strings containing the labels of each value within the dataset
 * @param {array} datasets - array of objects containing the dataset groups taking into account the group of labels,
 * with the structure:
 * <code> [
 *         {
 *           data: array // array of numbers containing the values to be graphed,
 *           label: string // title of the dataset,
 *           backgroundColor: string // rgba string of the background color of the value,
 *           borderColor: string // rgba string the border color of the value,
 *           backgroundOpacity: boolean
 *         }
 * ]</code>
 * @param {boolean} horizontal - Boolean that demarcates whether the chart is horizontal or not
 * @param {string} positionOfLegend - legend position, which can be (top | bottom | left | right)
 * @param {function} clickEventForEachElement - callback function on event click on chart element
 * @return {*|{}}
 */
const barChart = (
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
      /**
       * @function
       * @desc callback function on event click on chart element
       * @param {object} $event - event that is obtained by clicking on the chart element
       * @returns {null|*} callback
       */
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

/**
 * @function
 * @desc function to build a pie chart
 * @param {string} title - chart title
 * @param {HTMLBodyElement} htmlElementContainer - container html element, where the chart is inserted
 * @param {string} idElement - chart id
 * @param {array} labels - array of strings containing the labels of each value within the dataset
 * @param {array} datasets - array of objects containing the dataset groups taking into account the group of labels,
 * with the structure:
 * <code> [
 *         {
 *           data: array // array of numbers containing the values to be graphed,
 *           label: string // title of the dataset,
 *           backgroundColor: string // rgba string of the background color of the value,
 *           backgroundOpacity: boolean
 *         }
 * ]</code>
 * @param {string} positionOfLegend - legend position, which can be (top | bottom | left | right)
 * @param {function} clickEventForEachElement - callback function on event click on chart element
 * @returns {*|{}}
 */
const pieChart = (
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






/**
 * @function
 * @desc function to build a bar chart
 * @param {string} title - chart title
 * @param {HTMLBodyElement} htmlElementContainer - container html element, where the chart is inserted
 * @param {string} idElement - chart id
 * @param {array} labels - array of strings containing the labels of each value within the dataset
 * @param {array} datasets - array of objects containing the dataset groups taking into account the group of labels,
 * with the structure:
 * <code> [
 *         {
 *           data: array // array of numbers containing the values to be graphed,
 *           label: string // title of the dataset,
 *           backgroundColor: string // rgba string of the background color of the value,
 *           borderColor: string // rgba string the border color of the value,
 *           backgroundOpacity: boolean
 *         }
 * ]</code>
 * @param {boolean} horizontal - Boolean that demarcates whether the chart is horizontal or not
 * @param {string} positionOfLegend - legend position, which can be (top | bottom | left | right)
 * @param {function} clickEventForEachElement - callback function on event click on chart element
 * @return {*|{}}
 */
const lineChart = (
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
  const { borderColorLabelItem } = createDatasetColor(borderColor);

  datasetsArray.push({
    label,
    data,
    //backgroundColor: backgroundColorLabelItem,
    borderColor: borderColorLabelItem,
    borderWidth: 4,
    fill: false
  })
});

let lineChart = { };

lineChart = new chartJS(idElement, {
  type: horizontal ? 'horizontalBar' : 'line',
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
   scales: {
     xAxes: [{
       display: true,
     }],
     yAxes: [{
       display: true,
       type: 'logarithmic'
     }]
   },
    /**
     * @function
     * @desc callback function on event click on chart element
     * @param {object} $event - event that is obtained by clicking on the chart element
     * @returns {null|*} callback
     */
    onClick: ($event) => {
      const [item] = lineChart.getElementAtEvent($event);

      if (!item) return null;

      const { _datasetIndex: datasetIndex, _index: index } = item;
      const label = lineChart.data.labels[index];
      const value = lineChart.data.datasets[datasetIndex].data[index];

      return clickEventForEachElement(value, label, datasetIndex, index, lineChart);
    }
  }
});

return lineChart;
};

module.exports = {
  barChart,
  pieChart,
  lineChart
};
