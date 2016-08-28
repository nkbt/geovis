import * as THREE from 'three';
import orbitControls from 'three-orbit-controls';
import {arc} from './arc';
import {toVector} from './toVector';
import {globe} from './globe';


const EARTH_RADIUS = 200;


const OrbitControls = orbitControls(THREE);


const SYD = [-33.865143, 151.209900];


const attack = arc({EARTH_RADIUS, POINTS: 9});

const onResize = ({camera, renderer}) =>
  ({width, height}) => {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };


const onData = ({scene}) => attacks => {
  Object.keys(attacks)
    .map(k => attacks[k])
    .forEach(({srcLat, srcLon, dstLat, dstLon, value}) =>
      scene.add(attack([srcLat, srcLon], [dstLat, dstLon], value)));
};


export const run = ({canvas, width, height}) => {
  const scene = new THREE.Scene();


  const light = new THREE.HemisphereLight(0xffffff, 0x000909, 1);
//  const light = new THREE.PointLight(0xff0000, 1, 1000);
//  light.position.set(50, 50, 50);
  scene.add(light);

  const camera = new THREE.PerspectiveCamera(50, width / height, 1, 5000);
  camera.position.copy(toVector(SYD).multiplyScalar(EARTH_RADIUS * 4));
  camera.lookAt(toVector(SYD).multiplyScalar(EARTH_RADIUS));

  const controls = new OrbitControls(camera, canvas);
  controls.minDistance = 350;
  controls.maxDistance = 2000;
  controls.zoomSpeed = 0.4;
  controls.rotateSpeed = 0.2;
  controls.enablePan = true;
  controls.enableDamping = true;

  globe({EARTH_RADIUS}).map(mesh => scene.add(mesh));

  const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: false});
  renderer.setSize(width, height);


  const render = () => {
    controls.update();
    renderer.render(scene, camera);
  };

  let raf = null;
  const animate = () => {
    raf = requestAnimationFrame(animate);
    render();
  };

  animate();


  return {
    raf,
    onResize: onResize({camera, renderer}),
    onData: onData({scene})
  };
};
