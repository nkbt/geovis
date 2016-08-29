import * as THREE from 'three';
import {toVector} from './math';
import {distance, intermediatePoint} from './math';

export const arc = ({EARTH_RADIUS, POINTS}) => {
  const midpoints = [0].concat((new Array(POINTS - 1)).join('.').split('.')
    .map((_, i) => (i + 1) / (POINTS - 1)));


  const elevationCoefficients = midpoints.map(p => p === 1 ? 0 : Math.sin(Math.PI * p));
  const maxElevationCoefficient = 15 / Math.PI;

  return (from, to, width) => {
    const dist = distance(from, to, EARTH_RADIUS);
    const maxElevation = Math.sqrt(maxElevationCoefficient * dist);
    const elevations = elevationCoefficients
      .map(e => e * maxElevation + EARTH_RADIUS);

    const points = midpoints
      .map(p => intermediatePoint(from, to, p))
      .map((p, i) => toVector(p).multiplyScalar(elevations[i]));


    const curve = new THREE.CatmullRomCurve3(points);


    const path = curve;
    const segments = Math.round(Math.sqrt(dist) * 10);
    const radius = Math.sqrt(width) * 2;
    const radiusSegments = Math.round(radius * 3);
    const tubeGeom = new THREE.TubeGeometry(path, segments, radius, radiusSegments, false);
    const tubeMat = new THREE.MeshLambertMaterial({
      color: 0x00ff00
    });

    return new THREE.Mesh(tubeGeom, tubeMat);
  };
};
