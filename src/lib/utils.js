export const arr = num => {
  const result = [];
  for (let i = 0; i < num; i = i + 1) {
    result.push(i);
  }
  return result;
};

export const rnd = (min, max) =>
  Math.round(min + Math.random() * (max - min));
