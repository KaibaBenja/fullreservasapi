export function getAllCombinations(arr: number[]): number[][] {
  const result: number[][] = [];

  const recurse = (current: number[], rest: number[]): void => {
    if (current.length > 0) {
      result.push(current);
    }
    for (let i = 0; i < rest.length; i++) {
      recurse([...current, rest[i]], rest.slice(i + 1));
    }
  };

  recurse([], arr);
  return result;
};