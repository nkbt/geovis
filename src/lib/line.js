import * as THREE from 'three';
import TWEEN from 'tween.js';

const fragmentShader = `
uniform vec3 diffuse;
uniform float opacity;

uniform float dashSize;
uniform float totalSize;

varying float vLineDistance;

#include <common>
#include <color_pars_fragment>

void main() {
  if (mod(vLineDistance, totalSize) > dashSize) {
    discard;
  }

  vec3 outgoingLight = vec3(0.0);
  vec4 diffuseColor = vec4(diffuse, opacity);

  #include <color_fragment>

  outgoingLight = diffuseColor.rgb; // simple shader

  gl_FragColor = vec4(outgoingLight, diffuseColor.a);

  #include <premultiplied_alpha_fragment>
  #include <tonemapping_fragment>
  #include <encodings_fragment>
}
`;


const vertexShader = `
uniform float scale;
attribute float lineDistance;

varying float vLineDistance;

#include <common>
#include <color_pars_vertex>

void main() {
  #include <color_vertex>

  vLineDistance = scale * lineDistance;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const line = ([srcLat, srcLon], [dstLat, dstLon], width, color = 0x00ff00) => {
  const group = new THREE.Group();
  const material = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.common,
      THREE.UniformsLib.fog,
      {
        scale: {value: 1.2},
        dashSize: {value: 2},
        totalSize: {value: 4},
        diffuse: {value: new THREE.Color(color)},
        opacity: 0
      }
    ]),
    vertexShader,
    fragmentShader,
    transparent: true
  });
  const geometry = new THREE.Geometry();
  geometry.vertices.push(
    new THREE.Vector3(srcLon, srcLat, 0),
    new THREE.Vector3(dstLon, dstLat, 0)
  );
  geometry.computeLineDistances();
  const attack = new THREE.Line(geometry, material);

  attack.fadeOut = new TWEEN.Tween({opacity: 1})
    .to({opacity: 0}, 1000)
    .interpolation(TWEEN.Interpolation.CatmullRom);
  attack.fadeIn = new TWEEN.Tween({opacity: 0})
    .to({opacity: 1}, 1000)
    .interpolation(TWEEN.Interpolation.CatmullRom);
  attack.updater = function () {
    Object.assign(material.uniforms.opacity, {value: this.opacity});
  };
  attack.fadeOut.onUpdate(attack.updater);
  attack.fadeIn.onUpdate(attack.updater);
  group.add(attack);

  attack.fadeIn.start();

  group.destroy = callback => {
    let all = group.children.length;
    const onComplete = () => {
      all = all - 1;
      if (all > 0) {
        return;
      }
      callback();
    };
    group.children.forEach(l => {
      l.fadeIn.stop();
      l.fadeOut.onComplete(onComplete).start();
    });
  };

  return group;
};
