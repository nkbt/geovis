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
const sampleAttacks = [
  [SYD, NY],
  [SYD, DARWIN],
  [KYIV, MOSCOW],
  [VANCOUVER, NY],
  [MOSCOW, VANCOUVER],
  [LONDON, NY]
];

const sample = arr => arr[Math.round(Math.random() * (arr.length - 1))];

export const mkAttack = ([srcLat, srcLon], [dstLat, dstLon]) => ({
  srcLat, srcLon, dstLat, dstLon, value: rnd(5, 30)
});


export const attackId = attack =>
  `${attack.srcLat}|${attack.srcLon}|${attack.dstLat}|${attack.dstLon}`;


export const add = (state, {attacks = []}) => attacks.reduce((result, attack) => {
  const id = attackId(attack);
  if (result[id]) {
    return {...result, [id]: {...result[id], value: result[id].value + attack.value}};
  }
  return {...result, [id]: {id, ...attack}};
}, state);


const addRandom = state => add(state, {attacks: [mkAttack(sample(points), sample(points))]});


const initialState = sampleAttacks
  .map(attack => mkAttack(...attack))
  .reduce((st, a) => add(st, {attacks: [a]}), {});


export const ATTACKS_ADD = 'ATTACKS_ADD';
export const ATTACKS_ADD_RANDOM = 'ATTACKS_ADD_RANDOM';
export const attacks = (state = initialState, {type, ...action}) => {
  switch (type) {
    case ATTACKS_ADD:
      return add(state, action);
    case ATTACKS_ADD_RANDOM:
      return addRandom(state, action);
    default:
      return state;
  }
};

