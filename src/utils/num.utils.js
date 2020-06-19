const numUtils = module.exports;

numUtils.getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;
