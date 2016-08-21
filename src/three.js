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
import LatLon from 'geodesy/latlon-spherical';


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


const spline1 = () => {
  const arcData = arc({
    cellSize: 2, // 1 == points, 2 == lines, 3 == triangles
    x: 0, // x position of the center of the arc
    y: 0, // y position of the center of the arc
    z: 0, // z position of the center of the arc
    startRadian: 0, // start radian for the arc
    endRadian: 1.5, // end radian for the arc
    innerRadius: 250, // inner radius of the arc
    outerRadius: 250, // outside radius of the arc
    numBands: 1, // subdivision from inside out
    numSlices: 40, // subdivision along curve
    drawOutline: true // if cellSize == 2 draw only the outside of the shape
  });

  const points = arcData.positions
  //    .filter((_, i) => i % 2 === 0)
    .map(([x, y, z]) => new THREE.Vector3(x, y, z));

  const curve = new THREE.CatmullRomCurve3(points);

  const geometry = new THREE.Geometry();
  geometry.vertices = curve.getPoints(50);

  const material = new THREE.LineBasicMaterial({color: 0x00ff00, linewidth: 20});

  // Create the final Object3d to add to the scene
  return new THREE.Line(geometry, material);
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


// Using 30 midpoints + start + end for arc
const midpoints = (new Array(31)).join('.').split('.')
  .map((_, i) => (i + 1) / 31).slice(0, 30);


const EARTH_RADIUS = 200;

const toVector = (R = EARTH_RADIUS) => point => {
  const p = point.lat.toRadians();
  const l = point.lon.toRadians();

  // right-handed vector: x -> 0°E,0°N; y -> 90°E,0°N, z -> 90°N
  const x = R * Math.cos(p) * Math.cos(l);
  const y = R * Math.cos(p) * Math.sin(l);
  const z = R * Math.sin(p);

  return new THREE.Vector3(x, y, z);
};


const toVectorAboveEarth = toVector(220);


const attack = () => {
  const start = new LatLon(-122, 48);
  const end = new LatLon(-77, 39);
  const points = midpoints
    .map(p => start.intermediatePointTo(end, p))
    .map(toVectorAboveEarth);

  const curve = new THREE.CatmullRomCurve3(points);

  const geometry = new THREE.Geometry();
  geometry.vertices = curve.getPoints(50);

  const material = new THREE.LineBasicMaterial({color: 0x00ff00, linewidth: 20});

  return new THREE.Line(geometry, material);
};


export const run = ({canvas}) => {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 5000);
  camera.position.set(toVector(500)(-122, 48));
//   camera.position.set(0, 1, -3);
  camera.lookAt(toVector()(-122, 48));

  const controls = new OrbitControls(camera, canvas);
  controls.minDistance = 350;
  controls.maxDistance = 2000;
  controls.zoomSpeed = 0.2;
  controls.rotateSpeed = 0.1;
  controls.enablePan = false;
  controls.enableDamping = true;
//   setTimeout(() => controls.constraint.dollyOut(5));

  const mesh = earth();
  scene.add(mesh);
  scene.add(atmo());

//   setTimeout(() => controls.zoom = 1000, 50);

  const line = attack();
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
