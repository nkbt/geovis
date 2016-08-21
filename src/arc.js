import THREE from 'three';
import {toVector} from './toVector';


export const arc = ({EARTH_RADIUS, POINTS}) => {
  const midpoints = [0].concat((new Array(POINTS - 1)).join('.').split('.')
    .map((_, i) => (i + 1) / (POINTS - 1)));


  const elevationCoefficients = midpoints.map(p => p === 1 ? 0 : Math.sin(Math.PI * p));
  const maxElevationCoefficient = EARTH_RADIUS / (2 * Math.PI * EARTH_RADIUS) / 2;

  return (from, to) => {
    const dist = from.distanceTo(to, EARTH_RADIUS);
    const maxElevation = maxElevationCoefficient * dist;
    const toElevatedVector = elevationCoefficients
      .map(e => toVector(e * maxElevation + EARTH_RADIUS));

    const points = midpoints
      .map(p => from.intermediatePointTo(to, p))
      .map((p, i) => toElevatedVector[i](p));


    const curve = new THREE.CatmullRomCurve3(points);

    const geometry = new THREE.Geometry();
    geometry.vertices = curve.getPoints(70);

    const material = new THREE.LineBasicMaterial({color: 0x00ff00, linewidth: 2});

    return new THREE.Line(geometry, material);
  };
};
