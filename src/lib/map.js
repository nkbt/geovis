import * as THREE from 'three';
import {feature} from 'topojson';
import world from '../../world.json';


const blacklist = ['AQ'];

const countries = feature(world, world.objects.countries).features
  .filter(({properties: {cc}}) => !blacklist.includes(cc));

export const map = () => {

  const toVector = ([lat, lng]) => new THREE.Vector3(lng, 0, lat);

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
