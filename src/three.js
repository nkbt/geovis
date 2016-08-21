import THREE from 'three';
import orbitControls from 'three-orbit-controls';
import LatLon from 'geodesy/latlon-spherical';
import {EARTH_RADIUS, earth, atmo} from './globe';
import {arc} from './arc';
import {toVector} from './toVector';


const OrbitControls = orbitControls(THREE);


const toVectorOnEarth = toVector(EARTH_RADIUS);


const DARWIN = new LatLon(-12.462827, 130.841782);
const SYD = new LatLon(-33.865143, 151.209900);
const NY = new LatLon(40.730610, -73.935242);
const LONDON = new LatLon(51.509865, -0.118092);
const VANCOUVER = new LatLon(49.246292, -123.116226);
const MOSCOW = new LatLon(55.751244, 37.618423);
const KYIV = new LatLon(50.411198, 30.446634);


const attack = arc({EARTH_RADIUS, POINTS: 9});


export const run = ({canvas}) => {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 5000);
  camera.position.copy(toVector(EARTH_RADIUS * 4)(SYD));
  camera.lookAt(toVectorOnEarth(SYD));

  const controls = new OrbitControls(camera, canvas);
  controls.minDistance = 350;
  controls.maxDistance = 2000;
  controls.zoomSpeed = 0.2;
  controls.rotateSpeed = 0.1;
  controls.enablePan = false;
  controls.enableDamping = true;

  const mesh = earth();
  scene.add(mesh);
  scene.add(atmo());

  scene.add(attack(SYD, NY));
  scene.add(attack(SYD, DARWIN));
  scene.add(attack(KYIV, MOSCOW));
  scene.add(attack(VANCOUVER, NY));
  scene.add(attack(MOSCOW, VANCOUVER));
  scene.add(attack(LONDON, NY));

  const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);


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

  return {raf};
};
