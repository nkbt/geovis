const initialState = {};


export const attackId = attack =>
  `${attack.srcLat}-${attack.srcLon}-${attack.dstLat}-${attack.dstLon}`;


export const add = (state, attacks = []) => attacks.reduce((result, attack) => {
  const id = attackId(attack);
  if (result[id]) {
    return {...result, [id]: {...result[id], value: result[id].value + attack.value}};
  }
  return {...result, [id]: {id, ...attack}};
}, state);


export const ATTACKS_ADD = 'ATTACKS_ADD';
export const attacks = (state = initialState, {type, ...action}) => (
  type === ATTACKS_ADD ?
    add(state, action) :
    state
);

