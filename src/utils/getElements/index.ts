/**
 * This is a utility function that generates an array of elements with a specified name and number.
 *
 * @param {string} name - The name of the elements to be generated.
 * @param {number} n- The number of elements to be generated.
 * @returns {string[]} An array of elements with the specified name and number.
 */

export const getElements = (name: string, n: number) => {
  return Array.from({ length: n }, (_, i) => `${name}${i + 1}`);
};

export default getElements;
