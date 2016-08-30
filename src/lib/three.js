import * as THREE from 'three';
import TWEEN from 'tween.js';
import orbitControls from 'three-orbit-controls';
import {arc} from './arc';
import {toVector} from './math';
import {globe} from './globe';


const EARTH_RADIUS = 200;


const OrbitControls = orbitControls(THREE);


const SYD = [-33.865143, 151.209900];


const attack = arc({EARTH_RADIUS, POINTS: 9});


const noop = () => {
  // empty
};

export const onCreate = ({
  element: canvas,
  width: initialWidth,
  height: initialHeight
}) => {
  let stats = {begin: noop, end: noop};
  if (process.env.NODE_ENV !== 'production') {
    const Stats = require('stats.js');
    stats = new Stats();
    document.body.appendChild(stats.dom);
    stats.showPanel(0);
  }

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(50, initialWidth / initialHeight, 1, 5000);
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
  renderer.setSize(initialWidth, initialHeight);


  const render = () => {
    controls.update();
    renderer.render(scene, camera);
  };

  let raf = null;
  const animate = time => {
    stats.begin();
    TWEEN.update(time);
    render();
    stats.end();

    raf = requestAnimationFrame(animate);
  };
  raf = requestAnimationFrame(animate);


  const globeAttacks = {};


  const removeAttack = id => {
    scene.remove(scene.getObjectByName(id));
    clearTimeout(globeAttacks[id]);
    delete globeAttacks[id];
  };


  const onUpdate = ({attacks, width, height}) => {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);

    Object.keys(attacks)
      .map(k => attacks[k])
      .forEach(({id, srcLat, srcLon, dstLat, dstLon, value}) => {
        if (id in globeAttacks) {
          console.log(`globeAttacks[id]`, globeAttacks[id]);
          return;
        }
        const obj = attack([srcLat, srcLon], [dstLat, dstLon], value);
        obj.name = id;
//        globeAttacks[id] = setTimeout(() => removeAttack(id), 5000);
        scene.add(obj);
      });
    Object.keys(globeAttacks)
      .forEach(id => {
        if (id in attacks) {
          return;
        }
        removeAttack(id);
      });
  };


  const onDestroy = () => {
    cancelAnimationFrame(raf);
    Object.keys(globeAttacks).forEach(id => clearTimeout(globeAttacks[id]));
  };


  return {onDestroy, onUpdate};
};
