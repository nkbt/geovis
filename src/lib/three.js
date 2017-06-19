import * as THREE from 'three';
import TWEEN from 'tween.js';
import orbitControls from 'three-orbit-controls';
import {map} from './map';
import {line} from './line';
import {differ} from './differ';


import {bbox} from '../../world.json';
const [mapLeft, mapTop, mapRight, mapBottom] = bbox;
const ASPECT = (mapRight - mapLeft) / (mapBottom - mapTop);


const OrbitControls = orbitControls(THREE);


// Give some slight padding around map
const getScale = (width, height) => (
  0.98 * (width / height > ASPECT ?
    height / (mapBottom - mapTop) :
    width / (mapRight - mapLeft))
);


export const onCreate = ({
  element: canvas,
  attacks: initialAttacks,
  width: initialWidth,
  height: initialHeight,
  onCountrySelect,
  onCountryDeselect
}) => {
  const scene = new THREE.Scene();
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 0, 100);
  scene.add(light);


  const camera = new THREE.OrthographicCamera(
    initialWidth / -2,
    initialWidth / 2,
    initialHeight / 2,
    initialHeight / -2);
  camera.position.set(0, 0, 100);


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


  const mapGroup = map();
  scene.add(mapGroup);
  light.target = mapGroup;


  const attacksGroup = new THREE.Group();
  attacksGroup.name = 'attacks';
  scene.add(attacksGroup);


  const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: false});
  renderer.setSize(initialWidth, initialHeight);
  renderer.setClearColor(0x000000);


  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const onClick = event => {
    mouse.set(
      (event.clientX / (camera.right - camera.left)) * 2 - 1,
      -(event.clientY / (camera.top - camera.bottom)) * 2 + 1
    );
    raycaster.setFromCamera(mouse, camera);
    const [intersected] = raycaster.intersectObject(mapGroup, true);
    if (intersected) {
      const {object: {parent: country}} = intersected;
      if (country.selected) {
        onCountryDeselect([country.deselect()]);
      } else {
        onCountrySelect([country.select()]);
      }
    } else {
      onCountryDeselect(mapGroup.clearSelection());
    }
  };


  const render = () => {
    controls.update();
    renderer.render(scene, camera);
  };


  let raf = null;
  const animate = time => {
    raf = requestAnimationFrame(animate);
    attacksGroup.children.forEach(a => a.update({time}));
    TWEEN.update(time);
    render();
  };
  raf = requestAnimationFrame(animate);


  const globeAttacks = {};
  const diff = differ(globeAttacks);


  const removeAttack = id => {
    if (!(id in globeAttacks)) {
      return;
    }
    const a = attacksGroup.getObjectByName(id);
    const onDestroy = () => {
      attacksGroup.remove(a);
      delete globeAttacks[id];
    };
    a.destroy(onDestroy);
  };


  const updateAttack = attacks => id => {
    globeAttacks[id].value = attacks[id].value;
  };


  const addAttack = attacks => id => {
    const {srcLat, srcLon, dstLat, dstLon, color, value} = attacks[id];
    const obj = line([srcLat, srcLon], [dstLat, dstLon], value, color);
    obj.name = id;
    globeAttacks[id] = attacks[id];
    attacksGroup.add(obj);
  };


  const onUpdate = ({attacks, width, height}) => {
    const adder = addAttack(attacks);
    const updater = updateAttack(attacks);
    const remover = removeAttack;

    const {add, remove, update} = diff(attacks);

    // mutate
    remove.forEach(remover);
    update.forEach(updater);
    add.forEach(adder);

    // update camera
    const scale = getScale(width, height);
    camera.zoom = scale;
    controls.minZoom = scale;
    controls.maxZoom = scale * 5;

    renderer.setSize(width, height);

    camera.left = width / -2;
    camera.right = width / 2;
    camera.top = height / 2;
    camera.bottom = height / -2;
    camera.updateProjectionMatrix();
  };


  document.addEventListener('mousedown', onClick, false);
  const onDestroy = () => {
    cancelAnimationFrame(raf);
    Object.keys(globeAttacks).forEach(id => clearTimeout(globeAttacks[id]));
    document.removeEventListener('mousedown', onClick, false);
  };


  // Initial render
  onUpdate({attacks: initialAttacks, width: initialWidth, height: initialHeight});

  return {onDestroy, onUpdate};
};
