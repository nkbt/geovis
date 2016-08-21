import THREE from 'three';
import {vector} from './math';


export const toVector = radius => {
  const v = vector(radius);

  return point => {
    const [x, y, z] = v(point);
    return new THREE.Vector3(x, y, z);
  };
};
