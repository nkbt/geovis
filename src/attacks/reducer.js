import {rnd} from '../lib/utils';

const SYD = [-33.865143, 151.209900];
const DARWIN = [-12.462827, 130.841782];
const NY = [40.730610, -73.935242];
const LONDON = [51.509865, -0.118092];
const VANCOUVER = [49.246292, -123.116226];
const MOSCOW = [55.751244, 37.618423];
const KYIV = [50.411198, 30.446634];
const points = [
  SYD,
  DARWIN,
  NY,
  LONDON,
  VANCOUVER,
  MOSCOW,
  KYIV
];
const colors = [
  0x33ff33,
  0xffff33,
  0xff3333
];


const sample = arr => arr[Math.round(Math.random() * (arr.length - 1))];

export const mkAttack = ([srcLat, srcLon], [dstLat, dstLon]) => ({
  id: `${srcLat}|${srcLon}|${dstLat}|${dstLon}|${performance.now()}`,
  srcLat, srcLon, dstLat, dstLon, value: rnd(5, 30), color: sample(colors)
});


export const add = (state, {attacks = []}) => attacks.reduce((result, attack) => {
  const id = attack.id;
  if (result[id]) {
    return {...result, [id]: {...result[id], value: result[id].value + attack.value}};
  }
  return {...result, [id]: attack};
}, state);


export const remove = (state, {ids = []}) => {
  const toRemove = ids.filter(id => id in state);
  if (!toRemove.length) {
    return state;
  }

  return Object.keys(state)
    .filter(id => toRemove.indexOf(id) === -1)
    .reduce((result, id) => Object.assign(result, {[id]: state[id]}), {});
};


const addRandom = state => add(state, {attacks: [mkAttack(sample(points), sample(points))]});


const initialState = {};


export const clear = () => ({});


export const ATTACKS_ADD = 'ATTACKS_ADD';
export const ATTACKS_ADD_RANDOM = 'ATTACKS_ADD_RANDOM';
export const ATTACKS_REMOVE = 'ATTACKS_REMOVE';
export const ATTACKS_CLEAR = 'ATTACKS_CLEAR';
export const attacks = (state = initialState, {type, ...action}) => {
  switch (type) {
    case ATTACKS_ADD:
      return add(state, action);
    case ATTACKS_ADD_RANDOM:
      return addRandom(state, action);
    case ATTACKS_REMOVE:
      return remove(state, action);
    case ATTACKS_CLEAR:
      return clear(state, action);
    default:
      return state;
  }
};

