import THREE from 'three';


export const toVector = radius => point => {
  const phi = (90 - point.lat) * Math.PI / 180;
  const theta = (180 - point.lon) * Math.PI / 180;
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
};
