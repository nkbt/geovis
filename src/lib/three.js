import * as THREE from 'three';
import TWEEN from 'tween.js';
import orbitControls from 'three-orbit-controls';
import {map} from './map';


const OrbitControls = orbitControls(THREE);
const ASPECT = 2;


export const onCreate = ({
  element: canvas,
  width: initialWidth,
  height: initialHeight
}) => {
  const scene = new THREE.Scene();

//  const cameraAspect = initialWidth / initialHeight;
//  const cameraWidth = cameraAspect > ASPECT ? initialHeight * ASPECT : initialWidth;
//  const cameraHeight = cameraAspect > ASPECT ? initialHeight : initialWidth / ASPECT;
//  const camera = new THREE.OrthographicCamera(
//    cameraWidth / -2,
//    cameraWidth / 2,
//    cameraHeight / -2,
//    cameraHeight / 2,
//    1,
//    5000);
  const camera = new THREE.OrthographicCamera(
    initialWidth / -2,
    initialWidth / 2,
    initialHeight / -2,
    initialHeight / 2,
    1,
    5000);
  camera.zoom = 1;


  const controls = new OrbitControls(camera, canvas);
  controls.minDistance = 350;
  controls.maxDistance = 2000;
  controls.minZoom = 1;
  controls.maxZoom = 4;
  controls.zoomSpeed = 0.4;
  controls.rotateSpeed = 0.2;
  controls.enablePan = true;
  controls.enableRotate = false;
  controls.enableDamping = true;


  map({width: initialWidth, height: initialHeight})
    .map(mesh => scene.add(mesh));

  const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: false});
//  renderer.setSize(cameraWidth, cameraHeight);
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
    renderer.setSize(width, height);

    camera.left = width / -2;
    camera.right = width / 2;
    camera.top = height / -2;
    camera.bottom = height / 2;
    camera.updateProjectionMatrix();
  };


//  const onUpdate = ({width: maxWidth, height: maxHeight}) => {
//    const aspect = maxWidth / maxHeight;
//    const width = aspect > ASPECT ? maxHeight * ASPECT : maxWidth;
//    const height = aspect > ASPECT ? maxHeight : maxWidth / ASPECT;
//
//    renderer.setSize(width, height);
//
//    camera.left = width / -2;
//    camera.right = width / 2;
//    camera.top = height / -2;
//    camera.bottom = height / 2;
//    camera.updateProjectionMatrix();
//  };
//
//
  const onDestroy = () => {
    cancelAnimationFrame(raf);
  };


//  onUpdate({width: initialWidth, height: initialHeight});


  return {onDestroy, onUpdate};
};
