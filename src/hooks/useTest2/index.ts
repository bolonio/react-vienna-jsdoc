/**
 * This is a test hook that returns an object with a type property.
 *
 * @param {string} type - The type of the test.
 * @returns {{type: string}} An object containing the type.
 */

export const useTest2 = (type: string) => {
  return {
    type: type,
  };
};

export default useTest2;
