import {
  TubeGeometry,
  MeshLambertMaterial,
  Mesh
} from 'three';


export const tube = ({path, dist, width}) => {
  const segments = Math.round(Math.sqrt(dist) * 10);
  const radius = Math.sqrt(width) * 2;
  const radiusSegments = Math.round(radius * 3);
  const tubeGeom = new TubeGeometry(path, segments, radius, radiusSegments, false);
  const tubeMat = new MeshLambertMaterial({
    color: 0x00ff00
  });

  return new Mesh(tubeGeom, tubeMat);
};
