import THREE from 'three';
import orbitControls from 'three-orbit-controls';
import {arc} from './arc';
import {toVector} from './toVector';
import {globe} from './globe';


const EARTH_RADIUS = 200;


const OrbitControls = orbitControls(THREE);


const SYD = [-33.865143, 151.209900];
const DARWIN = [-12.462827, 130.841782];
const NY = [40.730610, -73.935242];
const LONDON = [51.509865, -0.118092];
const VANCOUVER = [49.246292, -123.116226];
const MOSCOW = [55.751244, 37.618423];
const KYIV = [50.411198, 30.446634];


const attack = arc({EARTH_RADIUS, POINTS: 9});

const onResize = ({camera, renderer}) =>
  ({width, height}) => {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };


export const run = ({canvas, width, height}) => {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(50, width / height, 1, 5000);
  camera.position.copy(toVector(SYD).multiplyScalar(EARTH_RADIUS * 4));
  camera.lookAt(toVector(SYD).multiplyScalar(EARTH_RADIUS));

  const controls = new OrbitControls(camera, canvas);
  controls.minDistance = 350;
  controls.maxDistance = 2000;
  controls.zoomSpeed = 0.4;
  controls.rotateSpeed = 0.2;
//  controls.enablePan = false;
  controls.enablePan = true;
  controls.enableDamping = true;

  globe({EARTH_RADIUS}).map(mesh => scene.add(mesh));

  scene.add(attack(SYD, NY));
  scene.add(attack(SYD, DARWIN));
  scene.add(attack(KYIV, MOSCOW));
  scene.add(attack(VANCOUVER, NY));
  scene.add(attack(MOSCOW, VANCOUVER));
  scene.add(attack(LONDON, NY));

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


  return {raf, onResize: onResize({camera, renderer})};
};
