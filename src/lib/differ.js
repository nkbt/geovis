export const differ = cache => attacks => {
  // Find what to remove
  const remove = Object.keys(cache)
    .filter(id => !(id in attacks));

  // Find what to update
  const update = Object.keys(cache)
    .filter(id => id in attacks);

  // Find what to add
  const add = Object.keys(attacks)
    .filter(id => !(id in cache));

  return {add, update, remove};
};
