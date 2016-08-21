import THREE from 'three';

import topojson from 'topojson';
import world from './world-110m.json';
//import {vector} from './math';
import {toVector} from './toVector';


import LatLon from 'geodesy/latlon-vectors';



const mesh = topojson.mesh(world, world.objects.countries, (a, b) => a === b && a.id !== 10);
const countries = mesh.coordinates;
console.log(`countries`, countries)




export const globe = ({EARTH_RADIUS}) => {
  const material = new THREE.LineBasicMaterial({color: 0xffffff, linewidth: 2});

  const contry3d = country => {
    const points = country.map(toVector(EARTH_RADIUS));
    const curve = new THREE.CatmullRomCurve3(points);
//    curve.closed = true;

    const geometry = new THREE.Geometry();
    geometry.vertices = curve.getPoints(70);

    return new THREE.Line(geometry, material);
  };

  return countries.map(contry3d);
};
