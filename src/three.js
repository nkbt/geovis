/**
 * dat.globe Javascript WebGL Globe Toolkit
 * https://github.com/dataarts/webgl-globe
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

import THREE from 'three';
import world from './world.png';


const shaders = {
  earth: {
    uniforms: {
      texture: {type: 't', value: null}
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec2 vUv;
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vUv = uv;
      }
    `,
    fragmentShader: `
      uniform sampler2D texture;
      varying vec3 vNormal;
      varying vec2 vUv;
      void main() {
        vec3 diffuse = texture2D(texture, vUv).xyz;
        float intensity = 1.03 - dot(vNormal, vec3(0.05, 0.05, 0.5));
        vec3 atmosphere = vec3(1.0, 1.0, 1.0) * pow(intensity, 3.0);
        gl_FragColor = vec4(diffuse + atmosphere, 1.0);
      }
    `
  },
  atmosphere: {
    uniforms: {},
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize( normalMatrix * normal );
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      void main() {
        float intensity = pow( 0.8 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 12.0 );
        gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 ) * intensity;
      }
    `
  }
};


const earth = () => {
  const uniforms = THREE.UniformsUtils.clone(shaders.earth.uniforms);
  uniforms.texture.value = new THREE.TextureLoader().load(world);
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: shaders.earth.vertexShader,
    fragmentShader: shaders.earth.fragmentShader
  });

  const geometry = new THREE.SphereGeometry(200, 40, 30);

  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.y = Math.PI;

  return mesh;
};


const atmo = () => {
  const uniforms = THREE.UniformsUtils.clone(shaders.atmosphere.uniforms);
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: shaders.atmosphere.vertexShader,
    fragmentShader: shaders.atmosphere.fragmentShader,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true
  });

  const geometry = new THREE.SphereGeometry(200, 40, 30);

  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.set(1.1, 1.1, 1.1);

  return mesh;
};


export const run = ({canvas}) => {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 100000;

  const mesh = earth();
  scene.add(mesh);
  scene.add(atmo());

  const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);


  var overRenderer;

  var mouse = {x: 0, y: 0};
  var mouseOnDown = {x: 0, y: 0};
  var rotation = {x: 0, y: 0};
  var target = {x: Math.PI * 3 / 2, y: Math.PI / 6.0};
  var targetOnDown = {x: 0, y: 0};

  var distance = 100000;
  var distanceTarget = 100000;
  var PI_HALF = Math.PI / 2;


  const container = canvas;


  function onMouseDown(event) {
    event.preventDefault();

    container.addEventListener('mousemove', onMouseMove, false);
    container.addEventListener('mouseup', onMouseUp, false);
    container.addEventListener('mouseout', onMouseOut, false);

    mouseOnDown.x = -event.clientX;
    mouseOnDown.y = event.clientY;

    targetOnDown.x = target.x;
    targetOnDown.y = target.y;

    container.style.cursor = 'move';
  }

  function onMouseMove(event) {
    mouse.x = -event.clientX;
    mouse.y = event.clientY;

    const zoomDamp = distance / 1000;

    target.x = targetOnDown.x + (mouse.x - mouseOnDown.x) * 0.005 * zoomDamp;
    target.y = targetOnDown.y + (mouse.y - mouseOnDown.y) * 0.005 * zoomDamp;

    target.y = Math.min(Math.max(target.y, -PI_HALF), PI_HALF);
  }

  function onMouseUp(event) {
    container.removeEventListener('mousemove', onMouseMove, false);
    container.removeEventListener('mouseup', onMouseUp, false);
    container.removeEventListener('mouseout', onMouseOut, false);
    container.style.cursor = 'auto';
  }

  function onMouseOut(event) {
    container.removeEventListener('mousemove', onMouseMove, false);
    container.removeEventListener('mouseup', onMouseUp, false);
    container.removeEventListener('mouseout', onMouseOut, false);
  }

  function onMouseWheel(event) {
    event.preventDefault();
    if (overRenderer) {
      zoom(event.wheelDeltaY * 0.3);
    }
    return false;
  }

  function onWindowResize(event) {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
  }

  function zoom(delta) {
    distanceTarget = Math.min(2000, Math.max(350, distanceTarget - delta));
  }


  container.addEventListener('mousedown', onMouseDown, false);

  container.addEventListener('mousewheel', onMouseWheel, false);


  window.addEventListener('resize', onWindowResize, false);

  container.addEventListener('mouseover', function () {
    overRenderer = true;
  }, false);

  container.addEventListener('mouseout', function () {
    overRenderer = false;
  }, false);


  const render = () => {
//    mesh.rotation.x = mesh.rotation.x + 0.01;
//    mesh.rotation.y = mesh.rotation.y + 0.005;

    rotation.x += (target.x - rotation.x) * 0.1;
    rotation.y += (target.y - rotation.y) * 0.1;
    distance += (distanceTarget - distance) * 0.3;

    camera.position.x = distance * Math.sin(rotation.x) * Math.cos(rotation.y);
    camera.position.y = distance * Math.sin(rotation.y);
    camera.position.z = distance * Math.cos(rotation.x) * Math.cos(rotation.y);

    camera.lookAt(mesh.position);

    renderer.render(scene, camera);
  };

  let raf = null;
  const animate = () => {
    raf = requestAnimationFrame(animate);
    render();
  };


  distanceTarget = 1000;
  animate();

//  renderer.render(scene, camera);
  return {raf};
};
