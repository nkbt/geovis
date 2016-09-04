import * as THREE from 'three';
import TWEEN from 'tween.js';
import {toVector} from './math';
import {distance, intermediatePoint} from './math';
import {rnd, arr} from './utils';


const line = path => {
  const geometry = new THREE.Geometry();
  geometry.vertices = path.getPoints(70);
  geometry.computeLineDistances();

  const material = new THREE.LineDashedMaterial({
    dashSize: 1,
    gapSize: rnd(5, 30),
    color: 0x00ff00,
    linewidth: 2,
    transparent: true,
    opacity: 0.9
  });

  const lineObject = new THREE.Line(geometry, material);

  lineObject.tween = new TWEEN.Tween({opacity: 1})
    .to({opacity: 0}, 1000)
    .interpolation(TWEEN.Interpolation.CatmullRom)
    .onUpdate(function () {
      Object.assign(material, {opacity: this.opacity});
    });

  return lineObject;
};


export const arc = ({EARTH_RADIUS, POINTS}) => {
  const midpoints = [0].concat((new Array(POINTS - 1)).join('.').split('.')
    .map((_, i) => (i + 1) / (POINTS - 1)));


  const elevationCoefficients = midpoints.map(p => p === 1 ? 0 : Math.sin(Math.PI * p));
  const maxElevationCoefficient = 15 / Math.PI;


  return (from, to, width) => {
    const dist = distance(from, to, EARTH_RADIUS);
    const maxElevation = Math.sqrt(maxElevationCoefficient * dist);
    const points = midpoints
      .map(p => intermediatePoint(from, to, p));


    const lines = arr(width)
      .map(i => elevationCoefficients
        .map(e => e * (maxElevation + i) + EARTH_RADIUS))
      .map(elevations => new THREE.CatmullRomCurve3(points
        .map((p, i) => toVector(p).multiplyScalar(elevations[i]))))
      .map(line);

    const group = new THREE.Group();
    lines.forEach(l => group.add(l));

    group.destroy = callback => {
      let all = group.children.length;
      const onComplete = () => {
        all = all - 1;
        if (all > 0) {
          return;
        }
        callback();
      };

      group.children.forEach(l => {
        l.tween
          .onComplete(onComplete)
          .start();
      })
    }

    return group;
  };
};
