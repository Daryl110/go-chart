/**
 * @namespace numUtils
 * @desc numerical utils function module
 */

/**
 * @memberOf numUtils
 * @function
 * @desc function to get a random number between two limits
 * @param {number} min - lower limit of the range to generate the random number
 * @param {number} max - upper limit of the range to generate the random number
 * @return {number} number random between the min and max number
 * @example getRandomInt(0, 500)
 */
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

module.exports = {
    getRandomInt
};
