import THREE from 'three';


export const toVector = ([lat, lon]) => {
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (180 - lon) * Math.PI / 180;

  const x = Math.sin(phi) * Math.cos(theta);
  const y = Math.cos(phi);
  const z = Math.sin(phi) * Math.sin(theta);


  return new THREE.Vector3(x, y, z);
};
