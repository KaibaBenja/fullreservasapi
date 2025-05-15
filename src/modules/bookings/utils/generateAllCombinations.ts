export function getAllCombinations(
  arr: number[],
  guests: number,
  overflowMargin = 12
): number[][] {
  const result: number[][] = [];

  const recurse = (
    current: number[],
    start: number,
    currentSum: number
  ) => {
    if (currentSum > guests + overflowMargin) return;

    if (currentSum >= guests) {
      result.push([...current]);
      // No return; seguimos buscando combinaciones con menos mesas o menor overflow
    }

    for (let i = start; i < arr.length; i++) {

      current.push(arr[i]);
      recurse(current, i + 1, currentSum + arr[i]);
      current.pop();
    }
  };

  const sorted = [...arr].sort((a, b) => b - a); // grandes primero
  recurse([], 0, 0);

  return result;
};