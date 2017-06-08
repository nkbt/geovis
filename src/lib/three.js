import * as THREE from 'three';
import TWEEN from 'tween.js';
import orbitControls from 'three-orbit-controls';
import {map} from './map';


import {bbox} from '../../world.json';
const [mapLeft, mapTop, mapRight, mapBottom] = bbox;
const ASPECT = (mapRight - mapLeft) / (mapBottom - mapTop);


const OrbitControls = orbitControls(THREE);


// Give some slight padding around map
const getScale = (width, height) =>
  0.98 * (width / height > ASPECT ?
    height / (mapBottom - mapTop) :
    width / (mapRight - mapLeft));


export const onCreate = ({
  element: canvas,
  width: initialWidth,
  height: initialHeight
}) => {
  const scene = new THREE.Scene();

  const camera = new THREE.OrthographicCamera(
    initialWidth / -2,
    initialWidth / 2,
    initialHeight / -2,
    initialHeight / 2);

  const initialScale = getScale(initialWidth, initialHeight);
  camera.zoom = initialScale;
  camera.updateProjectionMatrix();


  const controls = new OrbitControls(camera, canvas);
  controls.minDistance = 350;
  controls.maxDistance = 2000;
  controls.minZoom = initialScale;
  controls.maxZoom = initialScale * 5;
  controls.zoomSpeed = 0.4;
  controls.rotateSpeed = 0.2;
  controls.enablePan = true;
  controls.enableRotate = false;
  controls.enableDamping = true;


  map({width: initialWidth, height: initialHeight})
    .map(mesh => scene.add(mesh));

  const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: false});
  renderer.setSize(initialWidth, initialHeight);

  const render = () => {
    controls.update();
    renderer.render(scene, camera);
  };

  let raf = null;
  const animate = time => {
    TWEEN.update(time);
    render();
    raf = requestAnimationFrame(animate);
  };
  raf = requestAnimationFrame(animate);


  const onUpdate = ({width, height}) => {
    const scale = getScale(width, height);
    camera.zoom = scale;
    controls.minZoom = scale;
    controls.maxZoom = scale * 5;

    renderer.setSize(width, height);

    camera.left = width / -2;
    camera.right = width / 2;
    camera.top = height / -2;
    camera.bottom = height / 2;
    camera.updateProjectionMatrix();
  };

  const onDestroy = () => {
    cancelAnimationFrame(raf);
  };

  return {onDestroy, onUpdate};
};
