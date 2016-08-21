import THREE from 'three';
import orbitControls from 'three-orbit-controls';
import LatLon from 'geodesy/latlon-spherical';
import {EARTH_RADIUS, earth, atmo} from './globe';


const OrbitControls = orbitControls(THREE);


// Using 30 midpoints + start + end for arc
const midpoints = (new Array(31)).join('.').split('.')
  .map((_, i) => (i + 1) / 31).slice(0, 30);


const toVector = (R = EARTH_RADIUS) => point => {
  const p = point.lat.toRadians();
  const l = point.lon.toRadians();

  // right-handed vector: x -> 0°E,0°N; y -> 90°E,0°N, z -> 90°N
  const x = R * Math.cos(p) * Math.cos(l);
  const y = R * Math.cos(p) * Math.sin(l);
  const z = R * Math.sin(p);

  return new THREE.Vector3(x, y, z);
};


const toVectorAboveEarth = toVector(EARTH_RADIUS * 1.05);
const toVectorOnEarth = toVector(EARTH_RADIUS);


const SYD = new LatLon(-33.865143, 151.209900);
const NY = new LatLon(40.730610, -73.935242);

const attack = (from, to) => {
  const points = [toVectorOnEarth(from)]
    .concat(midpoints
    //      .slice(5, midpoints.length - 5)
      .map(p => from.intermediatePointTo(to, p))
      .map(toVectorAboveEarth))
    .concat([toVectorOnEarth(to)]);

  const curve = new THREE.CatmullRomCurve3(points);

  const geometry = new THREE.Geometry();
  geometry.vertices = curve.getPoints(50);

  const material = new THREE.LineBasicMaterial({
    color: 0x00ff00,
    linewidth: 20
//    linejoin: 'miter'
  });

  return new THREE.Line(geometry, material);
};


export const run = ({canvas}) => {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 5000);
  camera.position.copy(toVector(EARTH_RADIUS * 4)(new LatLon(-122, 48)));
  camera.lookAt(toVectorOnEarth(new LatLon(-122, 48)));

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

  const line = attack(SYD, NY);
  scene.add(line);

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
