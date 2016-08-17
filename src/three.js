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
import orbitControls from 'three-orbit-controls';
import world from './world.png';

const OrbitControls = orbitControls(THREE);


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

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 5000);

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
