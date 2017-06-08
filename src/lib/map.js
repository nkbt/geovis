import * as THREE from 'three';
import {feature} from 'topojson';
import world from '../../world.json';


const blacklist = ['AQ'];

const countries = feature(world, world.objects.countries).features
  .filter(({properties: {cc}}) => !blacklist.includes(cc));

const [mapLeft, mapTop, mapRight, mapBottom] = world.bbox;
const ASPECT = (mapRight - mapLeft) / (mapBottom - mapTop);
console.log(`ASPECT`, ASPECT)

//  const aspect = maxWidth / maxHeight;
//  const width = aspect > ASPECT ? maxHeight * ASPECT : maxWidth;
//  const height = aspect > ASPECT ? maxHeight : maxWidth / ASPECT;



export const map = ({width: maxWidth, height: maxHeight}) => {
  const aspect = maxWidth / maxHeight;
  const width = aspect > ASPECT ? maxHeight * ASPECT : maxWidth;
  const height = aspect > ASPECT ? maxHeight : maxWidth / ASPECT;


  const [
    screenLeft, screenTop, screenRight, screenBottom
  ] = [width / -2, height / -2, width / 2, height / 2];


  const toVector = ([lat, lng]) => {
    const x = lng >= 0 ?
      lng * screenRight / mapRight :
      lng * screenLeft / mapLeft;

    const z = lat >= 0 ?
      lat * screenTop / mapTop :
      lat * screenBottom / mapBottom;

    return new THREE.Vector3(x, 0, z);
  };

  const material = new THREE.LineBasicMaterial({color: 0x666666, linewidth: 2});

  const threeCountry = country => {
    const points = country
      .map(([lon, lat]) => [lat, lon])
      .map(toVector);
//      .map(v => v.multiplyScalar(scale));

    const curve = new THREE.CatmullRomCurve3(points);
    curve.closed = true;

    const geometry = new THREE.Geometry();
    geometry.vertices = curve.getPoints(country.length);

    return new THREE.Line(geometry, material);
  };


  return countries
    .reduce(
      (result, country) => {
        if (country.geometry.type === 'Polygon') {
          return result.concat(country.geometry.coordinates.map(threeCountry));
        } else if (country.geometry.type === 'MultiPolygon') {
          return country.geometry.coordinates
            .reduce((r, polygon) => r.concat(polygon.map(threeCountry)), result);
        }
        return null;
      },
      []);
};
