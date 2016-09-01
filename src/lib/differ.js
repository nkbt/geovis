export const differ = cache => attacks => {
  // Find what to remove
  const remove = Object.keys(cache)
    .filter(key => !(key in attacks));

  // Find what to update
  const update = Object.keys(cache)
    .filter(key => key in attacks);

  // Find what to add
  const add = Object.keys(attacks)
    .filter(key => !(key in cache));

  return {add, update, remove};
};
