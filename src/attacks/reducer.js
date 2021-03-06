import {rnd} from '../lib/utils';

const SYD = [-33.865143, 151.209900];
const DARWIN = [-12.462827, 130.841782];
const NY = [40.730610, -73.935242];
const SF = [38.006811, -122.667424];
const LONDON = [51.509865, -0.118092];
const VANCOUVER = [49.246292, -123.116226];
const MOSCOW = [55.751244, 37.618423];
const KYIV = [50.411198, 30.446634];
const TOKYO = [35.717243, 19.761646];
const MUMBAI = [19.064499, 72.919112];
const MADRID = [40.395906, -3.581182];
const DUBLIN = [53.464008, -6.218773];
const MIAMI = [25.669930, -80.126130];
const LIMA = [-12.126830, -77.042177];
const BUENOS_AIRES = [-34.309534, -58.700775];


const cities = [
  SYD,
  DARWIN,
  NY,
  SF,
  LONDON,
  VANCOUVER,
  MOSCOW,
  KYIV,
  TOKYO,
  MUMBAI,
  MADRID,
  DUBLIN,
  MIAMI,
  LIMA,
  BUENOS_AIRES
];


const colors = [
  0x33ff33,
  0xffff33,
  0xff3333
];


const sample = arr => arr[Math.round(Math.random() * (arr.length - 1))];

const mkAttack = (src, dst) => ({
  id: `${cities.indexOf(src)}|${cities.indexOf(dst)}`,
  srcLat: src[0],
  srcLon: src[1],
  dstLat: dst[0],
  dstLon: dst[1],
  value: rnd(1, 10),
  color: sample(colors)
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


const addRandom = state => {
  const src = sample(cities);
  const other = [].concat(cities);
  other.splice(cities.indexOf(src), 1);
  const dst = sample(other);

  return add(state, {attacks: [mkAttack(src, dst)]});
};


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

